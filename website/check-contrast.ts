import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

function tokens(selector: string): Record<string, string> {
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (sel!.trim() !== selector) continue;
    const map: Record<string, string> = {};
    for (const [, name, value] of body!.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      map[name!] = value!.trim();
    }
    return map;
  }
  throw new Error(`styles.css 里找不到 ${selector}`);
}

function luminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`只支持 #rrggbb, 收到: ${hex}`);
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const base = tokens(":root");
const themes: Array<[string, Record<string, string>]> = [
  ["暗色", base],
  ["亮色", { ...base, ...tokens(':root[data-theme="light"]') }],
];

const MIN = 4.5;
const BACKGROUNDS = ["--mt-bg", "--mt-surface", "--mt-surface-2", "--mt-danger-soft"];
const FOREGROUNDS = ["--mt-text", "--mt-muted", "--mt-danger"];
const COLORS = [
  "--mt-color-primary",
  "--mt-color-secondary",
  "--mt-color-success",
  "--mt-color-warning",
  "--mt-color-danger",
  "--mt-color-info",
  "--mt-color-neutral",
];

function value(t: Record<string, string>, name: string): string {
  const v = t[name];
  if (v === undefined) throw new Error(`styles.css 里没有 ${name}`);
  const ref = /^var\(\s*(--[\w-]+)\s*\)$/.exec(v);
  return ref ? value(t, ref[1]!) : v;
}

for (const [theme, t] of themes) {
  const read = (name: string) => value(t, name);
  for (const fg of [...FOREGROUNDS, ...COLORS]) {
    for (const bg of BACKGROUNDS) {
      const ratio = contrast(read(fg), read(bg));
      assert.ok(ratio >= MIN, `${theme}: ${fg} 在 ${bg} 上只有 ${ratio.toFixed(2)}:1 (要 >= ${MIN})`);
    }
  }
  const button = contrast(read("--mt-accent"), read("--mt-on-accent"));
  assert.ok(button >= MIN, `${theme}: 主按钮文字只有 ${button.toFixed(2)}:1`);
  for (const color of COLORS) {
    const ratio = contrast(read(color), read("--mt-on-accent"));
    assert.ok(ratio >= MIN, `${theme}: ${color} 当底色时反色字只有 ${ratio.toFixed(2)}:1`);
  }
  console.log(
    `${theme}: 文字/次要/危险 + ${COLORS.length} 个色相对四种底都 >= ${MIN}:1, 主按钮 ${button.toFixed(1)}:1`,
  );
}
