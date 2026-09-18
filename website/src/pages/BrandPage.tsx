import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import { LOGO } from "../components/TopBar.tsx";
import {
  MaoBrand,
} from "../../../src/index.tsx";

export function BrandPage() {
  return (
    <>
      <h1>品牌</h1>
      <pre className="demo-code">import {"{ MaoBrand }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoBrand name="MaoTaUI" iconSrc={LOGO} to="/" />
<MaoBrand name="MaoTaUI" />`}
      >
        <div className="demo-col">
          <MaoBrand name="MaoTaUI" iconSrc={LOGO} />
          <MaoBrand name="MaoTaUI" />
        </div>
      </Demo>

      <h2>徽标</h2>
      <Demo
        code={`<MaoBrand name="MaoTaUI" iconSrc={LOGO} badge="Beta" badgeColor="accent" />
<MaoBrand name="MaoTa" iconSrc={LOGO} badge="Docs" badgeColor="neutral" />
<MaoBrand name="eggshell" iconSrc={LOGO} badge="New" badgeColor="danger" />`}
      >
        <div className="demo-col">
          <MaoBrand name="MaoTaUI" iconSrc={LOGO} badge="Beta" badgeColor="accent" />
          <MaoBrand name="MaoTa" iconSrc={LOGO} badge="Docs" badgeColor="neutral" />
          <MaoBrand name="eggshell" iconSrc={LOGO} badge="New" badgeColor="danger" />
        </div>
      </Demo>

      <h2>自定义样式</h2>
      <Demo
        code={`<MaoBrand
  name="MaoTaUI"
  iconSrc={LOGO}
  iconAlt="MaoTaUI 标志"
  iconClass="brand-lg"
  nameClass="brand-bold"
  to="/components/brand"
/>`}
      >
        <MaoBrand
          name="MaoTaUI"
          iconSrc={LOGO}
          iconAlt="MaoTaUI 标志"
          iconClass="brand-lg"
          nameClass="brand-bold"
        />
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["name *", "string", "—", "Brand name. Required"],
          ["iconSrc", "string", "—", "Logo URL. Omitted means name only — the library ships no brand assets"],
          ["iconAlt", "string", `""`, "Logo alt text. Empty keeps it decorative, since the name reads right next to it"],
          ["iconClass", "string", `""`, "Extra classes on the logo, for size and radius"],
          ["nameClass", "string", `""`, "Extra classes on the name"],
          ["badge", "ReactNode", "—", "Chip rendered after the name; reuses Badge"],
          ["badgeColor", `"neutral" | "accent" | "danger"`, `"accent"`, "Badge tone"],
          ["to", "string", `"/"`, "Where the whole block links to"],
          ["className", "string", `""`, "Extra classes on the anchor"],
        ]}
      />
    </>
  );
}

