import { useState } from "react";
import { currentTheme, toggleTheme } from "../../src/core/theme.ts";
import type { Theme } from "../../src/core/theme.ts";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());
  return {
    theme,
    toggle: () => setTheme(toggleTheme()),
  };
}
