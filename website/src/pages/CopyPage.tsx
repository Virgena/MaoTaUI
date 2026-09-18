import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  MaoButton,
  MaoCopy,
} from "../../../src/index.tsx";

export function CopyPage() {
  return (
    <>
      <h1>复制</h1>
      <pre className="demo-code">import {"{ MaoCopy }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<MaoCopy text="https://example.com/maota" name="Copy the URL" />`}>
        <MaoCopy text="https://example.com/maota" name="Copy the URL" />
      </Demo>

      <h2>自定义已复制文案</h2>
      <Demo code={`<MaoCopy text="maota@example.com" name="复制邮箱" copiedText="复制成功!" />`}>
        <MaoCopy text="maota@example.com" name="复制邮箱" copiedText="复制成功!" />
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`{BUTTON_COLORS.map((color) => (
  <MaoCopy key={color} text={color} name={color} color={color} />
))}`}
      >
        {BUTTON_COLORS.map((color) => (
          <MaoCopy key={color} text={color} name={color} color={color} />
        ))}
      </Demo>

      <h2>变体</h2>
      <Demo
        code={`{BUTTON_VARIANTS.map((variant) => (
  <MaoCopy key={variant} text={variant} name={variant} variant={variant} />
))}`}
      >
        {BUTTON_VARIANTS.map((variant) => (
          <MaoCopy key={variant} text={variant} name={variant} variant={variant} />
        ))}
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<MaoCopy text="${size}" name="${size}" size="${size}" />`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <MaoCopy key={size} text={size} name={size} size={size} />
        ))}
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["text *", "string", "—", "Text pushed to the clipboard"],
          ["name", "string", `""`, "Button label. Empty renders an icon-only button"],
          ["copiedText", "string", `"Copied"`, "Label shown briefly after a successful copy"],
          ["color", "ButtonColor", `"primary"`, "Same as MaoButton"],
          ["variant", "ButtonVariant", `"light"`, "Same as MaoButton"],
          ["size", "ButtonSize", `"md"`, "Same as MaoButton"],
          ["className", "string", `""`, "Extra classes on the button, alongside the copy-is-on state"],
        ]}
      />
    </>
  );
}

