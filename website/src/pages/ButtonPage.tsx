import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  MaoButton,
} from "../../../src/index.tsx";

export function ButtonPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <h1>按钮</h1>
      <pre className="demo-code">import {"{ MaoButton }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoButton color="primary">Primary</MaoButton>
<MaoButton color="secondary">Secondary</MaoButton>
<MaoButton color="danger">Danger</MaoButton>`}
      >
        <MaoButton color="primary">Primary</MaoButton>
        <MaoButton color="secondary">Secondary</MaoButton>
        <MaoButton color="danger">Danger</MaoButton>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`{BUTTON_COLORS.map((color) => (
  <MaoButton key={color} color={color}>
    {color}
  </MaoButton>
))}`}
      >
        {BUTTON_COLORS.map((color) => (
          <MaoButton key={color} color={color}>
            {color}
          </MaoButton>
        ))}
      </Demo>

      <h2>变体</h2>
      <Demo
        code={BUTTON_VARIANTS.map(
          (variant) => `<MaoButton color="primary" variant="${variant}">${variant}</MaoButton>`,
        ).join("\n")}
      >
        {BUTTON_VARIANTS.map((variant) => (
          <MaoButton key={variant} color="primary" variant={variant}>
            {variant}
          </MaoButton>
        ))}
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<MaoButton size="${size}">${size}</MaoButton>`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <MaoButton key={size} size={size}>
            {size}
          </MaoButton>
        ))}
      </Demo>

      <h2>状态与事件</h2>
      <Demo code={`<MaoButton color="primary" loading>Submit</MaoButton>`}>
        <MaoButton color="primary" loading>
          Submit
        </MaoButton>
      </Demo>
      <Demo code={`<MaoButton color="primary" disabled>Disabled</MaoButton>`}>
        <MaoButton color="primary" disabled>
          Disabled
        </MaoButton>
      </Demo>
      <Demo code={`<MaoButton color="success" onClick={() => setClicked(true)}>Click me</MaoButton>`}>
        <MaoButton color="success" onClick={() => setClicked(true)}>
          Click me
        </MaoButton>
        {clicked && <span className="demo-note">Clicked!</span>}
      </Demo>

      <h2>作为链接</h2>
      <Demo
        code={`<MaoButton href="#/button">Internal link</MaoButton>
<MaoButton href="https://example.com">External link</MaoButton>`}
      >
        <MaoButton href="#/button">Internal link</MaoButton>
        <MaoButton href="https://example.com">External link</MaoButton>
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          [
            "color",
            `"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral"`,
            `"neutral"`,
            "Hue. neutral is the inverted block — what MaoTa's own UI is painted with",
          ],
          [
            "variant",
            `"solid" | "bordered" | "light" | "flat" | "shadow"`,
            `"solid"`,
            "Material. shadow is the only variant carrying a shadow, tinted with its own hue",
          ],
          ["size", `"sm" | "md" | "lg"`, `"md"`, "Height and font step; sm is for toolbars and list rows"],
          ["loading", "boolean", "false", "Prepends a spinner and disables the button, so clicks don't fire"],
          [
            "href",
            "string",
            "—",
            `Renders an <a> instead; external URLs get target="_blank". loading / disabled don't apply on this path`,
          ],
          ["disabled", "boolean", "false", "Native disabled state: reduced opacity + not-allowed"],
        ]}
      />

      <h2>事件</h2>
      <Props
        head={["事件", "回调参数", "说明"]}
        rows={[
          ["onClick", "MouseEvent", "Fires on click; not fired while loading / disabled"],
          ["onFocus / onBlur", "FocusEvent", "Native focus events; reachable with Tab, focus ring shows in both themes"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[
          ["children", "ReactNode", "Button content. children is the only slot; there are no named slots"],
          ["—", "—", "The spinner shown while loading is added automatically"],
        ]}
      />
    </>
  );
}

