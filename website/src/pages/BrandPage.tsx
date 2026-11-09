import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { LOGO } from "../logo.ts";

export function BrandPage() {
  return (
    <>
      <h1>品牌</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<mao-brand name="MaoTaUI" icon-src="/logo.svg" icon-alt="MaoTaUI"></mao-brand>`}>
        <mao-brand name="MaoTaUI" icon-src={LOGO} icon-alt="MaoTaUI" />
      </Demo>

      <h2>作为链接</h2>
      <Demo
        code={`<mao-brand name="MaoTaUI" href="#/brand" icon-src="/logo.svg" icon-alt="MaoTaUI"></mao-brand>`}
      >
        <mao-brand name="MaoTaUI" href="#/brand" icon-src={LOGO} icon-alt="MaoTaUI" />
        <span className="demo-note">点击返回本页</span>
      </Demo>

      <h2>纯文字</h2>
      <Demo code={`<mao-brand name="MaoTaUI"></mao-brand>`}>
        <mao-brand name="MaoTaUI" />
      </Demo>

      <h2>顶栏组合</h2>
      <Demo
        code={`<div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
  <mao-brand name="MaoTaUI" icon-src="/logo.svg" icon-alt="MaoTaUI"></mao-brand>
  <mao-badge tone="sage">v0.3</mao-badge>
  <mao-icon name="chevron-right" size="14"></mao-icon>
  <mao-link href="#/colors" size="sm">组件文档</mao-link>
</div>`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
          <mao-brand name="MaoTaUI" icon-src={LOGO} icon-alt="MaoTaUI" />
          <mao-badge tone="sage">v0.3</mao-badge>
          <mao-icon name="chevron-right" size={14} />
          <mao-link href="#/colors" size="sm">
            组件文档
          </mao-link>
        </div>
      </Demo>

      <ApiProps tag="mao-brand" />
    </>
  );
}
