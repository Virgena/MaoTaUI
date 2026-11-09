import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function DialogPage() {
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const ref = useMaoEvents<HTMLElement>({
    "mt-close": () => setOpen(false),
  });
  const wideRef = useMaoEvents<HTMLElement>({
    "mt-close": () => setWide(false),
  });

  return (
    <>
      <h1>对话框</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        基于原生 &lt;dialog&gt;，自带焦点陷阱与 Esc 关闭；打开 / 关闭会派发 mt-open / mt-close。
      </p>

      <h2>基础用法</h2>
      <Demo
        code={`const [open, setOpen] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const node = ref.current;
  if (!node) return;
  const onClose = () => setOpen(false);
  node.addEventListener("mt-close", onClose);
  return () => node.removeEventListener("mt-close", onClose);
}, []);

<mao-button color="primary" onClick={() => setOpen(true)}>打开对话框</mao-button>

<mao-dialog
  ref={ref}
  open={open ? true : undefined}
  heading="确认删除"
  closable
>
  <p>删除后无法恢复，确定继续吗？</p>
  <mao-button slot="actions" variant="bordered" onClick={() => setOpen(false)}>取消</mao-button>
  <mao-button slot="actions" color="danger" onClick={() => setOpen(false)}>删除</mao-button>
</mao-dialog>`}
      >
        <mao-button color="primary" onClick={() => setOpen(true)}>
          打开对话框
        </mao-button>
        <mao-dialog ref={ref} open={open ? true : undefined} heading="确认删除" closable>
          <p>删除后无法恢复，确定继续吗？</p>
          <mao-button slot="actions" variant="bordered" onClick={() => setOpen(false)}>
            取消
          </mao-button>
          <mao-button slot="actions" color="danger" onClick={() => setOpen(false)}>
            删除
          </mao-button>
        </mao-dialog>
      </Demo>

      <h2>尺寸与长内容</h2>
      <Demo
        code={`<mao-dialog open heading="服务条款" size="lg" closable>
  <p>长内容会自动换行，对话框宽度随 size 变化。</p>
</mao-dialog>`}
      >
        <mao-button variant="bordered" onClick={() => setWide(true)}>
          打开大号对话框
        </mao-button>
        <mao-dialog ref={wideRef} open={wide ? true : undefined} heading="服务条款" size="lg" closable>
          <p>
            MaoTaUI 的组件全部是原生自定义元素，样式与逻辑都不依赖框架。你可以只引入 styles.css 做纯 CSS
            用法，也可以在任意框架里挂载 mao-* 标签。
          </p>
          <p>对话框会把键盘焦点留在内部，Esc 或点击遮罩即可关闭。</p>
          <mao-button slot="actions" color="primary" onClick={() => setWide(false)}>
            我知道了
          </mao-button>
        </mao-dialog>
      </Demo>

      <ApiProps tag="mao-dialog" />
    </>
  );
}
