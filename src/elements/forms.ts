import { MaoElement } from "./base.ts";
import { emit } from "../core/events.ts";
import { iconSvg } from "../core/icons.ts";
import { parseRules, runRules } from "../core/validate.ts";

const FIELD_SELECTOR = "mao-text-field, mao-text-area, mao-select, mao-checkbox-group, mao-switch, input, textarea, select";

function fieldValue(field: Element | null): string {
  if (!field) return "";
  const value = (field as { value?: unknown }).value;
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return field.getAttribute("value") ?? "";
}

/** `<mao-form-item>`：shadow DOM 表单项外壳，负责标签、必填标记与错误文案。 */
export class MaoFormItem extends MaoElement {
  static override readonly mode = "shadow" as const;
  static override readonly shadowHTML = `
    <div class="item">
      <span class="label" part="label">
        <span class="text"></span>
        <span class="req" aria-hidden="true">*</span>
      </span>
      <div class="control" part="control"><slot></slot></div>
      <p class="hint" part="hint"></p>
      <p class="error" part="error" role="alert"></p>
    </div>
  `;
  static override readonly styles = `
    :host { display: block; font-family: var(--mt-font); }
    .item { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .label { display: inline-flex; align-items: baseline; gap: 3px; font-size: var(--mt-fs-xs); color: var(--mt-muted); letter-spacing: 0.02em; }
    .label .text:empty { display: none; }
    .label:has(.text:empty) { display: none; }
    .req { color: var(--mt-danger); display: none; }
    :host([required]) .req, :host([data-required]) .req { display: inline; }
    .hint, .error { margin: 0; font-size: var(--mt-fs-xs); line-height: 1.5; }
    .hint { color: var(--mt-faint); }
    .error { color: var(--mt-danger); display: none; }
    :host([error]) .error { display: block; }
    :host([error]) .hint { display: none; }
    .hint:empty { display: none; }
  `;

  static get observedAttributes(): string[] {
    return ["name", "label", "hint", "rules", "required", "error"];
  }

  protected override update(): void {
    const text = this.q(".text");
    const hint = this.q(".hint");
    const error = this.q(".error");
    if (text) text.textContent = this.attr("label");
    if (hint) hint.textContent = this.attr("hint");
    if (error) error.textContent = this.attr("error");
    if (!this.hasAttribute("required")) {
      const required = parseRules(this.attr("rules")).some((rule) => rule.rule === "required");
      this.classList.toggle("is-required", required);
      this.toggleAttribute("data-required", required);
    }
  }

  /** 表单项内的字段元素。 */
  get field(): Element | null {
    return this.querySelector(FIELD_SELECTOR);
  }

  get value(): string {
    return fieldValue(this.field);
  }

  /** 校验本项，返回错误文案或 null。 */
  check(): string | null {
    const rules = parseRules(this.attr("rules"));
    const fallback = this.bool("required") ? [{ rule: "required" as const }] : [];
    const error = runRules(this.value, rules.length > 0 ? rules : fallback);
    this.setError(error);
    return error;
  }

  setError(message: string | null): void {
    if (message) this.setAttribute("error", message);
    else this.removeAttribute("error");
    const field = this.field;
    if (!field) return;
    if (message) field.setAttribute("invalid", "");
    else field.removeAttribute("invalid");
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }
}

/** `<mao-form>`：light DOM 表单容器，收集 `[name]` 字段并派发 `mt-submit`。 */
export class MaoForm extends MaoElement {
  static get observedAttributes(): string[] {
    return ["disabled", "label"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.#bound) return;
    this.addEventListener("keydown", this.#onKeyDown);
    this.addEventListener("click", this.#onClick);
    this.#bound = true;
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.#onKeyDown);
    this.removeEventListener("click", this.#onClick);
    this.#bound = false;
  }

  protected override update(): void {
    this.classList.add("mt-form");
    this.setAttribute("role", "form");
    if (this.attr("label")) this.setAttribute("aria-label", this.attr("label"));
    const disabled = this.bool("disabled");
    this.#items().forEach((item) => {
      const field = item.field;
      if (field) this.#setFieldDisabled(field, disabled);
    });
  }

  get items(): MaoFormItem[] {
    return this.#items();
  }

  #items(): MaoFormItem[] {
    return Array.from(this.querySelectorAll<MaoFormItem>("mao-form-item"));
  }

  #setFieldDisabled(field: Element, disabled: boolean): void {
    if (disabled) field.setAttribute("disabled", "");
    else field.removeAttribute("disabled");
  }

  /** 读取全部具名字段的当前值。 */
  getValues(): Record<string, string> {
    const out: Record<string, string> = {};
    this.#namedFields().forEach((field) => {
      const name = field.getAttribute("name");
      if (!name) return;
      out[name] = fieldValue(field);
    });
    return out;
  }

  #namedFields(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll<HTMLElement>(
        "mao-text-field[name], mao-text-area[name], mao-select[name], mao-checkbox-group[name], mao-switch[name], input[name], textarea[name], select[name]",
      ),
    );
  }

  /** 校验所有表单项；不通过时派发 `mt-invalid`。 */
  validate(): boolean {
    const errors: Record<string, string> = {};
    this.#items().forEach((item, index) => {
      const error = item.check();
      if (error) errors[item.getAttribute("name") ?? `item-${index}`] = error;
    });
    if (Object.keys(errors).length > 0) {
      emit(this, "mt-invalid", { errors });
      this.#focusFirstInvalid();
      return false;
    }
    return true;
  }

  /** 清空所有错误。 */
  clearErrors(): void {
    this.#items().forEach((item) => item.setError(null));
  }

  /** 校验通过后派发 `mt-submit { values }`。 */
  submit(): void {
    if (this.bool("disabled")) return;
    if (!this.validate()) return;
    emit(this, "mt-submit", { values: this.getValues() });
  }

  /** 清空所有具名字段与错误。 */
  reset(): void {
    this.#namedFields().forEach((field) => {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        field.value = "";
        return;
      }
      field.setAttribute("value", "");
    });
    this.clearErrors();
  }

  #focusFirstInvalid(): void {
    const first = this.querySelector<MaoFormItem>("mao-form-item[error]")?.field;
    (first as HTMLElement | null)?.focus?.();
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || event.shiftKey || event.metaKey || event.ctrlKey) return;
    const path = event.composedPath();
    if (path.some((node) => node instanceof HTMLTextAreaElement)) return;
    if (path.some((node) => node instanceof HTMLButtonElement)) return;
    event.preventDefault();
    this.submit();
  };

  #onClick = (event: MouseEvent): void => {
    const trigger = (event.target as Element | null)?.closest?.('[type="submit"]');
    if (!trigger || !this.contains(trigger)) return;
    event.preventDefault();
    this.submit();
  };
}

/** `<mao-checkbox-group>`：light DOM 多选组，值以逗号连接。 */
export class MaoCheckboxGroup extends MaoElement {
  static formAssociated = true;
  static get observedAttributes(): string[] {
    return ["name", "value", "disabled", "label"];
  }

  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.#bound) return;
    this.addEventListener("mt-change", this.#onChildChange);
    this.#bound = true;
    this.#syncChildren();
  }

  disconnectedCallback(): void {
    this.removeEventListener("mt-change", this.#onChildChange);
    this.#bound = false;
  }

  get value(): string[] {
    return this.attr("value")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  set value(next: string[]) {
    this.setAttribute("value", next.join(","));
  }

  protected override update(): void {
    this.classList.add("mt-checkbox-group");
    this.setAttribute("role", "group");
    if (this.attr("label")) this.setAttribute("aria-label", this.attr("label"));
    this.#syncChildren();
    this.syncFormValue(this.value.join(","));
  }

  #boxes(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>("mao-checkbox"));
  }

  #syncChildren(): void {
    const checked = new Set(this.value);
    const disabled = this.bool("disabled");
    this.#boxes().forEach((box) => {
      const value = box.getAttribute("value") ?? "";
      if (checked.has(value)) box.setAttribute("checked", "");
      else box.removeAttribute("checked");
      if (disabled) box.setAttribute("disabled", "");
    });
  }

  #onChildChange = (): void => {
    if (this.bool("disabled")) return;
    queueMicrotask(() => {
      const values = this.#boxes()
        .filter((box) => box.hasAttribute("checked"))
        .map((box) => box.getAttribute("value") ?? "")
        .filter(Boolean);
      this.setAttribute("value", values.join(","));
      this.syncFormValue(values.join(","));
      emit(this, "mt-change", { value: values.join(","), values });
    });
  };
}
