import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function DrawerPage() {
  const [end, setEnd] = useState(false);
  const [start, setStart] = useState(false);
  const endRef = useMaoEvents<HTMLElement>({ "mt-close": () => setEnd(false) });
  const startRef = useMaoEvents<HTMLElement>({ "mt-close": () => setStart(false) });

  return (
    <>
      <h1>抽屉</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        从侧边滑出的面板，基于原生 dialog，自带焦点陷阱；closable 控制关闭按钮、Esc 与遮罩关闭。
      </p>

      <h2>右侧抽屉</h2>
      <Demo
        code={`const [open, setOpen] = useState(false);

<mao-button color="primary" onClick={() => setOpen(true)}>打开抽屉</mao-button>

<mao-drawer ref={ref} open={open ? true : undefined} heading="编辑资料" closable>
  <mao-text-field name="name" label="昵称" value="Yxla"></mao-text-field>
  <mao-button slot="actions" color="primary" onClick={() => setOpen(false)}>保存</mao-button>
</mao-drawer>`}
      >
        <mao-button color="primary" onClick={() => setEnd(true)}>
          打开抽屉
        </mao-button>
        <mao-drawer ref={endRef} open={end ? true : undefined} heading="编辑资料" closable>
          <div className="demo-form">
            <mao-text-field name="name" label="昵称" value="Yxla"></mao-text-field>
            <mao-text-area name="bio" label="简介" rows="4"></mao-text-area>
          </div>
          <mao-button slot="actions" variant="bordered" onClick={() => setEnd(false)}>
            取消
          </mao-button>
          <mao-button slot="actions" color="primary" onClick={() => setEnd(false)}>
            保存
          </mao-button>
        </mao-drawer>
      </Demo>

      <h2>左侧与宽度</h2>
      <Demo
        code={`<mao-drawer open placement="start" size="sm" heading="筛选" closable>...</mao-drawer>`}
      >
        <mao-button variant="bordered" onClick={() => setStart(true)}>
          左侧抽屉
        </mao-button>
        <mao-drawer ref={startRef} open={start ? true : undefined} placement="start" size="sm" heading="筛选" closable>
          <p>抽屉宽度随 size 在 320 / 420 / 560px 之间切换。</p>
          <mao-button slot="actions" color="primary" onClick={() => setStart(false)}>
            应用
          </mao-button>
        </mao-drawer>
      </Demo>

      <ApiProps tag="mao-drawer" />
    </>
  );
}
