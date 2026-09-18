import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoScrollShadow,
} from "../../../src/index.tsx";

const TAGS = Array.from({ length: 16 }, (_, i) => `标签 ${i + 1}`);
const ROWS = Array.from({ length: 10 }, (_, i) => `第 ${i + 1} 行内容`);
const SCORES = [
  ["9.2", "空想科学"],
  ["8.7", "月色真美"],
  ["9.5", "雨声"],
  ["8.1", "夏目"],
  ["7.9", "星之卡比"],
  ["9.0", "银河铁道"],
  ["9.8", "紫罗兰"],
  ["8.4", "凉宫"],
  ["8.8", "秒速五厘米"],
  ["9.1", "言叶之庭"],
  ["9.6", "你的名字"],
  ["8.5", "天气之子"],
] as const;

export function ScrollShadowPage() {
  return (
    <>
      <h1>滚动阴影</h1>
      <pre className="demo-code">import {"{ MaoScrollShadow }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoScrollShadow ariaLabel="标签">
  {tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
</MaoScrollShadow>`}
      >
        <div className="demo-stack">
          <MaoScrollShadow ariaLabel="标签">
            {TAGS.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </MaoScrollShadow>
        </div>
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<MaoScrollShadow axis="vertical" ariaLabel="行列表" style={{ height: 176 }}>
  {rows.map((row) => <div className="row-item" key={row}>{row}</div>)}
</MaoScrollShadow>`}
      >
        <div className="demo-stack">
          <MaoScrollShadow axis="vertical" ariaLabel="行列表" style={{ height: 176 }}>
            {ROWS.map((row) => (
              <div className="row-item" key={row}>
                {row}
              </div>
            ))}
          </MaoScrollShadow>
        </div>
      </Demo>

      <h2>鼠标滚轮 + 拖拽(横向)</h2>
      <Demo
        code={`<MaoScrollShadow wheel="contain" draggable scrollbar="thin" ariaLabel="评分">
  {scores.map(([score, name]) => (
    <div className="score" key={name}>
      <b>{score}</b>
      {name}
    </div>
  ))}
</MaoScrollShadow>`}
      >
        <div className="demo-stack">
          <MaoScrollShadow wheel="contain" draggable scrollbar="thin" ariaLabel="评分">
            {SCORES.map(([score, name]) => (
              <div className="score" key={name}>
                <b>{score}</b>
                {name}
              </div>
            ))}
          </MaoScrollShadow>
        </div>
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["axis", `"horizontal" | "vertical"`, `"horizontal"`, "Scroll direction; the edge shadows follow it"],
          ["shadowSize", "string", `"2rem"`, "How deep the edge fade reaches"],
          [
            "shadowColor",
            "string",
            `"var(--mt-bg)"`,
            "What the fade fades into — match the surface the strip sits on",
          ],
          [
            "scrollbar",
            `"auto" | "hide" | "thin"`,
            `"hide"`,
            "hide leaves the shadows as the only affordance; thin is a 6px theme-coloured bar; auto is the platform default",
          ],
          [
            "wheel",
            `boolean | "contain"`,
            "false",
            "Horizontal only: a vertical wheel scrolls the strip sideways. true hands the wheel back at either end so the page keeps scrolling; \"contain\" holds it while the strip can still move",
          ],
          [
            "draggable",
            "boolean",
            "false",
            "Horizontal only: click-and-drag to scroll. A drag past 4px swallows the click so cards inside stay clickable; touch keeps native scrolling",
          ],
          ["ariaLabel", "string", `"scrollable content"`, "Accessible name for the scrollable region"],
          ["contentClass", "string", `""`, "Extra classes on the strip, not on the wrapper"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[
          ["children", "ReactNode", "Strip content; the strip is one flex row (or column) and never wraps"],
          ["—", "—", "Give the region a real ariaLabel — the shadows are the only visual hint that it scrolls"],
        ]}
      />
    </>
  );
}

