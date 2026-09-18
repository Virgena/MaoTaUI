import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoDivider,
} from "../../../src/index.tsx";

const DIVIDER_COLORS = ["primary", "secondary", "info", "success", "warning", "danger"] as const;

export function DividerPage() {
  return (
    <>
      <h1>分割线</h1>
      <pre className="demo-code">import {"{ MaoDivider }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<div className="demo-stack">
  <span>第一部分内容</span>
  <MaoDivider />
  <span>第二部分内容</span>
</div>`}
      >
        <div className="demo-stack">
          <span>第一部分内容</span>
          <MaoDivider />
          <span>第二部分内容</span>
        </div>
      </Demo>

      <h2>带标签</h2>
      <Demo
        code={`<div className="demo-stack">
  <span>使用第三方账号登录</span>
  <MaoDivider>或</MaoDivider>
  <span>使用邮箱登录</span>
</div>`}
      >
        <div className="demo-stack">
          <span>使用第三方账号登录</span>
          <MaoDivider>或</MaoDivider>
          <span>使用邮箱登录</span>
        </div>
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<span>首页</span>
<MaoDivider orientation="vertical" />
<span>文档</span>
<MaoDivider orientation="vertical" />
<span>关于</span>`}
      >
        <span>首页</span>
        <MaoDivider orientation="vertical" />
        <span>文档</span>
        <MaoDivider orientation="vertical" />
        <span>关于</span>
      </Demo>

      <h2>虚线</h2>
      <Demo
        code={`<div className="demo-stack">
  <span>实线分割线</span>
  <MaoDivider />
  <span>虚线分割线</span>
  <MaoDivider borderStyle="dashed" />
</div>`}
      >
        <div className="demo-stack">
          <span>实线分割线</span>
          <MaoDivider />
          <span>虚线分割线</span>
          <MaoDivider borderStyle="dashed" />
        </div>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`<div className="demo-stack">
  {DIVIDER_COLORS.map((color) => <MaoDivider key={color} color={color} />)}
</div>`}
      >
        <div className="demo-stack">
          {DIVIDER_COLORS.map((color) => (
            <MaoDivider key={color} color={color} />
          ))}
        </div>
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["orientation", `"horizontal" | "vertical"`, `"horizontal"`, "Vertical takes one line height and shows no label"],
          ["borderStyle", `"solid" | "dashed"`, `"solid"`, "Dashed reads as a soft break rather than a new section"],
          [
            "color",
            `"default" | "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger"`,
            `"default"`,
            "default is the 1px border token; a hue uses --mt-fill-k",
          ],
          ["className", "string", `""`, `Extra classes on the line; role="separator" and aria-orientation are set for you`],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[
          ["children", "ReactNode", "Inline label; when present the rule splits around it"],
          ["—", "—", "With no label the two halves meet, so the line stays unbroken"],
        ]}
      />
    </>
  );
}

