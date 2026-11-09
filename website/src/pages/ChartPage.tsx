import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function ChartPage() {
  return (
    <>
      <h1>迷你图表</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">纯 CSS 柱状图：values 为逗号分隔的数值，高亮索引由 active 指定（默认最后一项）。</p>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-mini-chart values="38,57,44,84,62,72,49" label="活跃度" unit="次/日"></mao-mini-chart>`}
      >
        <div style={{ width: 260 }}>
          <mao-mini-chart values="38,57,44,84,62,72,49" label="活跃度" unit="次/日" />
        </div>
      </Demo>

      <h2>色调</h2>
      <Demo
        code={`<mao-mini-chart values="20,35,28,44,39,52,61" tone="sage"></mao-mini-chart>
<mao-mini-chart values="20,35,28,44,39,52,61" tone="blue"></mao-mini-chart>
<mao-mini-chart values="20,35,28,44,39,52,61" tone="accent"></mao-mini-chart>`}
      >
        <div className="demo-grid">
          <mao-mini-chart values="20,35,28,44,39,52,61" tone="sage" />
          <mao-mini-chart values="20,35,28,44,39,52,61" tone="blue" />
          <mao-mini-chart values="20,35,28,44,39,52,61" tone="accent" />
        </div>
      </Demo>

      <h2>高亮索引</h2>
      <Demo
        code={`<mao-mini-chart values="12,30,22,48,36,64,58" active="3" label="峰值" unit="次"></mao-mini-chart>`}
      >
        <div style={{ width: 260 }}>
          <mao-mini-chart values="12,30,22,48,36,64,58" active={3} label="峰值" unit="次" />
        </div>
      </Demo>

      <ApiProps tag="mao-mini-chart" />
    </>
  );
}
