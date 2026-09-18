import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  ICON,
  MaoIcon,
} from "../../../src/index.tsx";

export function IconPage() {
  const names = Object.keys(ICON) as Array<keyof typeof ICON>;
  return (
    <>
      <h1>图标</h1>
      <pre className="demo-code">import {"{ MaoIcon, ICON }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<MaoIcon name="check" />\n<MaoIcon name="palette" size={24} />`}>
        <MaoIcon name="check" />
        <MaoIcon name="palette" size={24} />
      </Demo>

      <h2>尺寸</h2>
      <Demo code={`<MaoIcon name="star" size={12} />\n<MaoIcon name="star" size={16} />\n<MaoIcon name="star" size={24} />`}>
        <MaoIcon name="star" size={12} />
        <MaoIcon name="star" size={16} />
        <MaoIcon name="star" size={24} />
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`<span style={{ color: "var(--mt-color-primary)" }}><MaoIcon name="info" size={20} /></span>
<span style={{ color: "var(--mt-color-success)" }}><MaoIcon name="check" size={20} /></span>
<span style={{ color: "var(--mt-color-warning)" }}><MaoIcon name="alert" size={20} /></span>
<span style={{ color: "var(--mt-color-danger)" }}><MaoIcon name="close" size={20} /></span>`}
      >
        <span style={{ color: "var(--mt-color-primary)" }}>
          <MaoIcon name="info" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-success)" }}>
          <MaoIcon name="check" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-warning)" }}>
          <MaoIcon name="alert" size={20} />
        </span>
        <span style={{ color: "var(--mt-color-danger)" }}>
          <MaoIcon name="close" size={20} />
        </span>
      </Demo>

      <h2>多个图标</h2>
      <div className="icon-grid">
        {names.map((name) => (
          <div className="icon-cell" key={name}>
            <MaoIcon name={name} size={20} />
            <span>{name}</span>
          </div>
        ))}
      </div>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["name", "keyof typeof ICON", "—", "Built-in icon name; an unknown name renders nothing instead of throwing"],
          ["size", "number", "16", "Pixel side length"],
          ["label", "string", "—", `Accessible name (role="img"); omitted means aria-hidden`],
        ]}
      />
    </>
  );
}

