import { MaoElement } from "./base.ts";
import { bindRoving, setBoolAttr } from "../core/dom.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";

/** `<mao-menu-item>`：light DOM 菜单项，样式由 `.mt-menu-item` 承载。 */
export class MaoMenuItem extends MaoElement {
  static get observedAttributes(): string[] {
    return ["value", "icon", "href", "active", "disabled", "badge"];
  }

  protected override update(): void {
    this.classList.add("mt-menu-item");
    this.setAttribute("role", this.hasAttribute("href") ? "link" : "button");
    if (this.bool("active")) this.setAttribute("aria-current", "page");
    else this.removeAttribute("aria-current");
    this.classList.toggle("is-on", this.bool("active"));
    const disabled = this.bool("disabled");
    this.setAttribute("aria-disabled", String(disabled));
    this.tabIndex = disabled ? -1 : 0;
    this.#syncIcon();
    this.#syncBadge();
  }

  #syncIcon(): void {
    const name = this.attr("icon");
    const existing = this.querySelector<HTMLElement>(":scope > .mt-menu-icon");
    if (!name) {
      existing?.remove();
      return;
    }
    const icon = existing ?? document.createElement("mao-icon");
    icon.className = "mt-menu-icon";
    icon.setAttribute("name", name);
    icon.setAttribute("size", "17");
    if (!existing) this.prepend(icon);
  }

  #syncBadge(): void {
    const text = this.attr("badge");
    const existing = this.querySelector<HTMLElement>(":scope > .mt-menu-badge");
    if (!text) {
      existing?.remove();
      return;
    }
    const badge = existing ?? document.createElement("span");
    badge.className = "mt-menu-badge";
    badge.textContent = text;
    if (!existing) this.append(badge);
  }
}

/** `<mao-menu>`：light DOM 导航菜单，配合 `mao-menu-item` 使用。 */
export class MaoMenu extends MaoElement {
  static get observedAttributes(): string[] {
    return ["value", "label", "orientation", "disabled"];
  }

  #bound = false;
  #cleanupRoving: (() => void) | null = null;
  #observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.addEventListener("click", this.#onClick);
      this.#cleanupRoving = bindRoving(this, "mao-menu-item", (item) => this.#activate(item));
      this.#observer = new MutationObserver(() => this.#sync());
      this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["value", "active", "disabled"] });
      this.#bound = true;
    }
    this.#sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.#cleanupRoving?.();
    this.#cleanupRoving = null;
    this.#observer?.disconnect();
    this.#observer = null;
    this.#bound = false;
  }

  protected override update(): void {
    this.classList.add("mt-menu");
    const orientation = this.attr("orientation", "vertical");
    this.classList.toggle("mt-menu-horizontal", orientation === "horizontal");
    if (this.attr("label")) this.setAttribute("aria-label", this.attr("label"));
    this.classList.toggle("is-disabled", this.bool("disabled"));
    this.#sync();
  }

  #items(): MaoMenuItem[] {
    return Array.from(this.querySelectorAll<MaoMenuItem>("mao-menu-item"));
  }

  #sync = (): void => {
    const value = this.attr("value");
    this.#items().forEach((item) => {
      const selected = value !== "" && item.getAttribute("value") === value;
      if (selected) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
      item.classList.toggle("is-on", selected);
    });
  };

  #activate(item: Element): void {
    if (this.bool("disabled") || item.hasAttribute("disabled")) return;
    const value = item.getAttribute("value") ?? item.textContent?.trim() ?? "";
    if (this.getAttribute("value") === value) return;
    setBoolAttr(item, "active", true);
    this.#items().forEach((other) => {
      if (other !== item) setBoolAttr(other, "active", false);
    });
    this.setAttribute("value", value);
    const href = item.getAttribute("href");
    emit(this, "mt-change", href ? { value, href } : { value });
  }

  #onClick = (event: Event): void => {
    const target = (event.target as Element | null)?.closest?.("mao-menu-item");
    if (target && this.contains(target)) this.#activate(target);
  };
}

/** `<mao-dropdown>`：shadow DOM 浮层菜单。 */
export class MaoDropdown extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
    <div class="panel" part="panel" role="menu"><slot></slot></div>
  `;
  static override readonly styles = `
    :host { position: relative; display: inline-flex; font-family: var(--mt-font); }
    .trigger { display: inline-flex; align-items: center; }
    .panel {
      position: absolute; z-index: 60; top: calc(100% + 6px); right: 0;
      min-width: 160px; max-width: 280px;
      padding: 4px;
      border: 1px solid var(--mt-border);
      border-radius: var(--mt-radius-md);
      background: var(--mt-surface);
      box-shadow: var(--mt-shadow-overlay);
      display: none;
    }
    :host([data-open]) .panel { display: block; animation: mt-dropdown-in var(--mt-dur-fast) var(--mt-ease); }
    @keyframes mt-dropdown-in { from { opacity: 0; transform: translateY(-4px); } }
    :host([placement="bottom-start"]) .panel { left: 0; right: auto; }
    :host([placement="top-end"]) .panel { top: auto; bottom: calc(100% + 6px); }
    .panel:empty { display: none; }
    @media (prefers-reduced-motion: reduce) { :host([data-open]) .panel { animation: none; } }
  `;

  static get observedAttributes(): string[] {
    return ["open", "placement", "label"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.#bound) return;
    this.addEventListener("keydown", this.#onKeyDown);
    this.#bound = true;
    this.#applyOpen();
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.#onKeyDown);
    document.removeEventListener("click", this.#onDocumentClick);
    this.#bound = false;
  }

  protected override update(): void {
    this.#applyOpen();
  }

  show(): void {
    this.setAttribute("open", "");
  }

  close(): void {
    this.removeAttribute("open");
  }

  toggle(): void {
    if (this.bool("open")) this.close();
    else this.show();
  }

  #applyOpen(): void {
    const open = this.bool("open");
    if (open) {
      if (this.hasAttribute("data-open")) return;
      this.setAttribute("data-open", "");
      setTimeout(() => document.addEventListener("click", this.#onDocumentClick), 0);
      emit(this, "mt-open", {});
    } else if (this.hasAttribute("data-open")) {
      this.removeAttribute("data-open");
      document.removeEventListener("click", this.#onDocumentClick);
      emit(this, "mt-close", {});
    }
  }

  #onDocumentClick = (event: MouseEvent): void => {
    if (event.composedPath().includes(this)) {
      const item = (event.target as Element | null)?.closest?.("mao-menu-item");
      if (item) this.close();
      return;
    }
    this.close();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") this.close();
  };
}

/** `<mao-drawer>`：shadow DOM 侧边抽屉，原生 dialog 承载。 */
export class MaoDrawer extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <dialog part="dialog">
      <div class="panel">
        <header class="head">
          <div class="title" part="title"></div>
          <button class="close" part="close" type="button" aria-label="关闭"></button>
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer class="foot"><slot name="actions"></slot></footer>
      </div>
    </dialog>
  `;
  static override readonly styles = `
    :host { display: contents; font-family: var(--mt-font); --mt-drawer-width: 420px; }
    dialog {
      width: min(var(--mt-drawer-width), 100vw);
      height: 100%;
      max-width: 100vw;
      max-height: 100%;
      margin: 0 0 0 auto;
      padding: 0; border: 0; border-radius: 0;
      background: var(--mt-surface); color: var(--mt-text);
      box-shadow: var(--mt-shadow-overlay);
      overflow: hidden;
    }
    :host([placement="start"]) dialog { margin: 0 auto 0 0; }
    dialog[open] { animation: mt-drawer-in var(--mt-dur) var(--mt-ease); }
    :host([placement="start"]) dialog[open] { animation-name: mt-drawer-in-start; }
    @keyframes mt-drawer-in { from { transform: translateX(100%); } }
    @keyframes mt-drawer-in-start { from { transform: translateX(-100%); } }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
    dialog::backdrop { background: rgb(24 20 20 / 0.42); backdrop-filter: blur(2px); }
    :host([size="sm"]) { --mt-drawer-width: 320px; }
    :host([size="lg"]) { --mt-drawer-width: 560px; }
    .panel { display: flex; flex-direction: column; height: 100%; min-height: 0; }
    .head {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--mt-border);
    }
    .title { margin: 0; font-size: var(--mt-fs-lg); font-weight: 600; line-height: var(--mt-lh-tight); }
    .title:empty { display: none; }
    .close {
      appearance: none; border: 0; background: transparent;
      color: var(--mt-muted); cursor: pointer; padding: 4px; line-height: 0;
      border-radius: var(--mt-radius-sm);
    }
    .close:hover { color: var(--mt-text); background: var(--mt-surface-2); }
    .close:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 2px; }
    .body { flex: 1; min-height: 0; overflow: auto; padding: 20px; color: var(--mt-text); font-size: var(--mt-fs-md); line-height: var(--mt-lh); }
    .foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--mt-border); }
    .foot:not(:has(slot[name="actions"]::slotted(*))) { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["open", "heading", "placement", "size", "closable"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const dialog = this.q<HTMLDialogElement>("dialog");
    if (dialog && !this.#bound) {
      dialog.addEventListener("close", this.#onNativeClose);
      dialog.addEventListener("cancel", this.#onCancel);
      dialog.addEventListener("click", this.#onBackdrop);
      this.#bound = true;
    }
    this.#applyOpen();
  }

  disconnectedCallback(): void {
    const dialog = this.q<HTMLDialogElement>("dialog");
    dialog?.removeEventListener("close", this.#onNativeClose);
    dialog?.removeEventListener("cancel", this.#onCancel);
    dialog?.removeEventListener("click", this.#onBackdrop);
    this.#bound = false;
  }

  protected override update(): void {
    const title = this.q(".title");
    if (title) title.textContent = this.attr("heading");
    const close = this.q<HTMLElement>(".close");
    if (close) {
      close.hidden = !this.bool("closable");
      close.innerHTML = iconSvg("x", { size: 16 });
    }
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

  #onCancel = (event: Event): void => {
    if (!this.bool("closable")) event.preventDefault();
  };

  #onBackdrop = (event: MouseEvent): void => {
    if (event.target !== this.q("dialog")) return;
    if (!this.bool("closable")) return;
    this.close();
  };
}
