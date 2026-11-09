export function IntegrationPage() {
  return (
    <>
      <h1>接入</h1>
      <p className="demo-note">
        MaoTaUI 的组件是原生自定义元素：任意框架、任意构建工具都能用，服务端渲染只需要跳过元素注册。
      </p>

      <h2>安装</h2>
      <pre className="demo-code">{`pnpm add maotaui

# 只想要样式（纯 HTML 用法）
import "maotaui/styles.css"`}</pre>

      <h2>原生 HTML</h2>
      <pre className="demo-code">{`<link rel="stylesheet" href="/node_modules/maotaui/src/styles.css" />
<script type="module">
  import "maotaui";
</script>

<mao-button color="primary">保存</mao-button>`}</pre>

      <h2>React</h2>
      <pre className="demo-code">{`import { useEffect, useRef } from "react";
import "maotaui";

export function SaveButton() {
  return <mao-button color="primary">保存</mao-button>;
}

// React 19 不会把 mt-* 自动绑定成 onXxx，事件用 ref 监听
export function NameField() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onInput = (event: CustomEvent) => console.log(event.detail.value);
    node.addEventListener("mt-input", onInput);
    return () => node.removeEventListener("mt-input", onInput);
  }, []);
  return <mao-text-field ref={ref} label="项目名称"></mao-text-field>;
}`}</pre>

      <h2>Vue 3</h2>
      <pre className="demo-code">{`// vite.config.ts：告诉编译器这些是自定义元素
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("mao-") } } })],
});

// main.ts
import "maotaui";

<template>
  <mao-switch :checked="on" @mt-change="on = $event.detail.checked">自动保存</mao-switch>
</template>`}</pre>

      <h2>Svelte</h2>
      <pre className="demo-code">{`<script>
  import "maotaui";
  let on = $state(true);
</script>

<mao-switch checked={on} onmt-change={(event) => (on = event.detail.checked)}>
  自动保存
</mao-switch>`}</pre>

      <h2>Angular</h2>
      <pre className="demo-code">{`// app.module.ts
schemas: [CUSTOM_ELEMENTS_SCHEMA]

// main.ts
import "maotaui";

<mao-chip [attr.active]="picked ? true : null" (mt-toggle)="picked = $event.detail.active">设计</mao-chip>`}</pre>

      <h2>SSR</h2>
      <pre className="demo-code">{`// 服务端：不要调用 defineMaoElements()
import { renderToString } from "react-dom/server";
renderToString(<mao-button>保存</mao-button>);

// 客户端首帧后再注册，避免水合不一致
if (typeof customElements !== "undefined") {
  await import("maotaui");
}`}</pre>
      <p className="demo-note">
        src/index.ts 在导入时检测 customElements 是否存在：Node 环境不会注册任何元素，也不会触碰 window /
        document，因此可以直接参与构建与服务端渲染。
      </p>

      <h2>类型安全</h2>
      <pre className="demo-code">{`import { componentMeta, COMPONENT_REGISTRY } from "maotaui/registry";

componentMeta("mao-button")?.attributes; // 属性 / 事件 / 插槽的权威描述
COMPONENT_REGISTRY.map((item) => item.tag);`}</pre>
    </>
  );
}
