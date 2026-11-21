import "../../src/styles.css";
import "../../src/index.ts";
import { applyTheme, resolveTheme } from "../../src/core/theme.ts";
import { createRoot } from "react-dom/client";
import { Docs } from "./Docs.tsx";
import "./shell.css";
import "./demo.css";

// 首帧前写入主题，避免亮暗切换导致的闪白；首次访问不写 storage，尊重系统偏好。
applyTheme(resolveTheme(), { persist: false });

createRoot(document.getElementById("root")!).render(<Docs />);
