import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { ICON_NAMES, ICON_PATHS } from "../../../src/core/icons.ts";

export function IconPage() {
  return (
    <>
      <h1>图标</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        全部 {ICON_NAMES.length} 个图标以内置 SVG 路径形式随包发布，绝不发起网络请求。
      </p>

      <h2>基础用法</h2>
      <Demo code={`<mao-icon name="check" />\n<mao-icon name="palette" size="24" />`}>
        <mao-icon name="check" />
        <mao-icon name="palette" size={24} />
      </Demo>

      <h2>尺寸</h2>
      <Demo code={`<mao-icon name="star" size="12" />\n<mao-icon name="star" size="16" />\n<mao-icon name="star" size="24" />`}>
        <mao-icon name="star" size={12} />
        <mao-icon name="star" size={16} />
        <mao-icon name="star" size={24} />
      </Demo>

      <h2>颜色与描边</h2>
      <Demo
        code={`<span style={{ color: "var(--mt-color-primary)" }}><mao-icon name="info" size="20" /></span>
<span style={{ color: "var(--mt-color-success)" }}><mao-icon name="check" size="20" /></span>
<span style={{ color: "var(--mt-color-warning)" }}><mao-icon name="triangle-alert" size="20" /></span>
<span style={{ color: "var(--mt-color-danger)" }}><mao-icon name="x" size="20" /></span>
<mao-icon name="heart" size="20" stroke-width="2" />`}
      >
        <span style={{ color: "var(--mt-color-primary)" }}>
          <mao-icon name="info" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-success)" }}>
          <mao-icon name="check" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-warning)" }}>
          <mao-icon name="triangle-alert" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-danger)" }}>
          <mao-icon name="x" size={20} />
        </span>
        <mao-icon name="heart" size={20} stroke-width={2} />
      </Demo>

      <h2>图标列表</h2>
      <div className="icon-grid">
        {ICON_NAMES.map((name) => (
          <div className="icon-cell" key={name} title={ICON_PATHS[name]}>
            <mao-icon name={name} size={20} />
            <span>{name}</span>
          </div>
        ))}
      </div>

      <ApiProps tag="mao-icon" />
    </>
  );
}
