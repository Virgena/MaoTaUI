import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

const THEME_OPTIONS = [
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "system", label: "跟随系统" },
];

export function FieldsPage() {
  const [log, setLog] = useState("尚未交互");
  const ref = useMaoEvents<HTMLDivElement>({
    "mt-input": (event) => setLog(`mt-input → ${String(event.detail.name ?? "")} = ${String(event.detail.value ?? "")}`),
    "mt-change": (event) => setLog(`mt-change → ${String(event.detail.value ?? "")}`),
  });

  return (
    <>
      <h1>输入框</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        text-field / text-area / select / checkbox 都是 formAssociated 元素，内部结构在 Shadow DOM，表单提交与原生一致。
      </p>

      <h2>组合表单</h2>
      <div ref={ref}>
        <Demo
          code={`<mao-text-field label="项目名称" placeholder="MaoTaUI" name="project"></mao-text-field>
<mao-text-area label="备注" rows="3" name="note"></mao-text-area>
<mao-select label="主题" name="theme" options='[{"value":"light","label":"浅色"}]'></mao-select>
<mao-checkbox name="agree" value="yes">我已阅读条款</mao-checkbox>`}
        >
          <div className="demo-form">
            <mao-text-field label="项目名称" placeholder="MaoTaUI" name="project" />
            <mao-text-area label="备注" rows={3} name="note" />
            <mao-select label="主题" name="theme" options={JSON.stringify(THEME_OPTIONS)} />
            <mao-checkbox name="agree" value="yes">
              我已阅读条款
            </mao-checkbox>
          </div>
        </Demo>
        <p className="demo-note">{log}</p>
      </div>

      <h2>单行输入</h2>
      <Demo
        code={`<mao-text-field label="邮箱" type="email" placeholder="you@example.com" hint="不会公开"></mao-text-field>
<mao-text-field label="必填" required invalid value="" hint="此字段必填"></mao-text-field>
<mao-text-field label="只读" value="MaoTaUI" readonly></mao-text-field>`}
      >
        <div className="demo-form">
          <mao-text-field label="邮箱" type="email" placeholder="you@example.com" hint="不会公开" />
          <mao-text-field label="必填（错误态）" required invalid hint="此字段必填" />
          <mao-text-field label="只读" value="MaoTaUI" readonly />
        </div>
      </Demo>
      <ApiProps tag="mao-text-field" />

      <h2>多行输入</h2>
      <Demo code={`<mao-text-area label="自我介绍" rows="4" placeholder="写点什么…"></mao-text-area>`}>
        <div className="demo-form">
          <mao-text-area label="自我介绍" rows={4} placeholder="写点什么…" />
        </div>
      </Demo>
      <ApiProps tag="mao-text-area" />

      <h2>下拉选择</h2>
      <Demo
        code={`<mao-select
  label="主题"
  placeholder="请选择"
  options='[{"value":"light","label":"浅色"},{"value":"dark","label":"深色"}]'
></mao-select>`}
      >
        <div className="demo-form">
          <mao-select label="主题" placeholder="请选择" options={JSON.stringify(THEME_OPTIONS)} />
          <mao-select label="禁用" disabled options={JSON.stringify(THEME_OPTIONS)} />
        </div>
      </Demo>
      <ApiProps tag="mao-select" />

      <h2>复选框</h2>
      <Demo
        code={`<mao-checkbox checked>已选中</mao-checkbox>
<mao-checkbox indeterminate>半选</mao-checkbox>
<mao-checkbox disabled>禁用</mao-checkbox>`}
      >
        <mao-checkbox checked>已选中</mao-checkbox>
        <mao-checkbox indeterminate>半选</mao-checkbox>
        <mao-checkbox disabled>禁用</mao-checkbox>
      </Demo>
      <ApiProps tag="mao-checkbox" />
    </>
  );
}
