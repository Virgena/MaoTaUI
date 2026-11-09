import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function DividerPage() {
  return (
    <>
      <h1>分割线</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<div class="demo-stack">
  <span>第一部分内容</span>
  <mao-divider></mao-divider>
  <span>第二部分内容</span>
</div>`}
      >
        <div className="demo-stack">
          <span>第一部分内容</span>
          <mao-divider />
          <span>第二部分内容</span>
        </div>
      </Demo>

      <h2>带标签</h2>
      <Demo
        code={`<div class="demo-stack">
  <span>使用第三方账号登录</span>
  <mao-divider>或</mao-divider>
  <span>使用邮箱登录</span>
</div>`}
      >
        <div className="demo-stack">
          <span>使用第三方账号登录</span>
          <mao-divider>或</mao-divider>
          <span>使用邮箱登录</span>
        </div>
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<span>首页</span>
<mao-divider orientation="vertical"></mao-divider>
<span>文档</span>
<mao-divider orientation="vertical"></mao-divider>
<span>关于</span>`}
      >
        <span>首页</span>
        <mao-divider orientation="vertical" />
        <span>文档</span>
        <mao-divider orientation="vertical" />
        <span>关于</span>
      </Demo>

      <h2>虚线与颜色</h2>
      <Demo
        code={`<mao-divider dashed></mao-divider>
<mao-divider color="var(--mt-color-primary)"></mao-divider>
<mao-divider color="var(--mt-color-danger)" dashed></mao-divider>`}
      >
        <div className="demo-stack">
          <mao-divider dashed />
          <mao-divider color="var(--mt-color-primary)" />
          <mao-divider color="var(--mt-color-danger)" dashed />
        </div>
      </Demo>

      <ApiProps tag="mao-divider" />
    </>
  );
}
