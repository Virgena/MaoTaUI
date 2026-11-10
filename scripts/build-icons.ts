import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICON_SOURCES = [
  "plus",
  "minus",
  "check",
  "x",
  "search",
  "ellipsis",
  "copy",
  "cpu",
  "refresh-cw",
  "link",
  "external-link",
  "chevron-down",
  "chevron-right",
  "arrow-left",
  "arrow-up",
  "arrow-right",
  "arrow-up-right",
  "square",
  "trash",
  "calendar",
  "clock",
  "folder",
  "folder-open",
  "plug",
  "sliders-vertical",
  "lightbulb",
  "hand",
  "shield-check",
  "pin",
  "archive",
  "rotate-ccw",
  "git-branch",
  "git-fork",
  "info",
  "triangle-alert",
  "heart",
  "star",
  "bookmark",
  "share-2",
  "message-square",
  "sun",
  "moon",
  "palette",
] as const;

interface IconifyData {
  width?: number;
  height?: number;
  icons: Record<string, { body: string }>;
  aliases?: Record<string, { parent: string }>;
}

const require = createRequire(import.meta.url);
const data = JSON.parse(
  readFileSync(require.resolve("@iconify-json/lucide/icons.json"), "utf8"),
) as IconifyData;

if (data.width !== 24 || data.height !== 24) {
  throw new Error(`Lucide 图标尺寸应为 24×24，实际为 ${String(data.width)}×${String(data.height)}`);
}

function resolveBody(name: string): string {
  const seen = new Set<string>();
  let id = name;
  while (true) {
    const alias = data.aliases?.[id];
    if (!alias) break;
    if (seen.has(id)) throw new Error(`图标别名存在循环引用: ${name}`);
    seen.add(id);
    id = alias.parent;
  }
  const icon = data.icons[id];
  if (!icon) throw new Error(`@iconify-json/lucide 中找不到图标: ${name}`);
  return icon.body;
}

function normalize(body: string): string {
  return body
    .replace(/\s+(?:stroke|stroke-width|stroke-linecap|stroke-linejoin)="[^"]*"/g, "")
    .replace(/\sfill="none"/g, "")
    .replace(/<\/?g>/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function quote(value: string): string {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

const entries = ICON_SOURCES.map((name) => {
  const body = normalize(resolveBody(name));
  if (!body.startsWith("<")) throw new Error(`图标 ${name} 的 SVG 内容无效: ${body}`);
  return `  "${name}": ${quote(body)},`;
});

const output = fileURLToPath(new URL("../src/core/icons.generated.ts", import.meta.url));
mkdirSync(dirname(output), { recursive: true });
writeFileSync(
  output,
  [
    "// 此文件由 scripts/build-icons.ts 从 @iconify-json/lucide 生成，请勿手动修改。图标来源：Lucide (ISC)。",
    "export const ICON_PATHS = {",
    ...entries,
    "} as const;",
    "",
  ].join("\n"),
  "utf8",
);

console.log(`生成 ${entries.length} 个图标 → ${output}`);
