import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoButton,
  MaoCard,
} from "../../../src/index.tsx";

const CARD_COLORS = ["primary", "success", "warning", "danger"] as const;

export function CardPage() {
  const [clicks, setClicks] = useState(0);
  return (
    <>
      <h1>卡片</h1>
      <pre className="demo-code">import {"{ MaoCard }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<MaoCard header="Card title">A simple container with a border and padding.</MaoCard>`}>
        <MaoCard header="Card title">A simple container with a border and padding.</MaoCard>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`<MaoCard color="primary" header="primary" />
<MaoCard color="success" header="success" />
<MaoCard color="warning" header="warning" />
<MaoCard color="danger" header="danger" />`}
      >
        <div className="demo-grid">
          {CARD_COLORS.map((color) => (
            <MaoCard key={color} color={color} header={color} />
          ))}
        </div>
      </Demo>

      <h2>变体</h2>
      <Demo
        code={`<MaoCard header="bordered">默认带边框</MaoCard>
<MaoCard bordered={false} header="bordered=false">无边框</MaoCard>
<MaoCard isTransparent header="is-transparent">透明</MaoCard>`}
      >
        <div className="demo-grid">
          <MaoCard header="bordered">默认带边框</MaoCard>
          <MaoCard bordered={false} header="bordered=false">
            无边框
          </MaoCard>
          <MaoCard isTransparent header="is-transparent">
            透明
          </MaoCard>
        </div>
      </Demo>

      <h2>内边距</h2>
      <Demo
        code={`<MaoCard padding="sm" header="sm">12px(紧凑)</MaoCard>
<MaoCard padding="md" header="md">20px</MaoCard>
<MaoCard padding="lg" header="lg(默认)">24px(舒适)</MaoCard>`}
      >
        <div className="demo-grid">
          <MaoCard padding="sm" header="sm">
            12px(紧凑)
          </MaoCard>
          <MaoCard padding="md" header="md">
            20px
          </MaoCard>
          <MaoCard padding="lg" header="lg(默认)">
            24px(舒适)
          </MaoCard>
        </div>
      </Demo>

      <h2>可悬停</h2>
      <Demo code={`<MaoCard isHoverable header="可悬停卡片">将鼠标移到卡片上查看高亮效果</MaoCard>`}>
        <div className="demo-grid" style={{ maxWidth: 360 }}>
          <MaoCard isHoverable header="可悬停卡片">
            将鼠标移到卡片上查看高亮效果
          </MaoCard>
        </div>
      </Demo>

      <h2>可点击与涟漪</h2>
      <Demo
        code={`<MaoCard clickable color="primary" header="可点击卡片" onClick={onClick}>
  点击查看涟漪效果，已点击 {clicks} 次。
</MaoCard>`}
      >
        <div className="demo-grid" style={{ maxWidth: 360 }}>
          <MaoCard clickable color="primary" header="可点击卡片" onClick={() => setClicks((n) => n + 1)}>
            点击查看涟漪效果，已点击 {clicks} 次。
          </MaoCard>
        </div>
      </Demo>

      <h2>链接</h2>
      <Demo
        code={`<MaoCard color="primary" href="#/button" header="链接卡片 →">
  点击整张卡片跳转到按钮文档。
</MaoCard>`}
      >
        <div className="demo-grid" style={{ maxWidth: 360 }}>
          <MaoCard color="primary" href="#/button" header="链接卡片 →">
            点击整张卡片跳转到按钮文档。
          </MaoCard>
        </div>
      </Demo>

      <h2>插槽</h2>
      <Demo
        code={`<MaoCard
  cover={<div className="demo-cover" />}
  header="卡片标题"
  footer={<>
    <MaoButton size="sm" variant="bordered">取消</MaoButton>
    <MaoButton size="sm" color="primary">确定</MaoButton>
  </>}
>
  header、cover、footer 与默认插槽可自由组合，构建结构化卡片。
</MaoCard>`}
      >
        <div className="demo-grid" style={{ maxWidth: 360 }}>
          <MaoCard
            cover={<div className="demo-cover" />}
            header="卡片标题"
            footer={
              <>
                <MaoButton size="sm" variant="bordered">
                  取消
                </MaoButton>
                <MaoButton size="sm" color="primary">
                  确定
                </MaoButton>
              </>
            }
          >
            header、cover、footer 与默认插槽可自由组合，构建结构化卡片。
          </MaoCard>
        </div>
      </Demo>
      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          [
            "color",
            `"neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger"`,
            `"neutral"`,
            "Hue of the border and the tinted surface; neutral keeps the plain surface",
          ],
          ["padding", `"sm" | "md" | "lg"`, `"lg"`, "Inner padding: 12 / 20 / 24px"],
          ["bordered", "boolean", "true", "1px outline, tinted with the card's own hue"],
          ["isTransparent", "boolean", "false", "Drops the surface background, keeps the outline"],
          ["isHoverable", "boolean", "false", "The outline and the surface move to the card's hue on hover"],
          ["clickable", "boolean", "false", "Renders a <button> and adds the press scale"],
          ["href", "string", "—", "Renders an <a> instead; the whole card is the hit area"],
          ["header", "ReactNode", "—", "Title row above the content"],
          ["cover", "ReactNode", "—", "Full-bleed block above the body (image, chart, ...)"],
          ["footer", "ReactNode", "—", "Action row under the content"],
          ["contentClass", "string", `""`, "Extra classes on the body, not on the shell"],
          ["className", "string", `""`, "Extra classes on the shell"],
        ]}
      />

      <h2>事件</h2>
      <Props
        head={["事件", "回调参数", "说明"]}
        rows={[
          ["onClick", "MouseEvent", "Fires in all three render modes (div / button / link)"],
          [
            "onFocus / onBlur",
            "FocusEvent",
            "Only reachable when clickable or href — a plain card is not focusable",
          ],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[
          ["default", "ReactNode", "The card body — everything passed as children"],
          ["header", "ReactNode", "Title row above the content"],
          ["footer", "ReactNode", "Action row under the content"],
          ["cover", "ReactNode", "Full-bleed block above the body (image, chart, ...)"],
        ]}
      />
    </>
  );
}

