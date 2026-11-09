/**
 * SSR / Node 冒烟测试：证明入口在无 DOM 环境下可安全导入。
 * 运行：pnpm ssr
 */

import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Node 不认识 CSS 副作用导入，替换为空模块（打包器里由 Vite 处理）。
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".css")) {
      return { url: "data:text/javascript,export default {}", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const before = {
  document: typeof document,
  window: typeof window,
  customElements: typeof customElements,
};

assert.equal(before.document, "undefined", "SSR 冒烟测试必须在无 DOM 环境运行");
assert.equal(before.customElements, "undefined", "Node 中不应存在 customElements");

const lib = await import("../src/index.ts");
const { ELEMENT_DEFINITIONS } = await import("../src/elements/index.ts");
const { COMPONENT_REGISTRY, componentMeta } = await import("../src/core/registry.ts");
const { iconSvg, ICON_NAMES } = await import("../src/core/icons.ts");
const { resolveTheme } = await import("../src/core/theme.ts");

assert.equal(typeof document, "undefined", "导入库后不应访问 document");
assert.equal(typeof customElements, "undefined", "导入库后不应注册元素");

// 图标纯函数：同样入参得到同样结果，且自带 xmlns（不依赖网络）。
const first = iconSvg("check");
assert.equal(first, iconSvg("check"), "iconSvg 必须是纯函数");
assert.ok(first.includes("<svg"), "iconSvg 应返回 SVG 字符串");
assert.ok(ICON_NAMES.length >= 40, "内置图标数量不足");

// registry 是单一事实源：标签唯一、mao- 前缀、与元素注册表一一对应。
const tags = COMPONENT_REGISTRY.map((item) => item.tag);
assert.equal(new Set(tags).size, tags.length, "registry 中存在重复标签");
for (const tag of tags) assert.ok(tag.startsWith("mao-"), `非法标签: ${tag}`);

const defined = Object.keys(ELEMENT_DEFINITIONS);
assert.deepEqual([...tags].sort(), [...defined].sort(), "registry 与 ELEMENT_DEFINITIONS 不一致");
assert.ok(componentMeta("mao-button"), "componentMeta 查询失败");

// 无 matchMedia 时主题解析必须回退到 light。
assert.equal(resolveTheme(), "light", "SSR 下主题应回退为 light");

// 用假的 registry 验证注册逻辑本身不依赖真实 DOM。
const registered = [];
lib.defineMaoElements({
  get: () => undefined,
  define: (tag) => registered.push(tag),
});
assert.equal(registered.length, defined.length, "defineMaoElements 未注册全部元素");

console.log(`SSR smoke ok · ${defined.length} elements · ${ICON_NAMES.length} icons`);
