import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { BUTTON_COLORS, BUTTON_SIZES, BUTTON_VARIANTS } from "./shared.ts";

export function ButtonPage() {
  const [clicks, setClicks] = useState(0);
  return (
    <>
      <h1>按钮</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-button color="primary">Primary</mao-button>
<mao-button color="secondary">Secondary</mao-button>
<mao-button color="danger">Danger</mao-button>`}
      >
        <mao-button color="primary">Primary</mao-button>
        <mao-button color="secondary">Secondary</mao-button>
        <mao-button color="danger">Danger</mao-button>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={BUTTON_COLORS.map((color) => `<mao-button color="${color}">${color}</mao-button>`).join("\n")}
      >
        {BUTTON_COLORS.map((color) => (
          <mao-button key={color} color={color}>
            {color}
          </mao-button>
        ))}
      </Demo>

      <h2>变体</h2>
      <Demo
        code={BUTTON_VARIANTS.map(
          (variant) => `<mao-button color="primary" variant="${variant}">${variant}</mao-button>`,
        ).join("\n")}
      >
        {BUTTON_VARIANTS.map((variant) => (
          <mao-button key={variant} color="primary" variant={variant}>
            {variant}
          </mao-button>
        ))}
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<mao-button size="${size}">${size}</mao-button>`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <mao-button key={size} size={size}>
            {size}
          </mao-button>
        ))}
      </Demo>

      <h2>状态与事件</h2>
      <Demo code={`<mao-button color="primary" loading>处理中</mao-button>`}>
        <mao-button color="primary" loading>
          处理中
        </mao-button>
        <span className="demo-note">loading 时拦截点击</span>
      </Demo>
      <Demo code={`<mao-button color="primary" disabled>不可点</mao-button>`}>
        <mao-button color="primary" disabled>
          不可点
        </mao-button>
      </Demo>
      <Demo code={`<mao-button color="success" onClick={...}>点我</mao-button>`}>
        <mao-button color="success" onClick={() => setClicks((now) => now + 1)}>
          点我
        </mao-button>
        <span className="demo-note">已点击 {clicks} 次</span>
      </Demo>

      <h2>作为链接</h2>
      <Demo
        code={`<mao-button href="#/button">站内跳转</mao-button>
<mao-button variant="bordered" href="https://example.com">外部链接</mao-button>`}
      >
        <mao-button href="#/link">站内跳转</mao-button>
        <mao-button variant="bordered" href="#/button">
          回到本页
        </mao-button>
      </Demo>

      <h2>整行与图标</h2>
      <Demo
        code={`<mao-button block color="primary">整行按钮</mao-button>
<mao-button icon aria-label="搜索"><mao-icon name="search" /></mao-button>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 360 }}>
          <mao-button block color="primary">
            整行按钮
          </mao-button>
        </div>
        <mao-button icon aria-label="搜索">
          <mao-icon name="search" />
        </mao-button>
        <mao-button icon aria-label="更多">
          <mao-icon name="more" />
        </mao-button>
      </Demo>

      <ApiProps tag="mao-button" />
    </>
  );
}
