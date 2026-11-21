import assert from "node:assert/strict";


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

const first = iconSvg("check");
assert.equal(first, iconSvg("check"), "iconSvg 必须是纯函数");
assert.ok(first.includes("<svg"), "iconSvg 应返回 SVG 字符串");
assert.ok(iconSvg("chevron-down").includes("<path"), "Lucide 图标应正常生成");
assert.ok(iconSvg("house").includes("<path"), "Lucide house 图标应正常生成");
assert.ok(iconSvg("home").includes("<path"), "Lucide home 别名应正常生成");
assert.ok(iconSvg("menu").includes("<path"), "Lucide menu 图标应正常生成");
assert.equal(iconSvg("not-an-icon"), "", "未知图标应返回空字符串");
assert.equal(ICON_NAMES.length, 2346, "内置图标应包含全部 Lucide 正式名称与别名");

const tags = COMPONENT_REGISTRY.map((item) => item.tag);
assert.equal(new Set(tags).size, tags.length, "registry 中存在重复标签");
for (const tag of tags) assert.ok(tag.startsWith("mao-"), `非法标签: ${tag}`);

const defined = Object.keys(ELEMENT_DEFINITIONS);
assert.deepEqual([...tags].sort(), [...defined].sort(), "registry 与 ELEMENT_DEFINITIONS 不一致");
assert.ok(componentMeta("mao-button"), "componentMeta 查询失败");

assert.equal(resolveTheme(), "light", "SSR 下主题应回退为 light");

const registered = [];
lib.defineMaoElements({
  get: () => undefined,
  define: (tag) => registered.push(tag),
});
assert.equal(registered.length, defined.length, "defineMaoElements 未注册全部元素");

console.log(`SSR smoke ok · ${defined.length} elements · ${ICON_NAMES.length} icons`);
