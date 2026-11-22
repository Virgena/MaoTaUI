/**
 * 命令式反馈 API：`toast()` 与 `confirm()`。
 * 首次调用时按需注册元素并把宿主挂到 body，SSR 下安静返回。
 */

import { defineMaoElements } from "../elements/index.ts";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  tone?: ToastTone;
  heading?: string;
  content?: string;
  duration?: number;
  closable?: boolean;
}

export interface ConfirmOptions {
  heading?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm?: () => unknown;
}

const STACK_CLASS = "mt-toast-stack";
const DEFAULT_TOAST_DURATION = 3000;

function ensureElements(): void {
  if (typeof customElements === "undefined") return;
  defineMaoElements();
}

function toastStack(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  ensureElements();
  const found = document.querySelector<HTMLElement>(`.${STACK_CLASS}`);
  if (found) return found;
  const stack = document.createElement("div");
  stack.className = STACK_CLASS;
  stack.setAttribute("role", "region");
  stack.setAttribute("aria-label", "通知");
  document.body.append(stack);
  return stack;
}

function dropEmptyStack(stack: HTMLElement | null): void {
  if (stack && stack.childElementCount === 0) stack.remove();
}

/**
 * 显示一条瞬时消息，返回手动关闭函数。
 */
export function toast(options: ToastOptions | string): () => void {
  const stack = toastStack();
  if (!stack) return () => {};
  const opts: ToastOptions = typeof options === "string" ? { content: options } : options;
  const el = document.createElement("mao-toast");
  el.setAttribute("tone", opts.tone ?? "info");
  if (opts.heading) el.setAttribute("heading", opts.heading);
  if (opts.closable) el.setAttribute("closable", "");
  el.textContent = opts.content ?? "";
  el.addEventListener("mt-close", () => el.remove(), { once: true });
  stack.append(el);

  const duration = opts.duration ?? DEFAULT_TOAST_DURATION;
  const timer =
    duration > 0
      ? setTimeout(() => {
          el.remove();
          dropEmptyStack(stack);
        }, duration)
      : null;

  return () => {
    if (timer) clearTimeout(timer);
    el.remove();
    dropEmptyStack(stack);
  };
}

/**
 * 弹出确认框，返回 Promise：确认 true，取消 / Esc / 遮罩 false。
 */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  if (typeof document === "undefined") return Promise.resolve(false);
  ensureElements();

  return new Promise<boolean>((resolve) => {
    const dialog = document.createElement("mao-dialog");
    dialog.setAttribute("size", "sm");
    dialog.setAttribute("closable", "");
    dialog.setAttribute("heading", options.heading ?? "确认操作");

    const text = document.createElement("p");
    text.className = "mt-confirm-text";
    text.textContent = options.content ?? "";
    dialog.append(text);

    const cancel = document.createElement("mao-button");
    cancel.setAttribute("slot", "actions");
    cancel.setAttribute("variant", "bordered");
    cancel.textContent = options.cancelText ?? "取消";

    const ok = document.createElement("mao-button");
    ok.setAttribute("slot", "actions");
    ok.setAttribute("color", options.danger ? "danger" : "primary");
    ok.textContent = options.okText ?? "确定";

    dialog.append(cancel, ok);

    let settled = false;
    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      dialog.removeAttribute("open");
      dialog.remove();
      resolve(result);
    };

    cancel.addEventListener("click", () => finish(false));
    dialog.addEventListener("mt-close", () => finish(false));
    ok.addEventListener("click", async () => {
      if (settled) return;
      ok.setAttribute("loading", "");
      try {
        const outcome = await options.onConfirm?.();
        if (outcome === false) {
          ok.removeAttribute("loading");
          return;
        }
        finish(true);
      } catch {
        ok.removeAttribute("loading");
      }
    });

    document.body.append(dialog);
    dialog.setAttribute("open", "");
  });
}
