import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function NoticePage() {
  return (
    <>
      <h1>通知</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-notice title="有可用更新">重启后即可使用 v0.3 的新组件。</mao-notice>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 520 }}>
          <mao-notice title="有可用更新">重启后即可使用 v0.3 的新组件。</mao-notice>
        </div>
      </Demo>

      <h2>色调</h2>
      <Demo
        code={`<mao-notice tone="info" title="提示">图标与标题由组件内部渲染，正文走默认插槽。</mao-notice>
<mao-notice tone="sage" title="更改已保存">你的内容已经安全保存。</mao-notice>
<mao-notice tone="blue" title="同步中">正在与远端仓库同步。</mao-notice>
<mao-notice tone="accent" title="新特性">试试内置的 40 个图标。</mao-notice>
<mao-notice tone="danger" title="删除失败">请检查权限后重试。</mao-notice>`}
      >
        <div className="demo-col" style={{ width: "100%", maxWidth: 520 }}>
          <mao-notice tone="info" title="提示">
            图标与标题由组件内部渲染，正文走默认插槽。
          </mao-notice>
          <mao-notice tone="sage" title="更改已保存">
            你的内容已经安全保存。
          </mao-notice>
          <mao-notice tone="blue" title="同步中">
            正在与远端仓库同步。
          </mao-notice>
          <mao-notice tone="accent" title="新特性">
            试试内置的 40 个图标。
          </mao-notice>
          <mao-notice tone="danger" title="删除失败">
            请检查权限后重试。
          </mao-notice>
        </div>
      </Demo>

      <ApiProps tag="mao-notice" />
    </>
  );
}
