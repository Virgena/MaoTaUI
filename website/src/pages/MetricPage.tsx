import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function MetricPage() {
  return (
    <>
      <h1>指标</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<mao-metric label="本周完成" value="128" trend="+12%"></mao-metric>`}>
        <mao-metric label="本周完成" value="128" trend="+12%" />
      </Demo>

      <h2>趋势方向</h2>
      <Demo
        code={`<mao-metric label="活跃用户" value="2,480" trend="+8.2%"></mao-metric>
<mao-metric label="错误率" value="0.4%" trend="-1.1%" tone="danger"></mao-metric>`}
      >
        <mao-metric label="活跃用户" value="2,480" trend="+8.2%" />
        <mao-metric label="错误率" value="0.4%" trend="-1.1%" tone="danger" />
      </Demo>

      <h2>指标卡片</h2>
      <Demo
        code={`<mao-card bordered hoverable>
  <div class="mt-card-body">
    <mao-metric label="本月收入" value="¥ 42,180" trend="+6.4%"></mao-metric>
    <mao-mini-chart values="38,52,44,61,58,72,84" label="近 7 天" unit="千元"></mao-mini-chart>
  </div>
</mao-card>`}
      >
        <div className="demo-grid">
          <mao-card bordered hoverable>
            <div className="mt-card-body">
              <mao-metric label="本月收入" value="¥ 42,180" trend="+6.4%" />
              <mao-mini-chart values="38,52,44,61,58,72,84" label="近 7 天" unit="千元" />
            </div>
          </mao-card>
          <mao-card bordered hoverable>
            <div className="mt-card-body">
              <mao-metric label="平均响应" value="182ms" trend="-14ms" tone="danger" />
              <mao-mini-chart values="54,48,44,40,38,33,30" label="近 7 天" unit="ms" tone="blue" />
            </div>
          </mao-card>
        </div>
      </Demo>

      <ApiProps tag="mao-metric" />
    </>
  );
}
