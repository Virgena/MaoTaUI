import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DEFAULT_SEED, contrast, luminance, monetPalette, monetScale } from "../src/color.ts";
import type { MonetTheme } from "../src/color.ts";

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

const base = tokens(":root");
const themes: Array<[string, MonetTheme, Record<string, string>]> = [
  ["暗色", "dark", base],
  ["亮色", "light", { ...base, ...tokens(':root[data-theme="light"]') }],
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

const KEYS = ["primary", "secondary", "info", "success", "warning", "danger", "neutral"];

function sweep(name: string, read: (token: string) => string): void {
  for (const fg of [...FOREGROUNDS, ...COLORS]) {
    for (const bg of BACKGROUNDS) {
      const ratio = contrast(read(fg), read(bg));
      assert.ok(ratio >= MIN, `${name}: ${fg} 在 ${bg} 上只有 ${ratio.toFixed(2)}:1 (要 >= ${MIN})`);
    }
  }
  for (const key of KEYS) {
    const ratio = contrast(read(`--mt-fill-${key}`), read(`--mt-on-${key}`));
    assert.ok(ratio >= MIN, `${name}: --mt-fill-${key} 上的字只有 ${ratio.toFixed(2)}:1`);
  }
  const button = contrast(read("--mt-accent"), read("--mt-on-accent"));
  assert.ok(button >= MIN, `${name}: 主按钮文字只有 ${button.toFixed(2)}:1`);
}

for (const [label, theme, t] of themes) {
  const generated = monetPalette(DEFAULT_SEED, theme);
  const read = (token: string) => value(t, token);
  for (const [token, expected] of Object.entries(generated)) {
    assert.equal(read(token), expected, `${label}: styles.css 的 ${token} 应该是 ${expected}`);
  }
  sweep(`${label} (styles.css)`, read);
  console.log(`${label}: ${Object.keys(generated).length} 个颜色 token 与 monetPalette(${DEFAULT_SEED}) 一致, 对比度全过`);
}

const SEEDS = [DEFAULT_SEED, "#e5484d", "#2fa46c", "#ffb224", "#8e4ec6", "#8b8d98", "#f0f0f0"];
for (const seed of SEEDS) {
  for (const theme of ["dark", "light"] as MonetTheme[]) {
    const palette = monetPalette(seed, theme);
    sweep(`种子 ${seed} ${theme}`, (token) => palette[token]!);
  }
}
console.log(`另 ${SEEDS.length} 个种子 × 2 套主题: 对比度全 >= ${MIN}:1, 主按钮单独盯过`);

for (const hue of ["primary", "secondary", "info", "success", "warning", "danger"]) {
  const scale = monetScale(DEFAULT_SEED, hue);
  assert.equal(scale.length, 11, `${hue}: 色阶应该是 11 档`);
  assert.ok(contrast(scale[0]!.color, scale[10]!.color) > 4.5, `${hue}: 色阶两端拉不开`);
  for (let i = 1; i < scale.length; i += 1) {
    assert.ok(
      luminance(scale[i]!.color) < luminance(scale[i - 1]!.color),
      `${hue}: ${scale[i]!.step} 不比 ${scale[i - 1]!.step} 暗`,
    );
  }
}
console.log("6 条色阶: 各 11 档, 由 50 到 950 单调变暗");
