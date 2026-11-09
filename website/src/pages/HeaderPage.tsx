import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function HeaderPage() {
  return (
    <>
      <h1>标题</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<mao-header name="组件库"></mao-header>`}>
        <div className="demo-wide">
          <mao-header name="组件库" />
        </div>
      </Demo>

      <h2>层级</h2>
      <Demo
        code={`<mao-header name="一级标题" level="1"></mao-header>
<mao-header name="二级标题" level="2"></mao-header>
<mao-header name="三级标题" level="3"></mao-header>`}
      >
        <div className="demo-wide">
          <mao-header name="一级标题" level="1" />
          <mao-header name="二级标题" level="2" />
          <mao-header name="三级标题" level="3" />
        </div>
      </Demo>

      <h2>描述与操作区</h2>
      <Demo
        code={`<mao-header name="账号设置" description="管理你的个人资料、安全选项与通知偏好。">
  <mao-button slot="end" size="sm" variant="bordered">编辑</mao-button>
</mao-header>`}
      >
        <div className="demo-wide">
          <mao-header name="账号设置" description="管理你的个人资料、安全选项与通知偏好。">
            <mao-button slot="end" size="sm" variant="bordered">
              编辑
            </mao-button>
          </mao-header>
        </div>
      </Demo>

      <ApiProps tag="mao-header" />
    </>
  );
}
