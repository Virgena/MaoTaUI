/**
 * 内置图标库：图标 body 由 scripts/build-icons.ts 从 @iconify-json/lucide 生成后内联。
 * 全部为 24×24 viewBox 的静态 SVG 标记，不发任何网络请求，可被任意框架或服务端渲染器复用的字符串 API。
 */
export { ICON_PATHS } from "./icons.generated.ts";
import { ICON_PATHS } from "./icons.generated.ts";

export type IconName = keyof typeof ICON_PATHS;

export const ICON_NAMES = Object.keys(ICON_PATHS) as IconName[];

export interface IconOptions {
  size?: number | string | undefined;
  label?: string | undefined;
  strokeWidth?: number | undefined;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * 生成确定性 SVG 字符串。
 * @param name Lucide 图标名（ICON_PATHS 的 key，例如 chevron-down）
 * @param options size / label / strokeWidth
 */
export function iconSvg(name: string, options: IconOptions = {}): string {
  const body = (ICON_PATHS as Record<string, string | undefined>)[name];
  if (!body) return "";
  const { size = 16, label, strokeWidth = 2 } = options;
  const a11y = label
    ? `role="img" aria-label="${escapeAttr(label)}"`
    : 'aria-hidden="true" focusable="false"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`;
}

export function hasIcon(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(ICON_PATHS, name);
}
