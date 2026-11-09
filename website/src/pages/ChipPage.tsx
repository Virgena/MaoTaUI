import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

const TAGS = ["全部", "设计", "前端", "后端", "数据"];

export function ChipPage() {
  const [picked, setPicked] = useState<string[]>(["全部"]);
  const ref = useMaoEvents<HTMLDivElement>({
    "mt-toggle": (event) => {
      const value = String(event.detail.value ?? "");
      const active = Boolean(event.detail.active);
      if (!value) return;
      setPicked((now) => (active ? [...now, value] : now.filter((item) => item !== value)));
    },
  });

  return (
    <>
      <h1>标签</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo code={`<mao-chip value="all">全部</mao-chip>\n<mao-chip active value="design">设计</mao-chip>`}>
        <mao-chip value="all">全部</mao-chip>
        <mao-chip active value="design">
          设计
        </mao-chip>
        <mao-chip disabled value="soon">
          即将上线
        </mao-chip>
      </Demo>

      <h2>多选筛选</h2>
      <div ref={ref}>
        <Demo
          code={`const [picked, setPicked] = useState(["全部"]);

{tags.map((tag) => (
  <mao-chip
    key={tag}
    value={tag}
    active={picked.includes(tag) ? true : undefined}
  >{tag}</mao-chip>
))}`}
        >
          <div className="demo-col" style={{ gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TAGS.map((tag) => (
                <mao-chip key={tag} value={tag} active={picked.includes(tag) ? true : undefined}>
                  {tag}
                </mao-chip>
              ))}
            </div>
            <span className="demo-note">已选：{picked.length ? picked.join("、") : "无"}</span>
          </div>
        </Demo>
      </div>

      <ApiProps tag="mao-chip" />
    </>
  );
}
