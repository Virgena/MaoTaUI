import { MaoElement } from "./base.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";

const TONE_ICONS: Record<string, string> = {
  info: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "circle-alert",
};

/** `<mao-toast>`：瞬时消息，通常由 `toast()` 注入。 */
export class MaoToast extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="mark" part="mark"></span>
    <div class="body">
      <div class="title" part="title"></div>
      <div class="content" part="content"><slot></slot></div>
    </div>
    <button class="close" part="close" type="button" aria-label="关闭"></button>
  `;
  static override readonly styles = `
    :host {
      display: grid;
      grid-template-columns: 18px 1fr auto;
      align-items: start;
      gap: 2px 10px;
      box-sizing: border-box;
      padding: 12px 14px;
      border: 1px solid var(--mt-border);
      border-radius: var(--mt-radius-md);
      background: var(--mt-surface);
      box-shadow: var(--mt-shadow-overlay);
      color: var(--mt-text);
      font-family: var(--mt-font);
      font-size: var(--mt-fs-sm);
      line-height: 1.55;
      animation: mt-toast-in var(--mt-dur) var(--mt-ease);
    }
    @keyframes mt-toast-in { from { opacity: 0; transform: translateY(6px); } }
    .mark { display: grid; place-items: center; width: 18px; height: 18px; margin-top: 1px; color: var(--mt-muted); }
    .title { font-weight: 600; line-height: 1.4; }
    .title:empty { display: none; }
    .content:empty { display: none; }
    .close {
      appearance: none; border: 0; background: transparent; padding: 0 2px;
      color: var(--mt-faint); cursor: pointer; line-height: 0; border-radius: var(--mt-radius-sm);
    }
    .close:hover { color: var(--mt-text); }
    .close:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 2px; }
    :host(:not([closable])) .close { display: none; }
    :host([tone="success"]) .mark { color: var(--mt-sage); }
    :host([tone="warning"]) .mark { color: var(--mt-color-warning); }
    :host([tone="danger"]) .mark { color: var(--mt-danger); }
  `;

  static get observedAttributes(): string[] {
    return ["tone", "heading", "closable"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const close = this.q<HTMLButtonElement>(".close");
    if (close && !this.#bound) {
      close.addEventListener("click", () => this.dismiss());
      this.#bound = true;
    }
  }

  protected override update(): void {
    const tone = this.attr("tone", "info");
    const mark = this.q(".mark");
    const title = this.q(".title");
    const close = this.q(".close");
    if (mark) mark.innerHTML = iconSvg(TONE_ICONS[tone] ?? "info", { size: 16 });
    if (title) title.textContent = this.attr("heading");
    if (close) close.innerHTML = iconSvg("x", { size: 14 });
    this.setAttribute("role", tone === "danger" ? "alert" : "status");
    this.setAttribute("aria-live", tone === "danger" ? "assertive" : "polite");
  }

  /** 关闭并派发 `mt-close`；宿主负责把它从 DOM 移除。 */
  dismiss(): void {
    emit(this, "mt-close", {});
    this.remove();
  }
}

/** `<mao-spinner>`：不确定进度指示。 */
export class MaoSpinner extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="ring" part="ring"></span>
    <span class="label" part="label"></span>
  `;
  static override readonly styles = `
    :host {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--mt-font); font-size: var(--mt-fs-sm); color: var(--mt-muted);
    }
    .ring {
      display: block; flex: none;
      box-sizing: border-box;
      width: 1em; height: 1em;
      border: 2px solid var(--mt-border);
      border-top-color: var(--mt-accent);
      border-radius: 50%;
      animation: mt-spin 720ms linear infinite;
      font-size: 16px;
    }
    @keyframes mt-spin { to { transform: rotate(360deg); } }
    :host([size="sm"]) .ring { font-size: 12px; }
    :host([size="lg"]) .ring { font-size: 28px; }
    .label:empty { display: none; }
    @media (prefers-reduced-motion: reduce) {
      .ring { animation: none; border-top-color: var(--mt-accent); }
    }
  `;

  static get observedAttributes(): string[] {
    return ["size", "label"];
  }

  protected override update(): void {
    const label = this.q(".label");
    if (label) label.textContent = this.attr("label");
    this.setAttribute("role", "status");
    this.setAttribute("aria-label", this.attr("label", "加载中"));
  }
}

/** `<mao-skeleton>`：占位骨架。 */
export class MaoSkeleton extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="avatar" part="avatar"></span>
    <div class="lines" part="lines"></div>
  `;
  static override readonly styles = `
    :host { display: block; font-family: var(--mt-font); }
    :host {
      --mt-skeleton-base: var(--mt-surface-2);
      --mt-skeleton-hi: color-mix(in srgb, var(--mt-surface) 70%, var(--mt-surface-2));
    }
    :host { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--mt-skeleton-base);
    }
    :host(:not([avatar])) .avatar { display: none; }
    :host(:not([avatar])) { grid-template-columns: 1fr; }
    .lines { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .line {
      height: 12px; border-radius: var(--mt-radius-sm);
      background: var(--mt-skeleton-base);
    }
    .line:last-child { width: 62%; }
    :host([block]) .line, :host([block]) .lines { height: 100%; }
    :host([animated]) .line, :host([animated]) .avatar {
      background-image: linear-gradient(90deg, transparent, var(--mt-skeleton-hi), transparent);
      background-size: 200% 100%;
      background-color: var(--mt-skeleton-base);
      animation: mt-skeleton 1.4s ease-in-out infinite;
    }
    @keyframes mt-skeleton { from { background-position: 140% 0; } to { background-position: -40% 0; } }
    @media (prefers-reduced-motion: reduce) {
      :host([animated]) .line, :host([animated]) .avatar { animation: none; }
    }
  `;

  static get observedAttributes(): string[] {
    return ["lines", "avatar", "block", "animated"];
  }

  protected override update(): void {
    const lines = this.q(".lines");
    if (!lines) return;
    const count = Math.max(1, this.num("lines", 3));
    lines.textContent = "";
    for (let index = 0; index < count; index += 1) {
      const line = document.createElement("span");
      line.className = "line";
      lines.append(line);
    }
    this.setAttribute("aria-hidden", "true");
  }
}

/** `<mao-empty>`：空态。 */
export class MaoEmpty extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="mark" part="mark"></span>
    <div class="title" part="title"></div>
    <p class="desc" part="description"></p>
    <div class="actions" part="actions"><slot></slot></div>
  `;
  static override readonly styles = `
    :host {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 28px 16px; text-align: center;
      font-family: var(--mt-font); color: var(--mt-muted);
    }
    .mark {
      display: grid; place-items: center;
      width: 44px; height: 44px; margin-bottom: 4px;
      border-radius: 50%;
      background: var(--mt-surface-2); color: var(--mt-faint);
    }
    .title { color: var(--mt-text); font-size: var(--mt-fs-md); font-weight: 600; }
    .title:empty { display: none; }
    .desc { margin: 0; font-size: var(--mt-fs-sm); line-height: var(--mt-lh); }
    .desc:empty { display: none; }
    .actions { margin-top: 10px; display: flex; gap: 8px; }
    :host(:not([has-actions])) .actions { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["icon", "title", "description"];
  }

  protected override update(): void {
    const mark = this.q(".mark");
    const title = this.q(".title");
    const desc = this.q(".desc");
    if (mark) mark.innerHTML = iconSvg(this.attr("icon", "inbox"), { size: 22 });
    if (title) title.textContent = this.attr("title");
    if (desc) desc.textContent = this.attr("description");
    if (this.childElementCount > 0) this.setAttribute("has-actions", "");
    else this.removeAttribute("has-actions");
  }
}

/** `<mao-tooltip>`：悬浮提示，包住默认插槽内容。 */
export class MaoTooltip extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="anchor" part="anchor"><slot></slot></span>
    <span class="bubble" part="bubble" role="tooltip"></span>
  `;
  static override readonly styles = `
    :host { position: relative; display: inline-flex; align-items: center; font-family: var(--mt-font); }
    .bubble {
      position: absolute; z-index: 40;
      max-width: 220px; width: max-content;
      padding: 5px 8px;
      border-radius: var(--mt-radius-sm);
      background: var(--mt-text); color: var(--mt-bg);
      font-size: var(--mt-fs-xs); line-height: 1.4;
      white-space: nowrap;
      opacity: 0; visibility: hidden;
      transition: opacity var(--mt-dur-fast) var(--mt-ease);
      pointer-events: none;
    }
    :host([data-open]) .bubble { opacity: 1; visibility: visible; }
    :host(:not([placement])) .bubble, :host([placement="top"]) .bubble { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    :host([placement="bottom"]) .bubble { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    :host([placement="start"]) .bubble { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
    :host([placement="end"]) .bubble { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
    .bubble:empty { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["content", "placement", "delay"];
  }

  #bound = false;
  #timer: ReturnType<typeof setTimeout> | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.#bound) return;
    this.addEventListener("mouseenter", this.#show);
    this.addEventListener("focusin", this.#show);
    this.addEventListener("mouseleave", this.#hide);
    this.addEventListener("focusout", this.#hide);
    this.addEventListener("keydown", this.#onKeyDown);
    this.#bound = true;
  }

  disconnectedCallback(): void {
    this.removeEventListener("mouseenter", this.#show);
    this.removeEventListener("focusin", this.#show);
    this.removeEventListener("mouseleave", this.#hide);
    this.removeEventListener("focusout", this.#hide);
    this.removeEventListener("keydown", this.#onKeyDown);
    this.#bound = false;
    this.#clear();
  }

  protected override update(): void {
    const bubble = this.q(".bubble");
    if (bubble) bubble.textContent = this.attr("content");
  }

  #clear(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
  }

  #show = (): void => {
    if (!this.attr("content")) return;
    this.#clear();
    const delay = this.num("delay", 120);
    this.#timer = setTimeout(() => this.setAttribute("data-open", ""), delay);
  };

  #hide = (): void => {
    this.#clear();
    this.removeAttribute("data-open");
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") this.#hide();
  };
}
