export type Axis = "horizontal" | "vertical";

export function boolAttr(el: Element, name: string): boolean {
  return el.hasAttribute(name);
}

export function setBoolAttr(el: Element, name: string, value: boolean): void {
  if (value === el.hasAttribute(name)) return;
  if (value) el.setAttribute(name, "");
  else el.removeAttribute(name);
}

export function strAttr(el: Element, name: string, fallback = ""): string {
  return el.getAttribute(name) ?? fallback;
}

export function numAttr(el: Element, name: string, fallback = 0): number {
  const raw = el.getAttribute(name);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

/** 解析逗号分隔的数值列表，例如 "38,57,44"。 */
export function listAttr(el: Element, name: string): number[] {
  const raw = el.getAttribute(name);
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 把列表项的 tabindex 做成「单项可聚焦」。 */
export function applyRoving(items: readonly HTMLElement[], activeIndex: number): void {
  items.forEach((item, index) => {
    item.tabIndex = index === activeIndex ? 0 : -1;
    item.setAttribute("aria-selected", String(index === activeIndex));
  });
}

/**
 * 方向键 / Home / End 的 roving focus。
 * 返回解绑函数。
 */
export function bindRoving(
  container: HTMLElement,
  selector: string,
  onActivate: (item: HTMLElement, index: number) => void,
): () => void {
  const listener = (event: Event) => {
    if (!(event instanceof KeyboardEvent)) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
      (item) => !item.hasAttribute("disabled"),
    );
    if (items.length === 0) return;
    const current = items.findIndex((item) => item === document.activeElement);
    const from = current < 0 ? 0 : current;
    let next = from;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (from + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (from - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    const item = items[next];
    if (!item) return;
    item.focus();
    onActivate(item, next);
  };
  container.addEventListener("keydown", listener);
  return () => container.removeEventListener("keydown", listener);
}

/** 收集可聚焦元素（用于焦点陷阱 / 初始焦点）。 */
export function focusable(root: ParentNode): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
}

/** 同步滚动边缘状态到 data-edge-start / data-edge-end。 */
export function syncScrollEdges(el: HTMLElement, axis: Axis): { start: boolean; end: boolean } {
  const horizontal = axis === "horizontal";
  const pos = horizontal ? el.scrollLeft : el.scrollTop;
  const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
  const start = pos > 1;
  const end = max > 1 && pos < max - 1;
  setBoolAttr(el, "data-edge-start", start);
  setBoolAttr(el, "data-edge-end", end);
  return { start, end };
}

/** 横向滚轮滚动。返回解绑函数。 */
export function enableWheelScroll(el: HTMLElement, contain: boolean): () => void {
  const listener = (event: WheelEvent) => {
    if (event.deltaY === 0) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) return;
    const next = clamp(el.scrollLeft + event.deltaY, 0, max);
    if (next === el.scrollLeft && !contain) return;
    event.preventDefault();
    el.scrollLeft = next;
  };
  el.addEventListener("wheel", listener, { passive: false });
  return () => el.removeEventListener("wheel", listener);
}

/** 指针拖拽滚动。返回解绑函数。 */
export function enableDragScroll(el: HTMLElement): () => void {
  let from = 0;
  let left = 0;
  let dragged = false;
  const down = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    from = event.clientX;
    left = el.scrollLeft;
    dragged = false;
    el.setPointerCapture(event.pointerId);
    el.classList.add("is-drag");
  };
  const move = (event: PointerEvent) => {
    if (!el.hasPointerCapture(event.pointerId)) return;
    const dx = event.clientX - from;
    if (Math.abs(dx) > 4) dragged = true;
    el.scrollLeft = left - dx;
  };
  const up = (event: PointerEvent) => {
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    el.classList.remove("is-drag");
  };
  const click = (event: MouseEvent) => {
    if (!dragged) return;
    dragged = false;
    event.preventDefault();
    event.stopPropagation();
  };
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("click", click, true);
  return () => {
    el.removeEventListener("pointerdown", down);
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", up);
    el.removeEventListener("pointercancel", up);
    el.removeEventListener("click", click, true);
    el.classList.remove("is-drag");
  };
}

/** 复制文本：优先 Clipboard API，降级 execCommand。返回是否成功。 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* 继续降级 */
    }
  }
  if (typeof document === "undefined") return false;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
