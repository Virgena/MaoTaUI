import { MaoElement } from "./base.ts";
import { bindRoving, setBoolAttr, syncScrollEdges, enableWheelScroll, enableDragScroll } from "../core/dom.ts";
import { emit } from "../core/events.ts";

/** `<mao-card>`：light DOM 容器。 */
export class MaoCard extends MaoElement {
  static get observedAttributes(): string[] {
    return ["color", "padding", "bordered", "hoverable", "clickable", "href", "transparent"];
  }

  constructor() {
    super();
    this.addEventListener("click", this.#onClick);
  }

  protected update(): void {
    const padding = this.attr("padding", "lg");
    this.classList.add("mt-card");
    ["sm", "md", "lg"].forEach((token) => this.classList.toggle(`mt-card-${token}`, token === padding));
    this.classList.toggle("mt-card-bordered", this.bool("bordered"));
    this.classList.toggle("mt-card-hoverable", this.bool("hoverable"));
    this.classList.toggle("mt-card-clickable", this.bool("clickable") || this.hasAttribute("href"));
    this.classList.toggle("mt-card-transparent", this.bool("transparent"));
    const color = this.getAttribute("color");
    if (color) this.style.setProperty("--c", `var(--mt-color-${color})`);
    else this.style.removeProperty("--c");
    if (this.hasAttribute("href")) {
      this.setAttribute("role", "link");
      this.tabIndex = 0;
    }
  }

  #onClick = (): void => {
    const href = this.getAttribute("href");
    if (href) window.location.assign(href);
  };
}

/** `<mao-header>`：shadow DOM 标题 + 描述 + end 插槽。 */
export class MaoHeader extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <div class="row"><div class="title" part="title"></div><span class="end" part="end"><slot name="end"></slot></span></div>
    <p class="desc" part="description"></p>
  `;
  static readonly styles = `
    :host { display: block; font-family: var(--mt-font); }
    .row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
    .title { font-weight: 600; line-height: var(--mt-lh-tight); letter-spacing: -0.01em; }
    .desc { margin: 4px 0 0; color: var(--mt-muted); font-size: var(--mt-fs-sm); }
    .desc:empty { display: none; }
    .end { flex: none; color: var(--mt-muted); font-size: var(--mt-fs-sm); }
    :host([level="1"]) .title { font-size: var(--mt-fs-2xl); }
    :host([level="2"]) .title, :host(:not([level])) .title { font-size: var(--mt-fs-xl); }
    :host([level="3"]) .title { font-size: var(--mt-fs-lg); }
  `;

  static get observedAttributes(): string[] {
    return ["name", "description", "level"];
  }

  protected update(): void {
    const title = this.q(".title");
    const desc = this.q(".desc");
    if (title) {
      title.textContent = this.attr("name");
      title.setAttribute("role", "heading");
      title.setAttribute("aria-level", this.attr("level", "2"));
    }
    if (desc) desc.textContent = this.attr("description");
  }
}

/** `<mao-segment>`：light DOM 分段项，选中态由父级 `mao-segmented` 维护。 */
export class MaoSegment extends MaoElement {
  static get observedAttributes(): string[] {
    return ["value", "disabled"];
  }

  protected update(): void {
    this.classList.add("mt-segmented-item");
    this.setAttribute("role", "tab");
    if (this.bool("disabled")) {
      this.setAttribute("aria-disabled", "true");
      this.tabIndex = -1;
    } else {
      this.removeAttribute("aria-disabled");
    }
  }
}

/** `<mao-segmented>`：light DOM 分段控制器。 */
export class MaoSegmented extends MaoElement {
  static get observedAttributes(): string[] {
    return ["value", "label", "disabled"];
  }

  #bound = false;
  #cleanupRoving: (() => void) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.addEventListener("click", this.#onClick);
      this.#cleanupRoving = bindRoving(this, "mao-segment", (item) => this.#activate(item));
      this.#bound = true;
    }
    this.#sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.#cleanupRoving?.();
    this.#cleanupRoving = null;
    this.#bound = false;
  }

  protected update(): void {
    this.classList.add("mt-segmented");
    this.setAttribute("role", "tablist");
    if (this.bool("disabled")) this.setAttribute("aria-disabled", "true");
    if (this.attr("label")) this.setAttribute("aria-label", this.attr("label"));
    this.#sync();
  }

  #items(): MaoSegment[] {
    return Array.from(this.querySelectorAll<MaoSegment>("mao-segment"));
  }

  #sync = (): void => {
    const value = this.attr("value");
    this.#items().forEach((item) => {
      const selected = item.getAttribute("value") === value;
      item.setAttribute("aria-selected", String(selected));
      item.classList.toggle("is-on", selected);
      item.tabIndex = selected ? 0 : -1;
    });
  };

  #activate(item: Element): void {
    if (this.bool("disabled") || item.hasAttribute("disabled")) return;
    const value = item.getAttribute("value") ?? item.textContent?.trim() ?? "";
    if (this.getAttribute("value") === value) return;
    this.setAttribute("value", value);
    emit(this, "mt-change", { value });
  }

  #onClick = (event: Event): void => {
    const target = (event.target as Element | null)?.closest?.("mao-segment");
    if (target) this.#activate(target);
  };
}

/** `<mao-chip>`：light DOM 可选中标签。 */
export class MaoChip extends MaoElement {
  static get observedAttributes(): string[] {
    return ["active", "disabled", "value"];
  }

  #bound = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.addEventListener("click", this.#toggle);
      this.addEventListener("keydown", this.#onKeyDown);
      this.#bound = true;
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#toggle);
    this.removeEventListener("keydown", this.#onKeyDown);
    this.#bound = false;
  }

  protected update(): void {
    this.classList.add("mt-chip");
    this.setAttribute("role", "button");
    this.setAttribute("aria-pressed", String(this.bool("active")));
    const disabled = this.bool("disabled");
    this.setAttribute("aria-disabled", String(disabled));
    this.tabIndex = disabled ? -1 : 0;
  }

  #toggle = (): void => {
    if (this.bool("disabled")) return;
    const active = !this.bool("active");
    setBoolAttr(this, "active", active);
    emit(this, "mt-toggle", { active, value: this.attr("value") });
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.#toggle();
  };
}

/** `<mao-scroll-shadow>`：shadow DOM 滚动容器，边缘用渐变提示。 */
export class MaoScrollShadow extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <div class="viewport" part="viewport"><slot></slot></div>
    <span class="edge start" part="edge-start" aria-hidden="true"></span>
    <span class="edge end" part="edge-end" aria-hidden="true"></span>
  `;
  static readonly styles = `
    :host { display: block; position: relative; min-width: 0; --mt-shadow-size: 2rem; --mt-shadow-color: var(--mt-bg); }
    .viewport {
      display: flex; gap: 8px; margin: 0; padding: 0;
      overflow: auto; scrollbar-width: none; outline: none;
    }
    .viewport::-webkit-scrollbar { display: none; }
    :host(:not([axis="vertical"])) .viewport {
      flex-direction: row; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden;
    }
    :host([axis="vertical"]) .viewport {
      flex-direction: column; flex-wrap: nowrap; height: 100%;
      overflow-x: hidden; overflow-y: auto;
    }
    :host([axis="vertical"]) { height: 100%; }
    :host([draggable]) .viewport { cursor: grab; }
    .viewport.is-drag { cursor: grabbing; user-select: none; }
    :host([scrollbar="thin"]) .viewport { scrollbar-width: thin; scrollbar-color: var(--mt-border) transparent; }
    :host([scrollbar="thin"]) .viewport::-webkit-scrollbar { display: block; width: 6px; height: 6px; }
    :host([scrollbar="thin"]) .viewport::-webkit-scrollbar-thumb { border-radius: 999px; background: var(--mt-border); }
    .edge { position: absolute; z-index: 1; pointer-events: none; opacity: 0; transition: opacity var(--mt-dur-fast) var(--mt-ease); }
    :host(:not([axis="vertical"])) .edge { top: 0; bottom: 0; width: var(--mt-shadow-size); }
    :host(:not([axis="vertical"])) .edge.start { left: 0; background: linear-gradient(to right, var(--mt-shadow-color), transparent); }
    :host(:not([axis="vertical"])) .edge.end { right: 0; background: linear-gradient(to left, var(--mt-shadow-color), transparent); }
    :host([axis="vertical"]) .edge { left: 0; right: 0; height: var(--mt-shadow-size); }
    :host([axis="vertical"]) .edge.start { top: 0; background: linear-gradient(to bottom, var(--mt-shadow-color), transparent); }
    :host([axis="vertical"]) .edge.end { bottom: 0; background: linear-gradient(to top, var(--mt-shadow-color), transparent); }
    :host([data-edge-start]) .edge.start { opacity: 1; }
    :host([data-edge-end]) .edge.end { opacity: 1; }
  `;

  static get observedAttributes(): string[] {
    return ["axis", "shadow-size", "shadow-color", "scrollbar", "wheel", "draggable"];
  }

  #viewport: HTMLElement | null = null;
  #observer: ResizeObserver | null = null;
  #cleanupWheel: (() => void) | null = null;
  #cleanupDrag: (() => void) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    const viewport = this.q<HTMLElement>(".viewport");
    this.#viewport = viewport;
    viewport?.addEventListener("scroll", this.#sync, { passive: true });
    if (typeof ResizeObserver !== "undefined" && viewport) {
      this.#observer = new ResizeObserver(() => this.#sync());
      this.#observer.observe(viewport);
    }
    window.addEventListener("resize", this.#sync, { passive: true });
    const slot = this.q<HTMLSlotElement>("slot");
    slot?.addEventListener("slotchange", this.#sync);
    this.#applyBehavior();
    this.#sync();
  }

  disconnectedCallback(): void {
    this.#viewport?.removeEventListener("scroll", this.#sync);
    this.#observer?.disconnect();
    this.#observer = null;
    window.removeEventListener("resize", this.#sync);
    this.q<HTMLSlotElement>("slot")?.removeEventListener("slotchange", this.#sync);
    this.#cleanupWheel?.();
    this.#cleanupDrag?.();
    this.#cleanupWheel = null;
    this.#cleanupDrag = null;
  }

  protected update(): void {
    const size = this.getAttribute("shadow-size");
    if (size) this.style.setProperty("--mt-shadow-size", size);
    else this.style.removeProperty("--mt-shadow-size");
    const color = this.getAttribute("shadow-color");
    if (color) this.style.setProperty("--mt-shadow-color", color);
    else this.style.removeProperty("--mt-shadow-color");
    const viewport = this.q<HTMLElement>(".viewport");
    if (viewport) {
      const scrollbar = this.attr("scrollbar", "none");
      viewport.dataset.scrollbar = scrollbar;
    }
    this.#applyBehavior();
    this.#sync();
  }

  #applyBehavior(): void {
    this.#cleanupWheel?.();
    this.#cleanupWheel = null;
    this.#cleanupDrag?.();
    this.#cleanupDrag = null;
    const viewport = this.#viewport;
    if (!viewport) return;
    if (this.bool("wheel") && this.attr("axis", "horizontal") !== "vertical") {
      this.#cleanupWheel = enableWheelScroll(viewport, true);
    }
    if (this.bool("draggable") && this.attr("axis", "horizontal") !== "vertical") {
      this.#cleanupDrag = enableDragScroll(viewport);
    }
  }

  #sync = (): void => {
    const viewport = this.#viewport;
    if (!viewport) return;
    syncScrollEdges(viewport, this.attr("axis", "horizontal") === "vertical" ? "vertical" : "horizontal");
  };
}

/** `<mao-dialog>`：shadow DOM 原生 dialog。 */
export class MaoDialog extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <dialog part="dialog">
      <div class="panel">
        <header class="head">
          <div class="title" part="title"></div>
          <button class="close" part="close" type="button" aria-label="关闭">×</button>
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer class="foot"><slot name="actions"></slot></footer>
      </div>
    </dialog>
  `;
  static readonly styles = `
    :host { display: contents; font-family: var(--mt-font); }
    dialog {
      width: min(440px, calc(100vw - 32px));
      padding: 0; border: 1px solid var(--mt-border);
      border-radius: var(--mt-radius-xl);
      background: var(--mt-surface); color: var(--mt-text);
      box-shadow: var(--mt-shadow-overlay);
    }
    :host([size="sm"]) dialog { width: min(360px, calc(100vw - 32px)); }
    :host([size="lg"]) dialog { width: min(640px, calc(100vw - 32px)); }
    dialog::backdrop { background: rgb(24 20 20 / 0.42); backdrop-filter: blur(2px); }
    .panel { display: flex; flex-direction: column; gap: 12px; padding: 24px; }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .title { margin: 0; font-size: var(--mt-fs-xl); font-weight: 600; line-height: var(--mt-lh-tight); }
    .title:empty { display: none; }
    .close {
      appearance: none; border: 0; background: transparent;
      color: var(--mt-muted); cursor: pointer; padding: 2px 6px;
      font-size: 20px; line-height: 1; border-radius: var(--mt-radius-sm);
    }
    .close:hover { color: var(--mt-text); background: var(--mt-surface-2); }
    .close:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 2px; }
    .body { color: var(--mt-muted); font-size: var(--mt-fs-md); line-height: var(--mt-lh); }
    .foot { display: flex; justify-content: flex-end; gap: 8px; }
    .foot:not(:has(slot[name="actions"]::slotted(*))) { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["open", "heading", "size", "closable"];
  }

  #bound = false;

  connectedCallback(): void {
    super.connectedCallback();
    const dialog = this.q<HTMLDialogElement>("dialog");
    if (dialog && !this.#bound) {
      dialog.addEventListener("close", this.#onNativeClose);
      dialog.addEventListener("click", this.#onBackdrop);
      this.#bound = true;
    }
    this.#applyOpen();
  }

  disconnectedCallback(): void {
    const dialog = this.q<HTMLDialogElement>("dialog");
    dialog?.removeEventListener("close", this.#onNativeClose);
    dialog?.removeEventListener("click", this.#onBackdrop);
    this.#bound = false;
  }

  protected update(): void {
    const title = this.q(".title");
    if (title) title.textContent = this.attr("heading");
    const close = this.q<HTMLElement>(".close");
    if (close) close.hidden = !this.bool("closable");
    this.#applyOpen();
  }

  show(): void {
    this.setAttribute("open", "");
  }

  close(): void {
    this.removeAttribute("open");
  }

  #applyOpen(): void {
    const dialog = this.q<HTMLDialogElement>("dialog");
    if (!dialog) return;
    if (this.bool("open") && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      emit(this, "mt-open", {});
    } else if (!this.bool("open") && dialog.open) {
      dialog.close();
    }
  }

  #onNativeClose = (): void => {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
      emit(this, "mt-close", {});
    }
  };

  #onBackdrop = (event: MouseEvent): void => {
    if (event.target !== this.q("dialog")) return;
    if (!this.bool("closable")) return;
    this.close();
  };
}
