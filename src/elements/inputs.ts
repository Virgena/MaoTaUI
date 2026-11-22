import { MaoElement } from "./base.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";

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
  .wrap { position: relative; display: block; min-width: 0; }
  .prefix {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    display: none; color: var(--mt-faint); line-height: 0; pointer-events: none;
  }
  .clear {
    position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
    display: none; place-items: center;
    width: 20px; height: 20px; padding: 0;
    border: 0; border-radius: 50%;
    background: transparent; color: var(--mt-faint);
    cursor: pointer; line-height: 0;
  }
  .clear:hover { color: var(--mt-text); background: var(--mt-surface-2); }
  .clear:focus-visible { outline: 2px solid var(--mt-accent); outline-offset: 2px; }
  .wrap.has-icon .prefix { display: block; }
  .wrap.has-icon .control { padding-left: 34px; }
  .wrap.has-clear .control { padding-right: 30px; }
  .wrap.has-clear.has-value .clear { display: grid; }
  .foot { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
  .count { margin-left: auto; font-size: var(--mt-fs-xs); color: var(--mt-faint); font-variant-numeric: tabular-nums; }
  :host(:not([show-count])) .count { display: none; }
`;

/** `<mao-text-field>`：shadow DOM + 表单关联。 */
export class MaoTextField extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <div class="field" part="field">
      <label class="label" part="label" for="control"></label>
      <span class="wrap" part="wrap">
        <span class="prefix" part="prefix"></span>
        <input class="control" id="control" part="input" />
        <button class="clear" part="clear" type="button" aria-label="清空"></button>
      </span>
      <span class="foot" part="foot">
        <span class="hint" part="hint"></span>
        <span class="count" part="count"></span>
      </span>
    </div>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return [
      "label",
      "hint",
      "value",
      "placeholder",
      "type",
      "name",
      "required",
      "disabled",
      "readonly",
      "invalid",
      "autocomplete",
      "maxlength",
      "show-count",
      "clearable",
      "icon",
    ];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("input", this.#onInput);
      root.addEventListener("change", this.#onInput);
      this.q(".clear")?.addEventListener("click", this.#onClear);
      this.#bound = true;
    }
  }

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
    const wrap = this.q(".wrap");
    const prefix = this.q(".prefix");
    const clear = this.q(".clear");
    if (prefix) prefix.innerHTML = iconSvg(this.attr("icon"), { size: 16 });
    if (clear) clear.innerHTML = iconSvg("x", { size: 14 });
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
    const maxlength = this.getAttribute("maxlength");
    if (maxlength) input.maxLength = this.num("maxlength", -1);
    else input.removeAttribute("maxlength");
    const next = this.attr("value");
    if (input.value !== next) input.value = next;
    this.syncFormValue(next);
    if (this.bool("required") && !next) {
      this.syncValidity({ valueMissing: true }, "请填写此字段");
    } else {
      this.syncValidity({});
    }
    if (wrap) {
      wrap.classList.toggle("has-icon", Boolean(this.attr("icon")));
      wrap.classList.toggle("has-clear", this.bool("clearable"));
      wrap.classList.toggle("has-value", next !== "");
    }
    this.#syncCount(next);
  }

  #syncCount(value: string): void {
    const count = this.q(".count");
    if (!count) return;
    const limit = this.num("maxlength", 0);
    count.textContent = limit > 0 ? `${value.length}/${limit}` : String(value.length);
  }

  #onInput = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (this.getAttribute("value") !== input.value) this.setAttribute("value", input.value);
    this.#syncCount(input.value);
    emit(this, "mt-input", { value: input.value, name: this.attr("name") });
  };

  #onClear = (): void => {
    if (this.bool("disabled") || this.bool("readonly")) return;
    this.setAttribute("value", "");
    this.#syncCount("");
    emit(this, "mt-input", { value: "", name: this.attr("name") });
    emit(this, "mt-change", { value: "" });
    this.focus();
  };

  /** 选中区间。 */
  getSelection(): { start: number; end: number } {
    const input = this.q<HTMLInputElement>(".control");
    return { start: input?.selectionStart ?? 0, end: input?.selectionEnd ?? 0 };
  }

  setSelection(start: number, end = start): void {
    const input = this.q<HTMLInputElement>(".control");
    if (!input) return;
    input.setSelectionRange(start, end);
    input.focus();
  }

  /** 在光标处插入文本，或替换当前选区。 */
  insert(text: string): void {
    const input = this.q<HTMLInputElement>(".control");
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const next = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
    this.setAttribute("value", next);
    input.value = next;
    const caret = start + text.length;
    input.focus();
    input.setSelectionRange(caret, caret);
    this.#syncCount(next);
    emit(this, "mt-input", { value: next, name: this.attr("name") });
  }

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
    <div class="field" part="field">
      <label class="label" part="label" for="control"></label>
      <textarea class="control" id="control" part="textarea"></textarea>
      <span class="foot" part="foot">
        <span class="hint" part="hint"></span>
        <span class="count" part="count"></span>
      </span>
    </div>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return [
      "label",
      "hint",
      "value",
      "placeholder",
      "rows",
      "name",
      "required",
      "disabled",
      "readonly",
      "invalid",
      "maxlength",
      "show-count",
    ];
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
    const maxlength = this.getAttribute("maxlength");
    if (maxlength) area.maxLength = this.num("maxlength", -1);
    else area.removeAttribute("maxlength");
    const next = this.attr("value");
    if (area.value !== next) area.value = next;
    this.syncFormValue(next);
    this.#syncCount(next);
  }

  #syncCount(value: string): void {
    const count = this.q(".count");
    if (!count) return;
    const limit = this.num("maxlength", 0);
    count.textContent = limit > 0 ? `${value.length}/${limit}` : String(value.length);
  }

  /** 选中区间。 */
  getSelection(): { start: number; end: number } {
    const area = this.q<HTMLTextAreaElement>(".control");
    return { start: area?.selectionStart ?? 0, end: area?.selectionEnd ?? 0 };
  }

  setSelection(start: number, end = start): void {
    const area = this.q<HTMLTextAreaElement>(".control");
    if (!area) return;
    area.setSelectionRange(start, end);
    area.focus();
  }

  /** 在光标处插入文本，或替换当前选区。 */
  insert(text: string): void {
    this.#replace(text, "");
  }

  /** 用前后缀包裹选区，无选区时插入占位文本。 */
  wrapSelection(before: string, after: string, placeholder = ""): void {
    this.#replace(before, after, placeholder);
  }

  #replace(before: string, after: string, placeholder = ""): void {
    const area = this.q<HTMLTextAreaElement>(".control");
    if (!area) return;
    const start = area.selectionStart ?? area.value.length;
    const end = area.selectionEnd ?? start;
    const selected = area.value.slice(start, end) || placeholder;
    const next = `${area.value.slice(0, start)}${before}${selected}${after}${area.value.slice(end)}`;
    this.setAttribute("value", next);
    area.value = next;
    area.focus();
    const caretStart = start + before.length;
    area.setSelectionRange(caretStart, caretStart + selected.length);
    this.#syncCount(next);
    emit(this, "mt-input", { value: next, name: this.attr("name") });
  }

  #onInput = (event: Event): void => {
    const area = event.target;
    if (!(area instanceof HTMLTextAreaElement)) return;
    if (this.getAttribute("value") !== area.value) this.setAttribute("value", area.value);
    this.#syncCount(area.value);
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
  disabled?: boolean;
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
        return { value, label: String(record.label ?? value), disabled: Boolean(record.disabled) };
      }
      return { value: "", label: "" };
    });
  } catch {
    if (typeof console !== "undefined") console.warn("[maotaui] mao-select 的 options 不是合法 JSON：", raw);
    return [];
  }
}

/** `<mao-select>`：shadow DOM，options 以 JSON 属性传入。 */
export class MaoSelect extends MaoElement {
  static formAssociated = true;
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <div class="field" part="field">
      <label class="label" part="label" for="control"></label>
      <span class="wrap" part="wrap">
        <select class="control" id="control" part="select"></select>
        <button class="clear" part="clear" type="button" aria-label="清空"></button>
      </span>
      <span class="foot" part="foot"><span class="hint" part="hint"></span></span>
    </div>
  `;
  static override readonly styles = FIELD_STYLES;

  static get observedAttributes(): string[] {
    return ["label", "hint", "options", "value", "placeholder", "name", "required", "disabled", "clearable", "invalid"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.shadowRoot;
    if (root && !this.#bound) {
      root.addEventListener("change", this.#onChange);
      this.q(".clear")?.addEventListener("click", this.#onClear);
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
    const clear = this.q(".clear");
    if (label) label.textContent = this.attr("label");
    if (hint) hint.textContent = this.attr("hint");
    if (clear) clear.innerHTML = iconSvg("x", { size: 14 });
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
      option.disabled = Boolean(item.disabled);
      select.append(option);
    });

    select.name = this.attr("name");
    select.required = this.bool("required");
    select.disabled = this.bool("disabled");
    select.setAttribute("aria-invalid", String(this.bool("invalid")));
    select.value = this.attr("value");
    this.syncFormValue(select.value);
    const wrap = this.q(".wrap");
    if (wrap) {
      wrap.classList.toggle("has-clear", this.bool("clearable"));
      wrap.classList.toggle("has-value", select.value !== "");
    }
  }

  #onChange = (): void => {
    const select = this.q<HTMLSelectElement>(".control");
    if (!select) return;
    this.setAttribute("value", select.value);
    this.syncFormValue(select.value);
    const wrap = this.q(".wrap");
    if (wrap) wrap.classList.toggle("has-value", select.value !== "");
    emit(this, "mt-change", { value: select.value });
  };

  #onClear = (): void => {
    if (this.bool("disabled")) return;
    this.setAttribute("value", "");
    this.syncFormValue("");
    const wrap = this.q(".wrap");
    if (wrap) wrap.classList.remove("has-value");
    this.focus();
    emit(this, "mt-change", { value: "" });
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
      color: var(--mt-on-accent);
      transition: background var(--mt-dur-fast) var(--mt-ease), border-color var(--mt-dur-fast) var(--mt-ease);
    }
    :host([checked]) .box { background: var(--mt-accent); border-color: var(--mt-accent); }
    :host([indeterminate]) .box { background: var(--mt-accent); border-color: var(--mt-accent); }
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
    const box = this.q<HTMLElement>(".box");
    if (box) {
      box.innerHTML = this.bool("indeterminate")
        ? iconSvg("minus", { size: 12 })
        : this.bool("checked")
          ? iconSvg("check", { size: 12 })
          : "";
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
