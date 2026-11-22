import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function DropdownPage() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("—");
  const ref = useMaoEvents<HTMLElement>({
    "mt-open": () => setOpen(true),
    "mt-close": () => setOpen(false),
  });
  const menuRef = useMaoEvents<HTMLElement>({
    "mt-change": (event) => setLast(String(event.detail.value ?? "")),
  });

  return (
    <>
      <h1>下拉菜单</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        触发元素放在 trigger 插槽，面板内容放在默认插槽；点击外部或按 Esc 关闭，点击菜单项后自动收起。
      </p>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-dropdown>
  <mao-button slot="trigger" variant="bordered" icon>
    <mao-icon name="ellipsis"></mao-icon>
  </mao-button>
  <mao-menu-item value="edit" icon="pencil">编辑</mao-menu-item>
  <mao-menu-item value="duplicate" icon="copy">复制</mao-menu-item>
  <mao-menu-item value="delete" icon="trash-2">删除</mao-menu-item>
</mao-dropdown>`}
      >
        <mao-dropdown ref={ref} open={open ? true : undefined}>
          <mao-button slot="trigger" variant="bordered" onClick={() => setOpen(!open)}>
            更多操作
          </mao-button>
          <mao-menu ref={menuRef}>
            <mao-menu-item value="edit" icon="pencil">
              编辑
            </mao-menu-item>
            <mao-menu-item value="duplicate" icon="copy">
              复制
            </mao-menu-item>
            <mao-menu-item value="delete" icon="trash-2">
              删除
            </mao-menu-item>
          </mao-menu>
        </mao-dropdown>
        <span className="demo-note">上次选择：{last}</span>
      </Demo>

      <h2>左对齐与向上展开</h2>
      <Demo
        code={`<mao-dropdown placement="bottom-start">...</mao-dropdown>
<mao-dropdown placement="top-end">...</mao-dropdown>`}
      >
        <mao-dropdown placement="bottom-start">
          <mao-button slot="trigger" variant="bordered">
            左下对齐
          </mao-button>
          <mao-menu>
            <mao-menu-item value="a">选项 A</mao-menu-item>
            <mao-menu-item value="b">选项 B</mao-menu-item>
          </mao-menu>
        </mao-dropdown>
        <mao-dropdown placement="top-end">
          <mao-button slot="trigger" variant="bordered">
            向上展开
          </mao-button>
          <mao-menu>
            <mao-menu-item value="a">选项 A</mao-menu-item>
            <mao-menu-item value="b">选项 B</mao-menu-item>
          </mao-menu>
        </mao-dropdown>
      </Demo>

      <ApiProps tag="mao-dropdown" />
    </>
  );
}
