import { MaoElement } from "./base.ts";

const COLORS = ["primary", "secondary", "success", "warning", "danger", "info", "neutral"] as const;
const VARIANTS = ["solid", "shadow", "bordered", "flat", "light"] as const;
const SIZES = ["sm", "md", "lg"] as const;

/** `<mao-button>`：light DOM，只同步 host 的 class / aria / tabindex。 */
export class MaoButton extends MaoElement {
  static get observedAttributes(): string[] {
    return ["color", "variant", "size", "loading", "disabled", "href", "block", "icon"];
  }

  #bound = false;

  constructor() {
    super();
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
    this.#bound = true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.addEventListener("click", this.#onClick);
      this.addEventListener("keydown", this.#onKeyDown);
      this.#bound = true;
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeyDown);
    this.#bound = false;
  }

  protected update(): void {
    const color = this.attr("color", "neutral");
    const variant = this.attr("variant", "solid");
    const size = this.attr("size", "md");
    const disabled = this.bool("disabled") || this.bool("loading");

    this.classList.add("mt-btn");
    COLORS.forEach((token) => this.classList.toggle(`mt-btn-${token}`, token === color));
    VARIANTS.forEach((token) => this.classList.toggle(`mt-btn-${token}`, token === variant));
    SIZES.forEach((token) => this.classList.toggle(`mt-btn-${token}`, token === size));
    this.classList.toggle("mt-btn-block", this.bool("block"));
    this.classList.toggle("mt-btn-icon", this.bool("icon"));

    const href = this.getAttribute("href");
    this.setAttribute("role", href ? "link" : "button");
    this.tabIndex = disabled ? -1 : 0;
    this.setAttribute("aria-disabled", String(disabled));
    this.setAttribute("aria-busy", String(this.bool("loading")));
    if (href) this.setAttribute("aria-label", this.attr("aria-label", this.textContent?.trim() ?? ""));
  }

  #onClick = (event: Event): void => {
    if (this.bool("disabled") || this.bool("loading")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const href = this.getAttribute("href");
    if (href) window.location.assign(href);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (this.bool("disabled") || this.bool("loading")) return;
    event.preventDefault();
    const href = this.getAttribute("href");
    if (href) window.location.assign(href);
    else this.click();
  };
}

/** `<mao-button-group>`：横向 / 纵向排列按钮。 */
export class MaoButtonGroup extends MaoElement {
  static get observedAttributes(): string[] {
    return ["orientation"];
  }

  protected update(): void {
    const vertical = this.attr("orientation", "horizontal") === "vertical";
    this.classList.add("mt-btn-group");
    this.classList.toggle("mt-btn-group-vertical", vertical);
    this.classList.toggle("mt-btn-group-horizontal", !vertical);
    this.setAttribute("role", "group");
  }
}
