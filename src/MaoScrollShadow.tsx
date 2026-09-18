import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

export interface MaoScrollShadowProps extends HTMLAttributes<HTMLDivElement> {
  axis?: "horizontal" | "vertical";
  shadowSize?: string;
  shadowColor?: string;
  scrollbar?: "auto" | "hide" | "thin";
  wheel?: boolean | "contain";
  draggable?: boolean;
  ariaLabel?: string;
  contentClass?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function MaoScrollShadow({
  axis = "horizontal",
  shadowSize = "2rem",
  shadowColor = "var(--mt-bg)",
  scrollbar = "hide",
  wheel = false,
  draggable = false,
  ariaLabel = "scrollable content",
  contentClass = "",
  className = "",
  style,
  children,
  ...rest
}: MaoScrollShadowProps) {
  const area = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const sync = useCallback(() => {
    const el = area.current;
    if (!el) return;
    const horizontal = axis === "horizontal";
    const pos = horizontal ? el.scrollLeft : el.scrollTop;
    const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setEdges({ start: pos > 1, end: max > 1 && pos < max - 1 });
  }, [axis]);

  useEffect(() => {
    sync();
    const el = area.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [sync, children]);

  useEffect(() => {
    const el = area.current;
    if (!el || !wheel || axis !== "horizontal") return;
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;
      const next = clamp(el.scrollLeft + event.deltaY, 0, max);
      if (next === el.scrollLeft && wheel !== "contain") return;
      event.preventDefault();
      el.scrollLeft = next;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [wheel, axis]);

  useEffect(() => {
    const el = area.current;
    if (!el || !draggable || axis !== "horizontal") return;
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
  }, [draggable, axis]);

  return (
    <div
      {...rest}
      className={`mt-scroll-shadow mt-scroll-${axis}${draggable ? " mt-scroll-draggable" : ""} ${className}`.trim()}
      style={{ "--mt-shadow-size": shadowSize, "--mt-shadow-color": shadowColor, ...style } as CSSProperties}
    >
      {edges.start ? <span className="mt-scroll-edge is-start" aria-hidden="true" /> : null}
      {edges.end ? <span className="mt-scroll-edge is-end" aria-hidden="true" /> : null}
      <div
        ref={area}
        className={`mt-scroll-area ${contentClass}`.trim()}
        data-scrollbar={scrollbar}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={sync}
      >
        {children}
      </div>
    </div>
  );
}
