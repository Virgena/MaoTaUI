import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { LOGO } from "../logo.ts";

export function AvatarPage() {
  return (
    <>
      <h1>头像</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>首字头像</h2>
      <Demo
        code={`<mao-avatar label="林"></mao-avatar>
<mao-avatar label="陈" tone="sage"></mao-avatar>
<mao-avatar label="赵" tone="blue"></mao-avatar>
<mao-avatar label="M" tone="accent"></mao-avatar>`}
      >
        <mao-avatar label="林" />
        <mao-avatar label="陈" tone="sage" />
        <mao-avatar label="赵" tone="blue" />
        <mao-avatar label="M" tone="accent" />
      </Demo>

      <h2>尺寸</h2>
      <Demo
        code={`<mao-avatar label="小" size="sm"></mao-avatar>
<mao-avatar label="中" size="md"></mao-avatar>
<mao-avatar label="大" size="lg"></mao-avatar>`}
      >
        <mao-avatar label="小" size="sm" tone="sage" />
        <mao-avatar label="中" size="md" tone="sage" />
        <mao-avatar label="大" size="lg" tone="sage" />
      </Demo>

      <h2>图片头像</h2>
      <Demo
        code={`<mao-avatar src="/me.png" alt="林小满" size="lg"></mao-avatar>`}
      >
        <mao-avatar src={LOGO} alt="MaoTaUI" size="lg" />
        <mao-avatar src={LOGO} alt="MaoTaUI" />
        <mao-avatar src={LOGO} alt="MaoTaUI" size="sm" />
      </Demo>
      <p className="demo-note">图片通过 background-image 渲染，不注入额外节点；alt 会写入 aria-label。</p>

      <ApiProps tag="mao-avatar" />
    </>
  );
}
