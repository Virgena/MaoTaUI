import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

const TONES = ["neutral", "accent", "danger", "sage", "blue", "solid"] as const;

export function BadgePage() {
  return (
    <>
      <h1>徽标</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>色调</h2>
      <Demo code={TONES.map((tone) => `<mao-badge tone="${tone}">${tone}</mao-badge>`).join("\n")}>
        {TONES.map((tone) => (
          <mao-badge key={tone} tone={tone}>
            {tone}
          </mao-badge>
        ))}
      </Demo>

      <h2>常见位置</h2>
      <Demo
        code={`<mao-header name="发布计划" description="本周四上线">
  <mao-badge slot="end" tone="sage">进行中</mao-badge>
</mao-header>

<mao-card bordered>
  <div class="mt-card-body">
    <div class="mt-card-header">支付网关 <mao-badge tone="danger">故障</mao-badge></div>
    最近 5 分钟错误率上升。
  </div>
</mao-card>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 420 }}>
          <mao-header name="发布计划" description="本周四上线">
            <mao-badge slot="end" tone="sage">
              进行中
            </mao-badge>
          </mao-header>
          <mao-card bordered>
            <div className="mt-card-body">
              <div className="mt-card-header">
                支付网关 <mao-badge tone="danger">故障</mao-badge>
              </div>
              最近 5 分钟错误率上升。
            </div>
          </mao-card>
        </div>
      </Demo>

      <ApiProps tag="mao-badge" />
    </>
  );
}
