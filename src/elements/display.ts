import { MaoElement } from "./base.ts";
import { iconSvg } from "../core/icons.ts";

/** `<mao-icon>`：shadow DOM，渲染内置 SVG。 */
export class MaoIcon extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = '<span class="box" part="icon"></span>';
  static readonly styles = `
    :host { display: inline-flex; align-items: center; justify-content: center; line-height: 0; flex: none; color: inherit; }
    .box { display: flex; }
  `;

  static get observedAttributes(): string[] {
    return ["name", "size", "label", "stroke-width"];
  }

  protected update(): void {
    const box = this.q(".box");
    if (!box) return;
    box.innerHTML = iconSvg(this.attr("name"), {
      size: this.attr("size", "16"),
      label: this.attr("label") || undefined,
      strokeWidth: this.num("stroke-width", 2),
    });
  }
}

/** `<mao-badge>`：light DOM，仅同步色调 class。 */
export class MaoBadge extends MaoElement {
  static get observedAttributes(): string[] {
    return ["tone"];
  }

  protected update(): void {
    const tone = this.attr("tone", "neutral");
    this.classList.add("mt-badge");
    ["accent", "danger", "sage", "blue", "solid"].forEach((token) =>
      this.classList.toggle(`mt-badge-${token}`, token === tone),
    );
  }
}

/** `<mao-avatar>`：light DOM，首字用 ::after 渲染，头像用 background-image。 */
export class MaoAvatar extends MaoElement {
  static get observedAttributes(): string[] {
    return ["label", "src", "alt", "size", "tone"];
  }

  protected update(): void {
    const size = this.attr("size", "md");
    this.classList.add("mt-avatar");
    ["sm", "lg"].forEach((token) => this.classList.toggle(`mt-avatar-${token}`, token === size));
    ["sage", "blue", "accent"].forEach((token) => this.classList.toggle(`mt-avatar-${token}`, token === this.attr("tone")));

    const src = this.getAttribute("src");
    if (src) this.style.setProperty("--mt-avatar-src", `url("${src.replace(/"/g, "%22")}")`);
    else this.style.removeProperty("--mt-avatar-src");

    this.setAttribute("role", "img");
    this.setAttribute("aria-label", this.attr("alt") || this.attr("label"));
  }
}

/** `<mao-notice>`：shadow DOM，自带图标、标题与默认插槽。 */
export class MaoNotice extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <span class="mark" part="mark"></span>
    <div class="body">
      <div class="title" part="title"></div>
      <div class="content" part="content"><slot></slot></div>
    </div>
  `;
  static readonly styles = `
    :host {
      display: grid;
      grid-template-columns: 18px 1fr;
      align-items: start;
      gap: 2px 12px;
      padding: 12px 14px;
      border: 1px solid var(--mt-border);
      border-radius: var(--mt-radius-sm);
      background: var(--mt-surface);
      color: var(--mt-text);
      font-family: var(--mt-font);
      font-size: var(--mt-fs-sm);
      line-height: 1.55;
    }
    .mark {
      display: grid; place-items: center;
      width: 18px; height: 18px; margin-top: 1px;
      border: 1px solid currentColor; border-radius: 50%;
      font-size: 10px; font-weight: 700; line-height: 1;
    }
    .title { font-weight: 600; line-height: 1.4; }
    .title:empty { display: none; }
    :host([tone="sage"]) { background: var(--mt-sage-soft); border-color: transparent; color: var(--mt-sage); }
    :host([tone="blue"]) { background: var(--mt-blue-soft); border-color: transparent; color: var(--mt-blue); }
    :host([tone="accent"]) { background: var(--mt-accent-soft); border-color: transparent; color: var(--mt-accent); }
    :host([tone="danger"]) { background: var(--mt-danger-soft); border-color: transparent; color: var(--mt-danger); }
  `;

  static get observedAttributes(): string[] {
    return ["tone", "title"];
  }

  protected update(): void {
    const mark = this.q(".mark");
    const title = this.q(".title");
    const tone = this.attr("tone", "info");
    const marks: Record<string, string> = { info: "i", sage: "✓", success: "✓", blue: "i", accent: "★", danger: "×", warning: "!" };
    if (mark) mark.textContent = marks[tone] ?? "i";
    if (title) title.textContent = this.attr("title");
  }
}

/** `<mao-progress>`：shadow DOM，属性驱动。 */
export class MaoProgress extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <div class="head"><span class="label" part="label"></span><span class="value" part="value"></span></div>
    <div class="track" part="track"><div class="bar" part="bar"></div></div>
  `;
  static readonly styles = `
    :host { display: block; font-family: var(--mt-font); font-size: var(--mt-fs-sm); color: var(--mt-muted); }
    .head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
    .head:not(:has(.label:not(:empty))) { display: none; }
    .value { color: var(--mt-text); font-variant-numeric: tabular-nums; }
    .track { height: 7px; overflow: hidden; border-radius: var(--mt-radius-pill); background: var(--mt-surface-2); }
    .bar { height: 100%; width: 0; border-radius: inherit; background: var(--mt-accent); transition: width var(--mt-dur) var(--mt-ease); }
    :host([tone="sage"]) .bar { background: var(--mt-sage); }
    :host([tone="blue"]) .bar { background: var(--mt-blue); }
  `;

  static get observedAttributes(): string[] {
    return ["value", "max", "label", "show-value"];
  }

  protected update(): void {
    const max = Math.max(1, this.num("max", 100));
    const value = Math.min(max, Math.max(0, this.num("value", 0)));
    const percent = (value / max) * 100;
    const label = this.q(".label");
    const valueNode = this.q(".value");
    const bar = this.q<HTMLElement>(".bar");
    if (label) label.textContent = this.attr("label");
    if (valueNode) valueNode.textContent = this.bool("show-value") ? `${Math.round(percent)}%` : "";
    if (bar) bar.style.width = `${percent}%`;
    this.setAttribute("role", "progressbar");
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", String(max));
    this.setAttribute("aria-valuenow", String(value));
    if (this.attr("label")) this.setAttribute("aria-label", this.attr("label"));
  }
}

/** `<mao-metric>`：shadow DOM，标签 / 数值 / 趋势。 */
export class MaoMetric extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <span class="label" part="label"></span>
    <span class="value" part="value"></span>
    <span class="trend" part="trend"></span>
  `;
  static readonly styles = `
    :host { display: flex; flex-direction: column; gap: 2px; font-family: var(--mt-font); }
    .label { color: var(--mt-muted); font-size: var(--mt-fs-xs); }
    .value { font-size: var(--mt-fs-2xl); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    .trend { color: var(--mt-sage); font-size: var(--mt-fs-xs); }
    .trend:empty { display: none; }
    :host([tone="danger"]) .trend { color: var(--mt-danger); }
  `;

  static get observedAttributes(): string[] {
    return ["label", "value", "trend"];
  }

  protected update(): void {
    const label = this.q(".label");
    const value = this.q(".value");
    const trend = this.q(".trend");
    if (label) label.textContent = this.attr("label");
    if (value) value.textContent = this.attr("value");
    if (trend) trend.textContent = this.attr("trend");
  }
}

/** `<mao-mini-chart>`：shadow DOM，用 CSS 变量画柱状图。 */
export class MaoMiniChart extends MaoElement {
  static readonly mode = "shadow" as const;
  static readonly shadowHTML = `
    <div class="bars" part="bars"></div>
    <div class="axis" part="axis"><span class="axis-label"></span><span class="axis-unit"></span></div>
  `;
  static readonly styles = `
    :host { display: block; font-family: var(--mt-font); }
    .bars { display: flex; align-items: flex-end; gap: 6px; height: 58px; }
    .bar { flex: 1; min-width: 4px; height: var(--mt-bar, 0%); border-radius: var(--mt-radius-sm) var(--mt-radius-sm) 3px 3px; background: var(--mt-sage-soft); transition: height var(--mt-dur) var(--mt-ease); }
    .bar.is-on { background: var(--mt-sage); }
    :host([tone="blue"]) .bar { background: var(--mt-blue-soft); }
    :host([tone="blue"]) .bar.is-on { background: var(--mt-blue); }
    :host([tone="accent"]) .bar { background: var(--mt-accent-soft); }
    :host([tone="accent"]) .bar.is-on { background: var(--mt-accent); }
    .axis { display: flex; justify-content: space-between; margin-top: 8px; color: var(--mt-faint); font-size: var(--mt-fs-xs); }
    .axis:not(:has(.axis-label:not(:empty), .axis-unit:not(:empty))) { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["values", "active", "label", "unit"];
  }

  protected update(): void {
    const bars = this.q(".bars");
    if (!bars) return;
    const values = this.attr("values")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isFinite(value));
    const max = Math.max(1, ...values);
    const active = this.num("active", values.length - 1);
    bars.innerHTML = values
      .map((value, index) => {
        const height = Math.max(6, Math.round((value / max) * 100));
        return `<span class="bar${index === active ? " is-on" : ""}" style="--mt-bar:${height}%"></span>`;
      })
      .join("");
    const label = this.q(".axis-label");
    const unit = this.q(".axis-unit");
    if (label) label.textContent = this.attr("label");
    if (unit) unit.textContent = this.attr("unit");
    this.setAttribute("role", "img");
    this.setAttribute("aria-label", this.attr("label", "趋势图"));
  }
}

/** `<mao-divider>`：light DOM，标签由子文本提供。 */
export class MaoDivider extends MaoElement {
  static get observedAttributes(): string[] {
    return ["orientation", "dashed", "color"];
  }

  protected update(): void {
    const vertical = this.attr("orientation", "horizontal") === "vertical";
    this.classList.add("mt-divider");
    this.classList.toggle("mt-divider-horizontal", !vertical);
    this.classList.toggle("mt-divider-vertical", vertical);
    this.classList.toggle("is-dashed", this.bool("dashed"));
    this.classList.toggle("has-label", !vertical && (this.textContent?.trim().length ?? 0) > 0);
    const color = this.getAttribute("color");
    if (color) this.style.setProperty("--c", color);
    else this.style.removeProperty("--c");
    this.setAttribute("role", "separator");
    this.setAttribute("aria-orientation", vertical ? "vertical" : "horizontal");
  }
}

/** `<mao-brand>`：light DOM，图标与名称由属性经伪元素渲染。 */
export class MaoBrand extends MaoElement {
  static get observedAttributes(): string[] {
    return ["name", "href", "icon-src", "icon-alt"];
  }

  constructor() {
    super();
    this.addEventListener("click", this.#onClick);
  }

  protected update(): void {
    this.classList.add("mt-brand");
    const src = this.getAttribute("icon-src");
    if (src) this.style.setProperty("--mt-brand-icon", `url("${src.replace(/"/g, "%22")}")`);
    else this.style.removeProperty("--mt-brand-icon");
    const href = this.getAttribute("href");
    if (href) {
      this.setAttribute("role", "link");
      this.tabIndex = 0;
      this.setAttribute("aria-label", this.attr("name") || this.attr("icon-alt"));
    } else {
      this.removeAttribute("role");
      this.removeAttribute("tabindex");
    }
  }

  #onClick = (): void => {
    const href = this.getAttribute("href");
    if (href) window.location.assign(href);
  };
}
