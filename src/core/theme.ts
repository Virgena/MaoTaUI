export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "maotaui.theme";

function hasDom(): boolean {
  return typeof document !== "undefined";
}

function readStored(storageKey: string): Theme | null {
  if (typeof document === "undefined" || typeof localStorage === "undefined") return null;
  try {
    const value = localStorage.getItem(storageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function resolveTheme(storageKey: string = THEME_STORAGE_KEY): Theme {
  const stored = readStored(storageKey);
  if (stored) return stored;
  if (typeof matchMedia === "undefined") return "light";
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(
  theme: Theme,
  options: { persist?: boolean; storageKey?: string; root?: HTMLElement | null } = {},
): void {
  if (!hasDom()) return;
  const { persist = true, storageKey = THEME_STORAGE_KEY, root = document.documentElement } = options;
  root?.setAttribute("data-theme", theme);
  if (!persist || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    /* 隐私模式下静默失败 */
  }
}

export function currentTheme(root: HTMLElement | null = hasDom() ? document.documentElement : null): Theme {
  return root?.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function toggleTheme(options: Parameters<typeof applyTheme>[1] = {}): Theme {
  const next: Theme = currentTheme(options.root ?? null) === "dark" ? "light" : "dark";
  applyTheme(next, options);
  return next;
}

export function watchSystemTheme(handler: (theme: Theme) => void): () => void {
  if (typeof matchMedia === "undefined") return () => {};
  const query = matchMedia("(prefers-color-scheme: dark)");
  const listener = (event: MediaQueryListEvent) => handler(event.matches ? "dark" : "light");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
