/**
 * MaoTaUI 统一入口。
 * 导入即注册全部 mao-* 自定义元素（仅在浏览器环境）。
 * 服务端 / Node 中只导出纯数据与工具，不会触碰 DOM。
 */

import "./styles.css";
import { defineMaoElements } from "./elements/index.ts";

export * from "./core/index.ts";
export * from "./elements/index.ts";

if (typeof customElements !== "undefined") {
  defineMaoElements();
}
