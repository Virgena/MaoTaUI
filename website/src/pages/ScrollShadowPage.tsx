import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

const TAGS = [
  "全部组件",
  "原生自定义元素",
  "SSR 安全",
  "零外部依赖",
  "40 个内置图标",
  "暗色模式",
  "设计令牌",
  "TypeScript",
  "无障碍",
  "水合零报错",
];

const ROWS = Array.from({ length: 8 }, (_, index) => `第 ${index + 1} 行：滚动时上下边缘会出现柔和阴影`);

export function ScrollShadowPage() {
  return (
    <>
      <h1>滚动阴影</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        内容溢出时自动在可滚动一侧显示渐隐阴影，不侵占布局空间；横向滚动可用滚轮与拖拽。
      </p>

      <h2>横向</h2>
      <Demo
        code={`<mao-scroll-shadow scrollbar="none" wheel draggable style={{ width: 360 }}>
  ${TAGS.slice(0, 4).map((tag) => `<span class="chip">${tag}</span>`).join("\n  ")}
</mao-scroll-shadow>`}
      >
        <div style={{ width: 360, maxWidth: "100%" }}>
          <mao-scroll-shadow scrollbar="none" wheel draggable>
            {TAGS.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </mao-scroll-shadow>
        </div>
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<mao-scroll-shadow axis="vertical" style={{ height: 180 }}>
  <span class="row-item">第 1 行</span>
  ...
</mao-scroll-shadow>`}
      >
        <div style={{ width: 340, maxWidth: "100%" }}>
          <mao-scroll-shadow axis="vertical" style={{ height: 180 }}>
            {ROWS.map((row) => (
              <span className="row-item" key={row}>
                {row}
              </span>
            ))}
          </mao-scroll-shadow>
        </div>
      </Demo>

      <h2>滚动条样式</h2>
      <Demo
        code={`<mao-scroll-shadow scrollbar="thin" style={{ width: 300 }}>
  ...
</mao-scroll-shadow>`}
      >
        <div style={{ width: 300, maxWidth: "100%" }}>
          <mao-scroll-shadow scrollbar="thin">
            {TAGS.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </mao-scroll-shadow>
        </div>
      </Demo>

      <ApiProps tag="mao-scroll-shadow" />
    </>
  );
}
