import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function SegmentedPage() {
  const [view, setView] = useState("week");
  const ref = useMaoEvents<HTMLElement>({
    "mt-change": (event) => setView(String(event.detail.value ?? "")),
  });

  return (
    <>
      <h1>分段控制器</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`const [view, setView] = useState("week");

<mao-segmented value={view} label="时间范围" ref={ref}>
  <mao-segment value="day">日</mao-segment>
  <mao-segment value="week">周</mao-segment>
  <mao-segment value="month">月</mao-segment>
</mao-segmented>`}
      >
        <mao-segmented ref={ref} value={view} label="时间范围">
          <mao-segment value="day">日</mao-segment>
          <mao-segment value="week">周</mao-segment>
          <mao-segment value="month">月</mao-segment>
        </mao-segmented>
        <span className="demo-note">当前值：{view}</span>
      </Demo>

      <h2>禁用项</h2>
      <Demo
        code={`<mao-segmented value="grid" label="视图">
  <mao-segment value="list">列表</mao-segment>
  <mao-segment value="grid">网格</mao-segment>
  <mao-segment value="timeline" disabled>时间线</mao-segment>
</mao-segmented>`}
      >
        <mao-segmented value="grid" label="视图">
          <mao-segment value="list">列表</mao-segment>
          <mao-segment value="grid">网格</mao-segment>
          <mao-segment value="timeline" disabled>
            时间线
          </mao-segment>
        </mao-segmented>
      </Demo>

      <h2>键盘导航</h2>
      <p className="demo-note">Tab 聚焦后，用 ← → 或 Home / End 在选项间移动焦点即可切换。</p>

      <ApiProps tag="mao-segmented" />
      <ApiProps tag="mao-segment" />
    </>
  );
}
