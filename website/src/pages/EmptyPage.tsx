import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";

export function EmptyPage() {
  return (
    <>
      <h1>空状态</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        空数据占位；默认插槽里放入操作按钮时，底部操作区会自动出现。
      </p>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-empty icon="file-text" title="还没有内容" description="创建第一篇后就会出现在这里"></mao-empty>`}
      >
        <div className="demo-wide">
          <mao-empty icon="file-text" title="还没有内容" description="创建第一篇后就会出现在这里"></mao-empty>
        </div>
      </Demo>

      <h2>带操作</h2>
      <Demo
        code={`<mao-empty icon="inbox" title="收件箱是空的" description="新评论会推送到这里">
  <mao-button color="primary">刷新</mao-button>
</mao-empty>`}
      >
        <div className="demo-wide">
          <mao-empty icon="inbox" title="收件箱是空的" description="新评论会推送到这里">
            <mao-button color="primary">刷新</mao-button>
          </mao-empty>
        </div>
      </Demo>

      <ApiProps tag="mao-empty" />
    </>
  );
}
