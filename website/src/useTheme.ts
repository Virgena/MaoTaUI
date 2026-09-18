import { useEffect, useState } from "react";

const THEME_KEY = "maotaui.theme";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((now) => (now === "dark" ? "light" : "dark")) };
}
