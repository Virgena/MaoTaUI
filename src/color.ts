export const DEFAULT_SEED = "#5c7cfa";

export type MonetTheme = "dark" | "light";

export type MonetPalette = Record<string, string>;

const MIN_RATIO = 4.5;
const ON_DARK = "#0f1015";
const ON_LIGHT = "#ffffff";

interface Sl {
  s: number;
  l: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function seedHsl(seed: string): { h: number; s: number; l: number } {
  const matched = /^#?([0-9a-f]{6})$/i.exec(seed.trim());
  const hex = (matched?.[1] ?? DEFAULT_SEED.slice(1)).toLowerCase();
  const channel = (i: number) => parseInt(hex.slice(i * 2, i * 2 + 2), 16) / 255;
  const r = channel(0);
  const g = channel(1);
  const b = channel(2);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const span = max - min;
  if (span === 0) return { h: 0, s: 0, l: l * 100 };
  const h = max === r ? (g - b) / span : max === g ? (b - r) / span + 2 : (r - g) / span + 4;
  return { h: (((h * 60) % 360) + 360) % 360, s: (span / (1 - Math.abs(2 * l - 1))) * 100, l: l * 100 };
}

function hueToRgb(p: number, q: number, t: number): number {
  const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
  if (x < 1 / 6) return p + (q - p) * 6 * x;
  if (x < 1 / 2) return q;
  if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
  return p;
}

export function rgbHex(h: number, s: number, l: number): string {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const to = (t: number) => Math.round(hueToRgb(p, q, t) * 255).toString(16).padStart(2, "0");
  return `#${to((h / 360 + 1 / 3) % 1)}${to((h / 360) % 1)}${to((h / 360 - 1 / 3) % 1)}`;
}

export function luminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`只支持 #rrggbb, 收到: ${hex}`);
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function onFill(fill: string): string | null {
  if (contrast(fill, ON_LIGHT) >= MIN_RATIO) return ON_LIGHT;
  if (contrast(fill, ON_DARK) >= MIN_RATIO) return ON_DARK;
  return null;
}

export function toneStyle(color: string): Record<string, string> {
  if (color === "neutral" || color in HUE) {
    return {
      "--c": `var(--mt-color-${color})`,
      "--c-fill": `var(--mt-fill-${color})`,
      "--on-c": `var(--mt-on-${color})`,
    };
  }
  const on = /^#[0-9a-f]{6}$/i.test(color) ? (onFill(color) ?? ON_DARK) : `var(--mt-on-accent)`;
  return { "--c": color, "--c-fill": color, "--on-c": on };
}

const NEUTRAL: Record<MonetTheme, Record<"bg" | "surface" | "surface2" | "border" | "text" | "muted", Sl>> = {
  dark: {
    bg: { s: 16, l: 6.5 },
    surface: { s: 15, l: 10 },
    surface2: { s: 14, l: 13.5 },
    border: { s: 13, l: 19 },
    text: { s: 10, l: 93 },
    muted: { s: 9, l: 60 },
  },
  light: {
    bg: { s: 32, l: 95.5 },
    surface: { s: 22, l: 100 },
    surface2: { s: 26, l: 93.5 },
    border: { s: 20, l: 87 },
    text: { s: 10, l: 10 },
    muted: { s: 10, l: 40 },
  },
};

const HUE: Record<string, (seed: number) => number> = {
  primary: (h) => h,
  secondary: (h) => h + 45,
  info: (h) => h - 30,
  success: () => 148,
  warning: () => 40,
  danger: () => 12,
};

const DANGER_HUE = 12;
const SEMANTIC_SAT: Record<string, number> = { success: 60, warning: 88, danger: 66 };

function hueSat(seed: string, name: string): { h: number; s: number } {
  const root = seedHsl(seed);
  const shift = HUE[name];
  if (!shift) throw new Error(`未知色相: ${name}`);
  const fallback = name === "primary" ? clamp(root.s * 1.15, 8, 88) : clamp(root.s * 0.9, 6, 82);
  return { h: shift(root.h), s: SEMANTIC_SAT[name] ?? fallback };
}

function pickTone(hue: number, sat: number, around: string[], from: number, to: number): string {
  const step = from < to ? 1 : -1;
  for (let l = from; step > 0 ? l <= to : l >= to; l += step) {
    const color = rgbHex(hue, sat, l);
    if (around.every((rest) => contrast(color, rest) >= MIN_RATIO)) return color;
  }
  return rgbHex(hue, sat, to);
}

export function monetPalette(seed: string = DEFAULT_SEED, theme: MonetTheme = "dark"): MonetPalette {
  const root = seedHsl(seed);
  const tint = clamp(root.s / 45, 0, 1);
  const tinted = (sl: Sl) => rgbHex(root.h, sl.s * tint, sl.l);
  const n = NEUTRAL[theme];
  const bg = tinted(n.bg);
  const surface = tinted(n.surface);
  const surface2 = tinted(n.surface2);
  const border = tinted(n.border);
  const text = tinted(n.text);
  const muted = tinted(n.muted);
  const dangerSoft = theme === "dark" ? rgbHex(DANGER_HUE, 30, 13) : rgbHex(DANGER_HUE, 70, 96);
  const onDark = rgbHex(root.h, 16 * tint, 7);

  const around = [bg, surface, surface2, dangerSoft, theme === "dark" ? onDark : ON_LIGHT];
  const inkFor = (hue: number, sat: number) =>
    pickTone(hue, sat, around, theme === "dark" ? 50 : 55, theme === "dark" ? 88 : 18);

  const fillFor = (hue: number, sat: number, ink: string): { fill: string; on: string } => {
    const from = theme === "dark" ? 60 : 58;
    const to = theme === "dark" ? 26 : 34;
    for (let l = from; l >= to; l -= 1) {
      const fill = rgbHex(hue, sat, l);
      const on = theme === "dark" ? (contrast(fill, ON_LIGHT) >= MIN_RATIO ? ON_LIGHT : null) : onFill(fill);
      if (on) return { fill, on };
    }
    const on = onFill(ink);
    return on ? { fill: ink, on } : { fill: ink, on: theme === "dark" ? ON_DARK : ON_LIGHT };
  };

  const base: MonetPalette = {
    "--mt-bg": bg,
    "--mt-surface": surface,
    "--mt-surface-2": surface2,
    "--mt-border": border,
    "--mt-text": text,
    "--mt-muted": muted,
  };

  for (const name of Object.keys(HUE)) {
    const { h: hue, s: sat } = hueSat(seed, name);
    const ink = inkFor(hue, sat);
    const { fill, on } = fillFor(hue, sat, ink);
    base[`--mt-color-${name}`] = ink;
    base[`--mt-fill-${name}`] = fill;
    base[`--mt-on-${name}`] = on;
  }

  base["--mt-color-neutral"] = base["--mt-color-primary"]!;
  base["--mt-fill-neutral"] = base["--mt-fill-primary"]!;
  base["--mt-on-neutral"] = base["--mt-on-primary"]!;
  base["--mt-accent"] = base["--mt-fill-primary"]!;
  base["--mt-on-accent"] = base["--mt-on-primary"]!;
  base["--mt-danger"] = base["--mt-color-danger"]!;
  base["--mt-danger-soft"] = dangerSoft;
  return base;
}

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function monetScale(seed: string, name: string): Array<{ step: number; color: string }> {
  const { h, s } = hueSat(seed, name);
  return SCALE_STEPS.map((step, index) => ({ step, color: rgbHex(h, s, 95 - index * 8.2) }));
}

export function monetCss(seed: string = DEFAULT_SEED, important = false): string {
  const bang = important ? " !important" : "";
  const block = (selector: string, theme: MonetTheme) =>
    `${selector} {\n${Object.entries(monetPalette(seed, theme))
      .map(([name, value]) => `  ${name}: ${value}${bang};`)
      .join("\n")}\n}`;
  return `${block(":root", "dark")}\n\n${block(':root[data-theme="light"]', "light")}`;
}

export function applyMonet(seed: string = DEFAULT_SEED): void {
  if (typeof document === "undefined") return;
  const id = "mt-monet";
  const tag = (document.getElementById(id) as HTMLStyleElement | null) ?? document.createElement("style");
  tag.id = id;
  tag.textContent = monetCss(seed, true);
  if (!tag.isConnected) document.head.append(tag);
}
