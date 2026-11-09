import { MaoElement } from "./base.ts";
import { copyText } from "../core/dom.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";

/** `<mao-link>`：light DOM 链接。 */
export class MaoLink extends MaoElement {
  static get observedAttributes(): string[] {
    return ["href", "target", "color", "underline", "size", "external"];
  }

  constructor() {
    super();
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
  }

  protected update(): void {
    const size = this.attr("size", "md");
    const underline = this.attr("underline", "always");
    this.classList.add("mt-link");
    ["sm", "md", "lg"].forEach((token) => this.classList.toggle(`mt-link-${token}`, token === size));
    this.classList.toggle("mt-link-hover", underline === "hover");
    this.classList.toggle("mt-link-none", underline === "none");
    this.classList.toggle("mt-link-external", this.bool("external"));
    const color = this.getAttribute("color");
    if (color) this.style.setProperty("--c", `var(--mt-color-${color})`);
    else this.style.removeProperty("--c");
    this.setAttribute("role", "link");
    this.tabIndex = 0;
  }

  #onClick = (event: Event): void => {
    const href = this.getAttribute("href");
    if (!href) return;
    event.preventDefault();
    if (this.attr("target") === "_blank") window.open(href, "_blank", "noopener");
    else window.location.assign(href);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    this.click();
  };
}

/** `<mao-copy>`：shadow DOM 复制按钮。 */
export class MaoCopy extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <button class="btn" part="button" type="button">
      <span class="ic" part="icon"></span>
      <span class="label" part="label"></span>
    </button>
  `;
  static readonly styles = `
    :host { display: inline-block; font-family: var(--mt-font); --c: var(--mt-text); }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      font: inherit; font-family: var(--mt-font); font-size: var(--mt-fs-sm); line-height: 1.3;
      padding: 6px 11px; border-radius: var(--mt-radius-sm);
      border: 1px solid var(--mt-border); background: transparent; color: var(--c);
      cursor: pointer; white-space: nowrap;
      transition: background var(--mt-dur-fast) var(--mt-ease), border-color var(--mt-dur-fast) var(--mt-ease), color var(--mt-dur-fast) var(--mt-ease);
    }
    .btn:hover { background: var(--mt-surface-2); border-color: var(--mt-line-strong); }
    .btn:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 3px; }
    .btn.is-copied { color: var(--mt-sage); border-color: var(--mt-sage); background: var(--mt-sage-soft); }
    .ic { display: flex; }
    :host([variant="solid"]) .btn { background: var(--mt-text); border-color: var(--mt-text); color: var(--mt-bg); }
    :host([variant="solid"]) .btn:hover { background: color-mix(in srgb, var(--mt-text) 88%, var(--mt-bg)); }
    :host([size="sm"]) .btn { font-size: var(--mt-fs-xs); padding: 4px 9px; }
    :host([size="lg"]) .btn { font-size: var(--mt-fs-md); padding: 9px 14px; }
    :host([disabled]) .btn { opacity: 0.5; cursor: not-allowed; }
  `;

  static get observedAttributes(): string[] {
    return ["text", "label", "copied-label", "color", "variant", "size", "disabled"];
  }

  #timer = 0;
  #copied = false;
  #bound = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.shadowRoot?.addEventListener("click", this.#onClick);
      this.#bound = true;
    }
  }

  disconnectedCallback(): void {
    if (this.#timer) window.clearTimeout(this.#timer);
    this.#timer = 0;
  }

  protected update(): void {
    if (this.#copied) return;
    const label = this.q(".label");
    const icon = this.q(".ic");
    const color = this.attr("color");
    if (color) this.style.setProperty("--c", `var(--mt-color-${color})`);
    else this.style.removeProperty("--c");
    if (label) label.textContent = this.attr("label", "复制");
    if (icon) icon.innerHTML = iconSvg("copy", { size: 14 });
    const button = this.q<HTMLButtonElement>(".btn");
    if (button) button.disabled = this.bool("disabled");
  }

  #onClick = async (): Promise<void> => {
    if (this.bool("disabled") || this.#copied) return;
    const text = this.attr("text") || this.attr("label");
    const ok = await copyText(text);
    if (!ok) return;
    this.#copied = true;
    const label = this.q(".label");
    const icon = this.q(".ic");
    const button = this.q(".btn");
    if (label) label.textContent = this.attr("copied-label", "已复制");
    if (icon) icon.innerHTML = iconSvg("check", { size: 14 });
    button?.classList.add("is-copied");
    emit(this, "mt-copy", { text });
    this.#timer = window.setTimeout(() => {
      this.#copied = false;
      this.#timer = 0;
      this.update();
      this.q(".btn")?.classList.remove("is-copied");
    }, 1400);
  };
}

/** `<mao-reaction>`：shadow DOM 表情/点赞按钮。 */
export class MaoReaction extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <button class="btn" part="button" type="button">
      <span class="ic" part="icon"></span>
      <span class="count" part="count"></span>
      <span class="text"><slot></slot></span>
    </button>
  `;
  static readonly styles = `
    :host { display: inline-block; font-family: var(--mt-font); --c: var(--mt-color-danger); --c-fill: var(--mt-fill-danger); --on-c: var(--mt-on-danger); }
    .btn {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-family: var(--mt-font); font-size: var(--mt-fs-sm); line-height: 1.3;
      padding: 3px 9px; border-radius: var(--mt-radius-pill);
      border: 1px solid color-mix(in srgb, var(--c) 52%, var(--mt-border));
      background: transparent; color: var(--c);
      cursor: pointer;
      transition: color var(--mt-dur-fast) var(--mt-ease), border-color var(--mt-dur-fast) var(--mt-ease), background var(--mt-dur-fast) var(--mt-ease), transform var(--mt-dur-press) var(--mt-ease);
    }
    .btn:hover { border-color: var(--c); background: color-mix(in srgb, var(--c-fill) 18%, transparent); }
    .btn:active { transform: scale(0.94); }
    .btn:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 3px; }
    :host([active]) .btn { background: var(--c-fill); border-color: transparent; color: var(--on-c); font-weight: 600; }
    .ic { display: flex; }
    .count { font-variant-numeric: tabular-nums; }
    .count:empty { display: none; }
    .text:empty { display: none; }
    :host([size="sm"]) .btn { font-size: var(--mt-fs-xs); padding: 2px 7px; }
    :host([size="lg"]) .btn { font-size: var(--mt-fs-md); padding: 5px 12px; }
  `;

  static get observedAttributes(): string[] {
    return ["active", "count", "icon", "color", "size", "label"];
  }

  #bound = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.shadowRoot?.addEventListener("click", this.#onClick);
      this.#bound = true;
    }
  }

  protected update(): void {
    const icon = this.q(".ic");
    const count = this.q(".count");
    const color = this.attr("color", "danger");
    this.style.setProperty("--c", `var(--mt-color-${color})`);
    this.style.setProperty("--c-fill", `var(--mt-fill-${color})`);
    this.style.setProperty("--on-c", `var(--mt-on-${color})`);
    if (icon) icon.innerHTML = iconSvg(this.attr("icon", "heart"), { size: 14 });
    if (count) count.textContent = this.attr("count");
    const button = this.q(".btn");
    button?.setAttribute("aria-pressed", String(this.bool("active")));
    button?.setAttribute("aria-label", this.attr("label", this.textContent?.trim() || "点赞"));
  }

  #onClick = (): void => {
    const active = !this.bool("active");
    const current = Number(this.attr("count", "0"));
    const next = Number.isFinite(current) && current > 0 ? current + (active ? 1 : -1) : current;
    if (active) this.setAttribute("active", "");
    else this.removeAttribute("active");
    if (this.hasAttribute("count")) this.setAttribute("count", String(next));
    emit(this, "mt-change", { value: String(active), checked: active });
  };
}
