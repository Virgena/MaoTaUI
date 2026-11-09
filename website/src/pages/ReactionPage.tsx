import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function ReactionPage() {
  const [last, setLast] = useState("尚未交互");
  const ref = useMaoEvents<HTMLDivElement>({
    "mt-change": (event) => setLast(`active = ${String(event.detail.checked)}`),
  });

  return (
    <>
      <h1>点赞</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <div ref={ref}>
        <Demo
          code={`<mao-reaction count="128">喜欢</mao-reaction>
<mao-reaction active count="15" icon="star" color="warning">收藏</mao-reaction>`}
        >
          <mao-reaction count={128}>喜欢</mao-reaction>
          <mao-reaction active count={15} icon="star" color="warning">
            收藏
          </mao-reaction>
        </Demo>
        <p className="demo-note">最近一次 mt-change: {last}</p>
      </div>

      <h2>不同图标</h2>
      <Demo
        code={`<mao-reaction count="42" icon="star" color="warning" label="收藏" />
<mao-reaction count="7" active icon="bookmark" color="primary" label="书签" />
<mao-reaction count="15" icon="heart" color="info" label="喜欢" />
<mao-reaction count="34" icon="chat" color="neutral" label="评论" />`}
      >
        <mao-reaction count={42} icon="star" color="warning" label="收藏" />
        <mao-reaction count={7} active icon="bookmark" color="primary" label="书签" />
        <mao-reaction count={15} icon="heart" color="info" label="喜欢" />
        <mao-reaction count={34} icon="chat" color="neutral" label="评论" />
      </Demo>

      <h2>尺寸</h2>
      <Demo
        code={`<mao-reaction size="sm" count="12" icon="star" />
<mao-reaction size="md" count="12" icon="star" />
<mao-reaction size="lg" count="12" icon="star" />`}
      >
        <mao-reaction size="sm" count={12} icon="star" />
        <mao-reaction size="md" count={12} icon="star" />
        <mao-reaction size="lg" count={12} icon="star" />
      </Demo>

      <h2>纯切换（无计数）</h2>
      <Demo code={`<mao-reaction icon="bookmark" label="收藏">收藏</mao-reaction>`}>
        <mao-reaction icon="bookmark" label="收藏">
          收藏
        </mao-reaction>
      </Demo>

      <ApiProps tag="mao-reaction" />
    </>
  );
}
