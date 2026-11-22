import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";
import { toast } from "../../../src/core/feedback.ts";

const RULES = {
  title: '[{"rule":"required","message":"请填写标题"},{"rule":"maxLength","value":40}]',
  email: '[{"rule":"required"},{"rule":"email"}]',
};

export function FormPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const ref = useMaoEvents<HTMLElement>({
    "mt-submit": (event) => {
      setValues((event.detail.values ?? {}) as Record<string, string>);
      toast({ tone: "success", content: "校验通过，已提交" });
    },
    "mt-invalid": () => toast({ tone: "danger", content: "请检查表单里的错误" }),
  });

  return (
    <>
      <h1>表单</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        mao-form 收集 [name] 字段，Enter 或 [type="submit"] 按钮触发校验；全部通过后派发
        mt-submit，否则派发 mt-invalid 并聚焦第一个错误项。
      </p>

      <h2>校验与提交</h2>
      <Demo
        code={`<mao-form ref={ref} label="发布设置">
  <mao-form-item name="title" label="标题" rules='[{"rule":"required"},{"rule":"maxLength","value":40}]'>
    <mao-text-field name="title" placeholder="请输入标题" maxlength="40" show-count></mao-text-field>
  </mao-form-item>
  <mao-form-item name="email" label="联系邮箱" rules='[{"rule":"required"},{"rule":"email"}]'>
    <mao-text-field name="email" type="email" icon="mail"></mao-text-field>
  </mao-form-item>
  <mao-form-item name="tags" label="标签" hint="可多选">
    <mao-checkbox-group name="tags">
      <mao-checkbox value="news">新闻</mao-checkbox>
      <mao-checkbox value="guide">指南</mao-checkbox>
    </mao-checkbox-group>
  </mao-form-item>
  <mao-button type="submit" color="primary">保存</mao-button>
</mao-form>`}
      >
        <div className="demo-form">
          <mao-form ref={ref} label="发布设置">
            <mao-form-item name="title" label="标题" rules={RULES.title}>
              <mao-text-field name="title" placeholder="请输入标题" maxlength="40" show-count></mao-text-field>
            </mao-form-item>
            <mao-form-item name="email" label="联系邮箱" rules={RULES.email}>
              <mao-text-field name="email" type="email" icon="mail" clearable></mao-text-field>
            </mao-form-item>
            <mao-form-item name="tags" label="标签" hint="可多选">
              <mao-checkbox-group name="tags">
                <mao-checkbox value="news">新闻</mao-checkbox>
                <mao-checkbox value="guide">指南</mao-checkbox>
              </mao-checkbox-group>
            </mao-form-item>
            <mao-button type="submit" color="primary">
              保存
            </mao-button>
          </mao-form>
          <p className="demo-note">最近一次提交：{JSON.stringify(values)}</p>
        </div>
      </Demo>

      <h2>命令式调用</h2>
      <Demo
        code={`const form = document.querySelector("mao-form");
form.getValues();
form.validate();
form.submit();
form.reset();`}
      >
        <div className="demo-col">
          <mao-form-item label="姓名" hint="mao-form-item 也可单独使用">
            <mao-text-field name="name" placeholder="请输入姓名"></mao-text-field>
          </mao-form-item>
        </div>
      </Demo>

      <ApiProps tag="mao-form" />
      <ApiProps tag="mao-form-item" />
      <ApiProps tag="mao-checkbox-group" />
    </>
  );
}
