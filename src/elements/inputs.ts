import { MaoElement } from "./base.ts";
import { emit } from "../core/events.ts";

const FIELD_STYLES = `
  :host { display: block; font-family: var(--mt-font); }
  .field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .label { font-size: var(--mt-fs-xs); color: var(--mt-muted); letter-spacing: 0.02em; }
  .label:empty { display: none; }
  .hint { font-size: var(--mt-fs-xs); color: var(--mt-faint); }
  .hint:empty { display: none; }
  .control {
    box-sizing: border-box; width: 100%;
    font: inherit; font-family: var(--mt-font); font-size: var(--mt-fs-md);
    color: var(--mt-text); background: var(--mt-surface);
    border: 1px solid var(--mt-border); border-radius: var(--mt-radius-sm);
    padding: 9px 12px; min-width: 0;
    transition: border-color var(--mt-dur-fast) var(--mt-ease);
  }
  .control::placeholder { color: var(--mt-faint); }
  .control:focus-visible { outline: 2px solid color-mix(in srgb, var(--mt-accent) 40%, transparent); border-color: var(--mt-accent); }
  .control[aria-invalid="true"] { border-color: var(--mt-danger); }
  .control:disabled { opacity: 0.55; cursor: not-allowed; }
`;

/** `<mao-text-field>`：shadow DOM + 表单关联。 */
export class MaoTextField extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <label class="field" part="field">
      <span class="label" part="label"></span>
      <input class="control" part="input" />
      <span class="hint" part="hint"></span>
    </label>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return ["label", "hint", "value", "placeholder", "type", "name", "required", "disabled", "readonly", "invalid", "autocomplete"];
  }

  constructor() {
    super();
    this.shadowRoot?.addEventListener("input", this.#onInput);
    this.shadowRoot?.addEventListener("change", this.#onInput);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("input", this.#onInput);
      root.addEventListener("change", this.#onInput);
      this.#bound = true;
    }
  }

  #bound = false;

  get value(): string {
    return this.q<HTMLInputElement>(".control")?.value ?? this.attr("value");
  }

  set value(next: string) {
    this.setAttribute("value", next);
  }

  protected override update(): void {
    const label = this.q(".label");
    const hint = this.q(".hint");
    const input = this.q<HTMLInputElement>(".control");
    if (label) label.textContent = this.attr("label");
    if (hint) hint.textContent = this.attr("hint");
    if (!input) return;
    input.type = this.attr("type", "text");
    input.placeholder = this.attr("placeholder");
    input.name = this.attr("name");
    input.required = this.bool("required");
    input.disabled = this.bool("disabled");
    input.readOnly = this.bool("readonly");
    input.setAttribute("aria-invalid", String(this.bool("invalid")));
    const autocomplete = this.getAttribute("autocomplete");
    if (autocomplete !== null) input.setAttribute("autocomplete", autocomplete);
    const next = this.attr("value");
    if (input.value !== next) input.value = next;
    this.syncFormValue(next);
    if (this.bool("required") && !next) {
      this.syncValidity({ valueMissing: true }, "请填写此字段");
    } else {
      this.syncValidity({});
    }
  }

  #onInput = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (this.getAttribute("value") !== input.value) this.setAttribute("value", input.value);
    emit(this, "mt-input", { value: input.value, name: this.attr("name") });
  };

  override focus(): void {
    const control = this.q<HTMLElement>(".control");
    if (control) control.focus();
    else super.focus();
  }
}

/** `<mao-text-area>`：shadow DOM + 表单关联。 */
export class MaoTextArea extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <label class="field" part="field">
      <span class="label" part="label"></span>
      <textarea class="control" part="textarea"></textarea>
      <span class="hint" part="hint"></span>
    </label>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return ["label", "hint", "value", "placeholder", "rows", "name", "required", "disabled", "readonly", "invalid"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("input", this.#onInput);
      this.#bound = true;
    }
  }

  get value(): string {
    return this.q<HTMLTextAreaElement>(".control")?.value ?? this.attr("value");
  }

  set value(next: string) {
    this.setAttribute("value", next);
  }

  protected override update(): void {
    const label = this.q(".label");
    const hint = this.q(".hint");
    const area = this.q<HTMLTextAreaElement>(".control");
    if (label) label.textContent = this.attr("label");
    if (hint) hint.textContent = this.attr("hint");
    if (!area) return;
    area.rows = this.num("rows", 3);
    area.placeholder = this.attr("placeholder");
    area.name = this.attr("name");
    area.required = this.bool("required");
    area.disabled = this.bool("disabled");
    area.readOnly = this.bool("readonly");
    area.setAttribute("aria-invalid", String(this.bool("invalid")));
    const next = this.attr("value");
    if (area.value !== next) area.value = next;
    this.syncFormValue(next);
  }

  #onInput = (event: Event): void => {
    const area = event.target;
    if (!(area instanceof HTMLTextAreaElement)) return;
    if (this.getAttribute("value") !== area.value) this.setAttribute("value", area.value);
    emit(this, "mt-input", { value: area.value, name: this.attr("name") });
  };

  override focus(): void {
    const control = this.q<HTMLElement>(".control");
    if (control) control.focus();
    else super.focus();
  }
}

interface SelectOption {
  value: string;
  label: string;
}

function parseOptions(raw: string): SelectOption[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => {
      if (typeof item === "string") return { value: item, label: item };
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const value = String(record.value ?? "");
        return { value, label: String(record.label ?? value) };
      }
      return { value: "", label: "" };
    });
  } catch {
    return [];
  }
}

/** `<mao-select>`：shadow DOM，options 以 JSON 属性传入。 */
export class MaoSelect extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <label class="field" part="field">
      <span class="label" part="label"></span>
      <select class="control" part="select"></select>
      <span class="hint" part="hint"></span>
    </label>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return ["label", "hint", "options", "value", "placeholder", "name", "required", "disabled"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("change", this.#onChange);
      this.#bound = true;
    }
  }

  get value(): string {
    return this.q<HTMLSelectElement>(".control")?.value ?? this.attr("value");
  }

  set value(next: string) {
    this.setAttribute("value", next);
  }

  protected override update(): void {
    const label = this.q(".label");
    const hint = this.q(".hint");
    const select = this.q<HTMLSelectElement>(".control");
    if (label) label.textContent = this.attr("label");
    if (hint) hint.textContent = this.attr("hint");
    if (!select) return;

    const options = parseOptions(this.attr("options"));
    const placeholder = this.attr("placeholder");
    select.textContent = "";
    if (placeholder) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = placeholder;
      option.disabled = this.bool("required");
      select.append(option);
    }
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      select.append(option);
    });

    select.name = this.attr("name");
    select.required = this.bool("required");
    select.disabled = this.bool("disabled");
    select.value = this.attr("value");
    this.syncFormValue(select.value);
  }

  #onChange = (): void => {
    const select = this.q<HTMLSelectElement>(".control");
    if (!select) return;
    this.setAttribute("value", select.value);
    this.syncFormValue(select.value);
    emit(this, "mt-change", { value: select.value });
  };

  override focus(): void {
    const control = this.q<HTMLElement>(".control");
    if (control) control.focus();
    else super.focus();
  }
}

/** `<mao-switch>`：shadow DOM + 表单关联，默认插槽为标签文字。 */
export class MaoSwitch extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <label class="root" part="base">
      <button class="track" type="button" part="control" role="switch">
        <span class="thumb"></span>
      </button>
      <span class="text" part="label"><slot></slot></span>
    </label>
  `;
  static override readonly styles = `
    :host { display: inline-block; font-family: var(--mt-font); }
    .root { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; user-select: none; color: var(--mt-text); font-size: var(--mt-fs-md); }
    .track {
      position: relative; display: inline-block; flex: none;
      width: 38px; height: 22px; padding: 0;
      border: 1px solid var(--mt-line-strong);
      border-radius: var(--mt-radius-pill);
      background: var(--mt-surface-2);
      cursor: pointer;
      transition: background var(--mt-dur) var(--mt-ease), border-color var(--mt-dur) var(--mt-ease);
    }
    .track:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 3px; }
    .thumb {
      position: absolute; top: 2px; left: 2px;
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--mt-surface);
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
      transition: transform var(--mt-dur) var(--mt-ease);
    }
    :host([checked]) .track { background: var(--mt-sage); border-color: var(--mt-sage); }
    :host([checked]) .thumb { transform: translateX(16px); }
    :host([size="sm"]) .track { width: 32px; height: 19px; }
    :host([size="sm"]) .thumb { width: 13px; height: 13px; }
    :host([size="sm"][checked]) .thumb { transform: translateX(13px); }
    :host([disabled]) .root { opacity: 0.5; cursor: not-allowed; }
    .text:empty { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["checked", "disabled", "name", "size", "value"];
  }

  #bound = false;

  constructor() {
    super();
    this.addEventListener("click", this.#onClick);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#bound) {
      this.addEventListener("click", this.#onClick);
      this.#bound = true;
    }
  }

  get checked(): boolean {
    return this.bool("checked");
  }

  set checked(next: boolean) {
    if (next) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
  }

  protected override update(): void {
    const track = this.q<HTMLButtonElement>(".track");
    const disabled = this.bool("disabled");
    if (track) {
      track.disabled = disabled;
      track.setAttribute("aria-checked", String(this.bool("checked")));
      track.setAttribute("aria-label", this.attr("aria-label", this.textContent?.trim() ?? "开关"));
    }
    this.syncFormValue(this.bool("checked") ? this.attr("value", "on") : null);
  }

  #onClick = (event: Event): void => {
    if (this.bool("disabled")) return;
    if (event.composedPath().some((node) => node instanceof HTMLSlotElement)) {
      // 点击标签文字同样切换
    }
    const next = !this.bool("checked");
    if (next) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
    this.syncFormValue(next ? this.attr("value", "on") : null);
    emit(this, "mt-change", { value: this.attr("value", "on"), checked: next });
  };
}

/** `<mao-checkbox>`：shadow DOM + 表单关联。 */
export class MaoCheckbox extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <label class="root" part="base">
      <input class="native" type="checkbox" part="input" />
      <span class="box" part="box"></span>
      <span class="text" part="label"><slot></slot></span>
    </label>
  `;
  static override readonly styles = `
    :host { display: inline-block; font-family: var(--mt-font); }
    .root { position: relative; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; user-select: none; color: var(--mt-text); font-size: var(--mt-fs-md); }
    .native { position: absolute; width: 1px; height: 1px; opacity: 0; margin: 0; }
    .box {
      display: grid; place-items: center; flex: none;
      width: 17px; height: 17px;
      border: 1px solid var(--mt-line-strong);
      border-radius: 5px;
      background: var(--mt-surface);
      transition: background var(--mt-dur-fast) var(--mt-ease), border-color var(--mt-dur-fast) var(--mt-ease);
    }
    .box::after {
      content: ""; width: 9px; height: 5px;
      border-left: 2px solid var(--mt-on-accent);
      border-bottom: 2px solid var(--mt-on-accent);
      transform: rotate(-45deg) translateY(-1px) scale(0);
      transition: transform var(--mt-dur-fast) var(--mt-ease);
    }
    :host([checked]) .box { background: var(--mt-accent); border-color: var(--mt-accent); }
    :host([checked]) .box::after { transform: rotate(-45deg) translateY(-1px) scale(1); }
    :host([indeterminate]) .box { background: var(--mt-accent); border-color: var(--mt-accent); }
    :host([indeterminate]) .box::after { width: 9px; height: 0; border-left: 0; border-bottom: 2px solid var(--mt-on-accent); transform: none; }
    .native:focus-visible ~ .box { outline: 2px solid var(--mt-accent); outline-offset: 3px; }
    :host([disabled]) .root { opacity: 0.5; cursor: not-allowed; }
    .text:empty { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["checked", "indeterminate", "disabled", "name", "value"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("change", this.#onChange);
      this.#bound = true;
    }
  }

  get checked(): boolean {
    return this.bool("checked");
  }

  set checked(next: boolean) {
    if (next) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
  }

  protected override update(): void {
    const input = this.q<HTMLInputElement>(".native");
    const disabled = this.bool("disabled");
    if (input) {
      input.checked = this.bool("checked");
      input.indeterminate = this.bool("indeterminate");
      input.disabled = disabled;
      input.name = this.attr("name");
      input.value = this.attr("value", "on");
    }
    this.syncFormValue(this.bool("checked") ? this.attr("value", "on") : null);
  }

  #onChange = (): void => {
    const input = this.q<HTMLInputElement>(".native");
    if (!input) return;
    if (input.checked) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
    this.syncFormValue(input.checked ? this.attr("value", "on") : null);
    emit(this, "mt-change", { value: this.attr("value", "on"), checked: input.checked });
  };
}
