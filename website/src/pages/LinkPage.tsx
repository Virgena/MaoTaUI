import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { BUTTON_COLORS, BUTTON_SIZES } from "./shared.ts";

export function LinkPage() {
  return (
    <>
      <h1>链接</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-link href="#/link">内部链接</mao-link>
<mao-link href="#/link" underline="hover">悬停显示下划线</mao-link>
<mao-link href="#/link" underline="none">无下划线</mao-link>`}
      >
        <mao-link href="#/link">内部链接</mao-link>
        <mao-link href="#/link" underline="hover">
          悬停显示下划线
        </mao-link>
        <mao-link href="#/link" underline="none">
          无下划线
        </mao-link>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={BUTTON_COLORS.map((color) => `<mao-link href="#/link" color="${color}">${color}</mao-link>`).join(
          "\n",
        )}
      >
        {BUTTON_COLORS.map((color) => (
          <mao-link key={color} href="#/link" color={color}>
            {color}
          </mao-link>
        ))}
      </Demo>

      <h2>外链标记</h2>
      <Demo
        code={`<mao-link href="https://example.com" external>新窗口打开</mao-link>
<mao-link href="https://example.com" external={false}>不带箭头</mao-link>`}
      >
        <mao-link href="#/link" external>
          带外链箭头
        </mao-link>
        <mao-link href="#/link">不带箭头</mao-link>
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<mao-link size="${size}" href="#/link">${size}</mao-link>`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <mao-link key={size} size={size} href="#/link">
            {size}
          </mao-link>
        ))}
      </Demo>

      <ApiProps tag="mao-link" />
    </>
  );
}
