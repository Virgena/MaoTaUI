/** 自定义元素基类：统一 light / shadow 两种渲染模式与样式表缓存。 */

import { FormAssociated } from "../core/form.ts";

export type RenderMode = "light" | "shadow";

const sheets = new Map<Function, CSSStyleSheet | null>();

function sheetFor(ctor: typeof MaoElement): CSSStyleSheet | null {
  if (sheets.has(ctor)) return sheets.get(ctor) ?? null;
  let sheet: CSSStyleSheet | null = null;
  const css = ctor.styles.trim();
  if (css && typeof CSSStyleSheet !== "undefined" && "replaceSync" in CSSStyleSheet.prototype) {
    try {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
    } catch {
      sheet = null;
    }
  }
  sheets.set(ctor, sheet);
  return sheet;
}

export abstract class MaoElement extends FormAssociated {
  static readonly mode: RenderMode = "light";
  static readonly styles: string = "";
  static readonly shadowHTML: string = "";

  protected root: ShadowRoot | null = null;
  #mounted = false;

  connectedCallback(): void {
    this.#mount();
    this.update();
    this.classList.add("is-ready");
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.isConnected) return;
    this.update();
  }

  /** 子类实现：只读写 host 属性 / 更新 shadow 内已有节点。 */
  protected update(): void {}

  protected attr(name: string, fallback = ""): string {
    return this.getAttribute(name) ?? fallback;
  }

  protected bool(name: string): boolean {
    return this.hasAttribute(name);
  }

  protected num(name: string, fallback = 0): number {
    const raw = this.getAttribute(name);
    if (raw === null || raw.trim() === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  /** 在 shadow root 内查询节点。 */
  protected q<T extends Element = HTMLElement>(selector: string): T | null {
    return this.root?.querySelector<T>(selector) ?? null;
  }

  protected toggleClass(token: string, force: boolean): void {
    this.classList.toggle(token, force);
  }

  #mount(): void {
    const ctor = this.constructor as typeof MaoElement;
    if (ctor.mode !== "shadow" || this.#mounted) return;
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    this.root = root;
    const css = ctor.styles.trim();
    if (css) {
      const sheet = sheetFor(ctor);
      if (sheet) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      else {
        const style = document.createElement("style");
        style.textContent = css;
        root.append(style);
      }
    }
    const html = ctor.shadowHTML.trim();
    if (html) {
      const template = document.createElement("template");
      template.innerHTML = html;
      root.append(template.content.cloneNode(true));
    }
    this.#mounted = true;
  }
}
