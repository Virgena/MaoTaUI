import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { confirm, toast } from "../../../src/core/feedback.ts";

export function FeedbackPage() {
  const remove = async () => {
    const ok = await confirm({
      heading: "删除这条记录？",
      content: "删除后无法恢复。",
      okText: "删除",
      danger: true,
    });
    toast(ok ? "已删除" : "已取消");
  };

  return (
    <>
      <h1>反馈</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        toast() 与 confirm() 是命令式 API：首次调用时自动注册元素，并把宿主挂到 body。mao-spinner
        与 mao-skeleton 负责加载态，mao-tooltip 负责悬浮提示。
      </p>

      <h2>轻提示</h2>
      <Demo
        code={`import { toast } from "maotaui";

toast("已复制链接");
toast({ tone: "success", content: "更改已保存" });
toast({ tone: "danger", heading: "保存失败", content: "请稍后重试" });`}
      >
        <mao-button variant="bordered" onClick={() => toast("已复制链接")}>
          信息
        </mao-button>
        <mao-button variant="bordered" onClick={() => toast({ tone: "success", content: "更改已保存" })}>
          成功
        </mao-button>
        <mao-button
          variant="bordered"
          onClick={() =>
            toast({ tone: "danger", heading: "保存失败", content: "请稍后重试", closable: true })
          }
        >
          可关闭
        </mao-button>
      </Demo>

      <h2>确认框</h2>
      <Demo
        code={`import { confirm } from "maotaui";

const ok = await confirm({
  heading: "删除这条记录？",
  content: "删除后无法恢复。",
  okText: "删除",
  danger: true,
});`}
      >
        <mao-button color="danger" variant="bordered" onClick={remove}>
          删除记录
        </mao-button>
      </Demo>

      <h2>加载指示</h2>
      <Demo
        code={`<mao-spinner></mao-spinner>
<mao-spinner size="lg" label="正在加载数据"></mao-spinner>`}
      >
        <mao-spinner></mao-spinner>
        <mao-spinner size="lg" label="正在加载数据"></mao-spinner>
      </Demo>

      <h2>骨架屏</h2>
      <Demo code={`<mao-skeleton lines="3" avatar animated></mao-skeleton>`}>
        <div className="demo-wide">
          <mao-skeleton lines="3" avatar animated></mao-skeleton>
        </div>
      </Demo>

      <h2>悬浮提示</h2>
      <Demo
        code={`<mao-tooltip content="复制链接">
  <mao-button variant="bordered">悬浮查看</mao-button>
</mao-tooltip>`}
      >
        <mao-tooltip content="复制链接">
          <mao-button variant="bordered">悬浮查看</mao-button>
        </mao-tooltip>
      </Demo>

      <ApiProps tag="mao-toast" />
      <ApiProps tag="mao-spinner" />
      <ApiProps tag="mao-skeleton" />
      <ApiProps tag="mao-tooltip" />
    </>
  );
}
