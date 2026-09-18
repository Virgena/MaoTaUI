import { MaoBrand, MaoButton, MaoIcon } from "../../../src/index.tsx";
import { Search } from "./Search.tsx";

export const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="#617ff5"/><path d="M11 28V13l9 7.5 9-7.5v15" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}`;

export function TopBar({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  return (
    <header className="topbar">
      <MaoBrand name="MaoTaUI" iconSrc={LOGO} iconClass="brand-icon" nameClass="brand-name" />
      <Search />
      <MaoButton
        variant="bordered"
        size="sm"
        onClick={onToggle}
        aria-label={theme === "dark" ? "切换到亮色" : "切换到暗色"}
      >
        <MaoIcon name={theme === "dark" ? "sun" : "moon"} size={16} />
      </MaoButton>
    </header>
  );
}
