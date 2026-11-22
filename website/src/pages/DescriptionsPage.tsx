import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";

export function DescriptionsPage() {
  return (
    <>
      <h1>描述列表</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        多列键值信息；columns 控制列数（1–4），单条可用 span 跨列。
      </p>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-descriptions columns="3">
  <mao-descriptions-item label="状态">已发布</mao-descriptions-item>
  <mao-descriptions-item label="作者">Yxla</mao-descriptions-item>
  <mao-descriptions-item label="发布时间">2024-05-01</mao-descriptions-item>
</mao-descriptions>`}
      >
        <div className="demo-wide">
          <mao-descriptions columns="3">
            <mao-descriptions-item label="状态">已发布</mao-descriptions-item>
            <mao-descriptions-item label="作者">Yxla</mao-descriptions-item>
            <mao-descriptions-item label="发布时间">2024-05-01</mao-descriptions-item>
          </mao-descriptions>
        </div>
      </Demo>

      <h2>带分隔线与跨列</h2>
      <Demo
        code={`<mao-descriptions columns="2" bordered>
  <mao-descriptions-item label="标题">MaoTaUI 0.3.0</mao-descriptions-item>
  <mao-descriptions-item label="版本">0.3.0</mao-descriptions-item>
  <mao-descriptions-item label="摘要" span="2">
    新增导航、表单与反馈类元素。
  </mao-descriptions-item>
</mao-descriptions>`}
      >
        <div className="demo-wide">
          <mao-descriptions columns="2" bordered>
            <mao-descriptions-item label="标题">MaoTaUI 0.3.0</mao-descriptions-item>
            <mao-descriptions-item label="版本">0.3.0</mao-descriptions-item>
            <mao-descriptions-item label="摘要" span="2">
              新增导航、表单与反馈类元素。
            </mao-descriptions-item>
          </mao-descriptions>
        </div>
      </Demo>

      <ApiProps tag="mao-descriptions" />
      <ApiProps tag="mao-descriptions-item" />
    </>
  );
}
