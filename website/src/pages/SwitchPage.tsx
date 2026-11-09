import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function SwitchPage() {
  const [last, setLast] = useState("尚未交互");
  const ref = useMaoEvents<HTMLDivElement>({
    "mt-change": (event) => setLast(`checked = ${String(event.detail.checked)}`),
  });

  return (
    <>
      <h1>开关</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <div ref={ref}>
        <Demo
          code={`<mao-switch checked>自动保存</mao-switch>
<mao-switch>发送通知</mao-switch>`}
        >
          <mao-switch checked>自动保存</mao-switch>
          <mao-switch>发送通知</mao-switch>
        </Demo>
        <p className="demo-note">最近一次 mt-change: {last}</p>
      </div>

      <h2>尺寸</h2>
      <Demo code={`<mao-switch size="sm" checked>小号</mao-switch>\n<mao-switch size="md" checked>中号</mao-switch>`}>
        <mao-switch size="sm" checked>
          小号
        </mao-switch>
        <mao-switch size="md" checked>
          中号
        </mao-switch>
      </Demo>

      <h2>禁用</h2>
      <Demo code={`<mao-switch disabled>不可切换</mao-switch>\n<mao-switch disabled checked>已开启（禁用）</mao-switch>`}>
        <mao-switch disabled>不可切换</mao-switch>
        <mao-switch disabled checked>
          已开启（禁用）
        </mao-switch>
      </Demo>

      <h2>表单值</h2>
      <Demo code={`<mao-switch name="notify" value="on" checked>接收通知</mao-switch>`}>
        <mao-switch name="notify" value="on" checked>
          接收通知
        </mao-switch>
        <span className="demo-note">开启时提交 name=notify value=on</span>
      </Demo>

      <ApiProps tag="mao-switch" />
    </>
  );
}
