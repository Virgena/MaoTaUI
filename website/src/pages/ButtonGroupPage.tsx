import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { BUTTON_SIZES } from "./shared.ts";

export function ButtonGroupPage() {
  return (
    <>
      <h1>按钮组</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-button-group aria-label="对齐">
  <mao-button variant="bordered">左</mao-button>
  <mao-button variant="bordered">中</mao-button>
  <mao-button variant="bordered">右</mao-button>
</mao-button-group>`}
      >
        <mao-button-group aria-label="对齐">
          <mao-button variant="bordered">左</mao-button>
          <mao-button variant="bordered">中</mao-button>
          <mao-button variant="bordered">右</mao-button>
        </mao-button-group>
      </Demo>

      <h2>尺寸</h2>
      <Demo
        code={BUTTON_SIZES.map(
          (size) => `<mao-button-group>
  <mao-button size="${size}" variant="bordered">列表</mao-button>
  <mao-button size="${size}" variant="bordered">网格</mao-button>
</mao-button-group>`,
        ).join("\n")}
      >
        {BUTTON_SIZES.map((size) => (
          <mao-button-group key={size} aria-label={`视图 ${size}`}>
            <mao-button size={size} variant="bordered">
              列表
            </mao-button>
            <mao-button size={size} variant="bordered">
              网格
            </mao-button>
          </mao-button-group>
        ))}
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<mao-button-group orientation="vertical" aria-label="图片工具">
  <mao-button variant="bordered"><mao-icon name="search" />放大</mao-button>
  <mao-button variant="bordered"><mao-icon name="minus" />缩小</mao-button>
  <mao-button variant="bordered"><mao-icon name="refresh-cw" />旋转</mao-button>
</mao-button-group>`}
      >
        <mao-button-group orientation="vertical" aria-label="图片工具">
          <mao-button variant="bordered">
            <mao-icon name="search" />
            放大
          </mao-button>
          <mao-button variant="bordered">
            <mao-icon name="minus" />
            缩小
          </mao-button>
          <mao-button variant="bordered">
            <mao-icon name="refresh-cw" />
            旋转
          </mao-button>
        </mao-button-group>
      </Demo>

      <ApiProps tag="mao-button-group" />
    </>
  );
}
