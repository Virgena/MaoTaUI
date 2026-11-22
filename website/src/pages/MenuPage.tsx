import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function MenuPage() {
  const [value, setValue] = useState("dashboard");
  const ref = useMaoEvents<HTMLElement>({
    "mt-change": (event) => setValue(String(event.detail.value ?? "")),
  });

  return (
    <>
      <h1>菜单</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        mao-menu 与 mao-menu-item 使用 light DOM，样式由 .mt-menu / .mt-menu-item 承载，方便在
        侧边栏里自由排版；方向键可在菜单项间移动焦点。
      </p>

      <h2>侧边导航</h2>
      <Demo
        code={`<mao-menu value="dashboard" label="主导航">
  <mao-menu-item value="dashboard" icon="layout-dashboard">概览</mao-menu-item>
  <mao-menu-item value="posts" icon="file-text">内容</mao-menu-item>
  <mao-menu-item value="comments" icon="message-square" badge="12">评论</mao-menu-item>
  <mao-menu-item value="settings" icon="settings-2">设置</mao-menu-item>
</mao-menu>`}
      >
        <mao-menu ref={ref} value={value} label="主导航">
          <mao-menu-item value="dashboard" icon="layout-dashboard">
            概览
          </mao-menu-item>
          <mao-menu-item value="posts" icon="file-text">
            内容
          </mao-menu-item>
          <mao-menu-item value="comments" icon="message-square" badge="12">
            评论
          </mao-menu-item>
          <mao-menu-item value="settings" icon="settings-2">
            设置
          </mao-menu-item>
        </mao-menu>
      </Demo>

      <h2>横向菜单</h2>
      <Demo
        code={`<mao-menu orientation="horizontal" value="all" label="筛选">
  <mao-menu-item value="all">全部</mao-menu-item>
  <mao-menu-item value="published">已发布</mao-menu-item>
  <mao-menu-item value="draft">草稿</mao-menu-item>
</mao-menu>`}
      >
        <mao-menu orientation="horizontal" value="all" label="筛选">
          <mao-menu-item value="all">全部</mao-menu-item>
          <mao-menu-item value="published">已发布</mao-menu-item>
          <mao-menu-item value="draft">草稿</mao-menu-item>
        </mao-menu>
      </Demo>

      <ApiProps tag="mao-menu" />
      <ApiProps tag="mao-menu-item" />
    </>
  );
}
