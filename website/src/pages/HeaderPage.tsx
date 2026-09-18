import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoButton,
  MaoHeader,
} from "../../../src/index.tsx";

export function HeaderPage() {
  return (
    <>
      <h1>标题</h1>
      <pre className="demo-code">import {"{ MaoHeader }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<MaoHeader name="组件库" />`}>
        <div className="demo-wide">
          <MaoHeader name="组件库" />
        </div>
      </Demo>

      <h2>层级</h2>
      <Demo
        code={`<MaoHeader name="一级标题" scale="h1" />
<MaoHeader name="二级标题" scale="h2" />
<MaoHeader name="三级标题" scale="h3" />`}
      >
        <div className="demo-wide">
          <MaoHeader name="一级标题" scale="h1" />
          <MaoHeader name="二级标题" scale="h2" />
          <MaoHeader name="三级标题" scale="h3" />
        </div>
      </Demo>

      <h2>带描述</h2>
      <Demo
        code={`<MaoHeader
  name="账号设置"
  description="管理你的个人资料、安全选项与通知偏好。"
  scale="h2"
  end={<MaoButton size="sm" variant="bordered">编辑</MaoButton>}
/>`}
      >
        <div className="demo-wide">
          <MaoHeader
            name="账号设置"
            description="管理你的个人资料、安全选项与通知偏好。"
            scale="h2"
            end={
              <MaoButton size="sm" variant="bordered">
                编辑
              </MaoButton>
            }
          />
        </div>
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["name", "ReactNode", "—", "Title content"],
          ["description", "ReactNode", "—", "One line under the title"],
          ["scale", `"h1" | "h2" | "h3"`, `"h1"`, "Which heading tag to render; the font step follows it"],
          ["end", "ReactNode", "—", "Right-hand slot (buttons, links), aligned to the title baseline"],
          ["className", "string", `""`, "Extra classes on the wrapper"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[
          ["name", "ReactNode", "Title content"],
          ["description", "ReactNode", "Rendered as a <p> under the row"],
          ["end", "ReactNode", "Pushed to the far end of the title row"],
        ]}
      />
    </>
  );
}

