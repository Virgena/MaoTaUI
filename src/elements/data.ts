import { MaoElement } from "./base.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";

function pageWindow(page: number, pageCount: number, span: number): (number | "gap")[] {
  if (pageCount <= span + 2) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const half = Math.floor(span / 2);
  let start = Math.max(2, page - half);
  let end = Math.min(pageCount - 1, start + span - 1);
  start = Math.max(2, end - span + 1);
  const out: (number | "gap")[] = [1];
  if (start > 2) out.push("gap");
  for (let index = start; index <= end; index += 1) out.push(index);
  if (end < pageCount - 1) out.push("gap");
  out.push(pageCount);
  return out;
}

/** `<mao-pagination>`：shadow DOM 分页器。 */
export class MaoPagination extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <button class="step prev" part="prev" type="button"></button>
    <div class="pages" part="pages"></div>
    <button class="step next" part="next" type="button"></button>
    <div class="sizes" part="sizes"><slot name="sizes"></slot></div>
  `;
  static override readonly styles = `
    :host {
      display: flex; align-items: center; gap: 6px;
      font-family: var(--mt-font); font-size: var(--mt-fs-sm); color: var(--mt-muted);
    }
    .pages { display: flex; align-items: center; gap: 4px; }
    .step, .page {
      appearance: none;
      display: inline-grid; place-items: center;
      min-width: 28px; height: 28px; padding: 0 6px;
      border: 1px solid transparent; border-radius: var(--mt-radius-sm);
      background: transparent; color: inherit;
      font: inherit; line-height: 1; cursor: pointer;
      transition: background var(--mt-dur-fast) var(--mt-ease), color var(--mt-dur-fast) var(--mt-ease);
    }
    .step:hover:not(:disabled), .page:hover:not(.is-on) { background: var(--mt-surface-2); color: var(--mt-text); }
    .step:disabled { opacity: 0.4; cursor: not-allowed; }
    .page.is-on { background: var(--mt-text); border-color: var(--mt-text); color: var(--mt-bg); font-weight: 500; }
    .page:focus-visible, .step:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 2px; }
    .gap { display: inline-grid; place-items: center; min-width: 20px; height: 28px; color: var(--mt-faint); }
    .sizes { display: flex; align-items: center; gap: 6px; margin-left: 4px; }
    :host([simple]) .pages { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["total", "page", "page-size", "siblings", "simple", "disabled"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.#bound) return;
    this.addEventListener("click", this.#onClick);
    this.#bound = true;
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.#bound = false;
  }

  protected override update(): void {
    const pageCount = this.#pageCount();
    const page = this.#page();
    const prev = this.q<HTMLButtonElement>(".prev");
    const next = this.q<HTMLButtonElement>(".next");
    if (prev) {
      prev.innerHTML = iconSvg("chevron-left", { size: 16 });
      prev.setAttribute("aria-label", "上一页");
      prev.disabled = this.bool("disabled") || page <= 1;
    }
    if (next) {
      next.innerHTML = iconSvg("chevron-right", { size: 16 });
      next.setAttribute("aria-label", "下一页");
      next.disabled = this.bool("disabled") || page >= pageCount;
    }
    const pages = this.q(".pages");
    if (!pages) return;
    pages.textContent = "";
    for (const entry of pageWindow(page, pageCount, Math.max(1, this.num("siblings", 3)))) {
      if (entry === "gap") {
        const gap = document.createElement("span");
        gap.className = "gap";
        gap.textContent = "…";
        pages.append(gap);
        continue;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page";
      button.textContent = String(entry);
      button.dataset.page = String(entry);
      button.setAttribute("aria-label", `第 ${entry} 页`);
      if (entry === page) {
        button.classList.add("is-on");
        button.setAttribute("aria-current", "page");
      }
      button.disabled = this.bool("disabled");
      pages.append(button);
    }
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", this.attr("label", "分页"));
  }

  #pageCount(): number {
    const size = Math.max(1, this.num("page-size", 10));
    return Math.max(1, Math.ceil(this.num("total", 0) / size));
  }

  #page(): number {
    return Math.min(this.#pageCount(), Math.max(1, this.num("page", 1)));
  }

  #go(page: number): void {
    if (this.bool("disabled")) return;
    const next = Math.min(this.#pageCount(), Math.max(1, page));
    if (next === this.#page()) return;
    this.setAttribute("page", String(next));
    emit(this, "mt-change", { page: next, pageSize: Math.max(1, this.num("page-size", 10)) });
  }

  #onClick = (event: Event): void => {
    const target = event.composedPath()[0] as HTMLElement | null;
    if (!target) return;
    if (target.closest(".prev")) this.#go(this.#page() - 1);
    else if (target.closest(".next")) this.#go(this.#page() + 1);
    else {
      const page = target.closest<HTMLElement>(".page")?.dataset.page;
      if (page) this.#go(Number(page));
    }
  };
}

/** `<mao-descriptions-item>`：shadow DOM 描述项，标签 + 默认插槽值。 */
export class MaoDescriptionsItem extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <span class="label" part="label"></span>
    <span class="value" part="value"><slot></slot></span>
  `;
  static override readonly styles = `
    :host { display: flex; align-items: baseline; gap: 10px; min-width: 0; font-family: var(--mt-font); font-size: var(--mt-fs-sm); }
    .label { flex: none; color: var(--mt-muted); }
    .label:empty { display: none; }
    .value { min-width: 0; color: var(--mt-text); word-break: break-word; }
  `;

  static get observedAttributes(): string[] {
    return ["label", "span"];
  }

  protected override update(): void {
    const label = this.q(".label");
    if (label) label.textContent = this.attr("label");
    const span = this.num("span", 1);
    if (span > 1) {
      this.style.setProperty("--mt-span", String(span));
      this.style.gridColumn = `span ${span}`;
    } else {
      this.style.removeProperty("--mt-span");
      this.style.removeProperty("grid-column");
    }
  }
}

/** `<mao-descriptions>`：light DOM 描述列表容器。 */
export class MaoDescriptions extends MaoElement {
  static get observedAttributes(): string[] {
    return ["columns", "bordered"];
  }

  protected override update(): void {
    this.classList.add("mt-descriptions");
    this.classList.toggle("mt-descriptions-bordered", this.bool("bordered"));
    const columns = Math.max(1, Math.min(4, this.num("columns", 2)));
    this.style.setProperty("--mt-desc-columns", String(columns));
  }
}
