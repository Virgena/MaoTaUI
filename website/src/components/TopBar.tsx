import type { Theme } from "../../../src/core/theme.ts";
import { LOGO } from "../logo.ts";
import { Search } from "./Search.tsx";

export function TopBar({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="topbar">
      <mao-brand name="MaoTaUI" href="#/colors" icon-src={LOGO} icon-alt="MaoTaUI" />
      <Search />
      <mao-button
        variant="bordered"
        size="sm"
        onClick={onToggle}
        aria-label={theme === "dark" ? "切换到亮色" : "切换到暗色"}
      >
        <mao-icon name={theme === "dark" ? "sun" : "moon"} size={16} />
      </mao-button>
    </header>
  );
}
