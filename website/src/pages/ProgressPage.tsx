import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function ProgressPage() {
  const [value, setValue] = useState(68);

  return (
    <>
      <h1>进度条</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<mao-progress value="68" label="同步进度" show-value></mao-progress>`}>
        <div className="demo-col" style={{ width: "100%", maxWidth: 420 }}>
          <mao-progress value={68} label="同步进度" show-value />
        </div>
      </Demo>

      <h2>可交互</h2>
      <Demo
        code={`const [value, setValue] = useState(68);

<mao-progress value={value} label="上传进度" show-value></mao-progress>
<mao-button size="sm" variant="bordered" onClick={() => setValue(value - 10)}>-10</mao-button>
<mao-button size="sm" variant="bordered" onClick={() => setValue(value + 10)}>+10</mao-button>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 420 }}>
          <mao-progress value={value} label="上传进度" show-value />
          <div style={{ display: "flex", gap: 8 }}>
            <mao-button size="sm" variant="bordered" onClick={() => setValue((now) => Math.max(0, now - 10))}>
              -10
            </mao-button>
            <mao-button size="sm" variant="bordered" onClick={() => setValue((now) => Math.min(100, now + 10))}>
              +10
            </mao-button>
          </div>
        </div>
      </Demo>

      <h2>色调</h2>
      <Demo
        code={`<mao-progress value="32" tone="accent" show-value></mao-progress>
<mao-progress value="64" tone="sage" show-value></mao-progress>
<mao-progress value="88" tone="blue" show-value></mao-progress>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 420 }}>
          <mao-progress value={32} tone="accent" show-value />
          <mao-progress value={64} tone="sage" show-value />
          <mao-progress value={88} tone="blue" show-value />
        </div>
      </Demo>

      <h2>自定义上限</h2>
      <Demo code={`<mao-progress value="7" max="12" label="第 7 / 12 步" show-value></mao-progress>`}>
        <div className="demo-col" style={{ width: "100%", maxWidth: 420 }}>
          <mao-progress value={7} max={12} label="第 7 / 12 步" show-value />
        </div>
      </Demo>

      <ApiProps tag="mao-progress" />
    </>
  );
}
