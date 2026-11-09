/**
 * 表单关联元素基类。
 * SSR / 旧浏览器没有 attachInternals 时安静降级，不参与表单提交。
 * Node 中没有 HTMLElement，退化为空基类，保证入口可被安全导入。
 */
const BaseElement: typeof HTMLElement =
  typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

export abstract class FormAssociated extends BaseElement {
  #internals: ElementInternals | null = null;

  protected get internals(): ElementInternals | null {
    if (this.#internals) return this.#internals;
    if (typeof this.attachInternals !== "function") return null;
    try {
      this.#internals = this.attachInternals();
    } catch {
      this.#internals = null;
    }
    return this.#internals;
  }

  protected syncFormValue(value: string | File | null): void {
    this.internals?.setFormValue(value);
  }

  protected syncValidity(flags: ValidityStateFlags, message = ""): void {
    const internals = this.internals;
    if (!internals) return;
    const anchor = this.shadowRoot?.querySelector<HTMLElement>("input, textarea, select, button") ?? undefined;
    internals.setValidity(flags, message, anchor);
  }

  get form(): HTMLFormElement | null {
    return this.internals?.form ?? null;
  }

  get name(): string {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    if (value) this.setAttribute("name", value);
    else this.removeAttribute("name");
  }
}
