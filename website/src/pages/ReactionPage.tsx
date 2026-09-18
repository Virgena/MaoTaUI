import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoReaction,
} from "../../../src/index.tsx";

export function ReactionPage() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(128);
  const [saved, setSaved] = useState(true);
  const [saves, setSaves] = useState(15);
  const [shares, setShares] = useState(12);
  const [starred, setStarred] = useState(false);
  return (
    <>
      <h1>点赞</h1>
      <pre className="demo-code">import {"{ MaoReaction }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`const [liked, setLiked] = useState(false);
const [likes, setLikes] = useState(128);

<MaoReaction
  active={liked}
  count={likes}
  onChange={(next, count) => { setLiked(next); setLikes(count); }}
/>`}
      >
        <MaoReaction
          active={liked}
          count={likes}
          onChange={(next, count) => {
            setLiked(next);
            setLikes(count);
          }}
        />
      </Demo>

      <h2>带文字 label</h2>
      <Demo
        code={`<MaoReaction active={saved} count={saves} icon="star" color="warning"
  onChange={(next, count) => { setSaved(next); setSaves(count); }}>收藏游戏</MaoReaction>`}
      >
        <MaoReaction
          active={saved}
          count={saves}
          icon="star"
          color="warning"
          onChange={(next, count) => {
            setSaved(next);
            setSaves(count);
          }}
        >
          收藏游戏
        </MaoReaction>
      </Demo>

      <h2>不同表态</h2>
      <Demo
        code={`<MaoReaction count={42} icon="star" color="warning" label="收藏" />
<MaoReaction count={7} active icon="bookmark" color="primary" label="收藏夹" />
<MaoReaction count={15} icon="heart" color="info" label="喜欢" />`}
      >
        <MaoReaction count={42} icon="star" color="warning" label="收藏" />
        <MaoReaction count={7} active icon="bookmark" color="primary" label="收藏夹" />
        <MaoReaction count={15} icon="heart" color="info" label="喜欢" />
      </Demo>

      <h2>尺寸</h2>
      <Demo
        code={`<MaoReaction size="sm" count={12} icon="star" />
<MaoReaction size="md" count={12} icon="star" />
<MaoReaction size="lg" count={12} icon="star" />`}
      >
        <MaoReaction size="sm" count={12} icon="star" />
        <MaoReaction size="md" count={12} icon="star" />
        <MaoReaction size="lg" count={12} icon="star" />
      </Demo>

      <h2>纯切换(无计数)</h2>
      <Demo
        code={`<MaoReaction active={starred} icon="bookmark" label="收藏"
  onChange={(next) => setStarred(next)} />`}
      >
        <MaoReaction active={starred} icon="bookmark" label="收藏" onChange={(next) => setStarred(next)} />
      </Demo>

      <h2>操作栏(toggle / action)</h2>
      <Demo
        code={`<MaoReaction toggle={false} icon="chat" label="评论" count={34} />
<MaoReaction toggle={false} icon="share" label="转发" count={shares}
  onClick={() => setShares(shares + 1)} />
<MaoReaction toggle={false} icon="more" label="更多" />`}
      >
        <MaoReaction toggle={false} icon="chat" label="评论" count={34} />
        <MaoReaction toggle={false} icon="share" label="转发" count={shares} onClick={() => setShares(shares + 1)} />
        <MaoReaction toggle={false} icon="more" label="更多" />
      </Demo>

      <h2>自定义(插槽 + 任意颜色)</h2>
      <Demo
        code={`<MaoReaction count={233} icon="star" color="#ff6a00" label="推" />
<MaoReaction count={66} active icon="heart" color="#8b5cf6" label="紫心" />`}
      >
        <MaoReaction count={233} icon="star" color="#ff6a00" label="推" />
        <MaoReaction count={66} active icon="heart" color="#8b5cf6" label="紫心" />
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["active", "boolean", "false", "Pressed state. Controlled — the component never stores it itself"],
          ["count", "number", "—", "Omitted means a bare reaction with no number"],
          ["icon", "IconName", `"heart"`, "Built-in icon name; the visible text goes through children"],
          ["color", "ButtonColor | string", `"danger"`, "Palette key or any CSS colour; fills the pill when active"],
          ["label", "string", "—", `Accessible name. Falls back to the visible text, then "Reaction"`],
          ["toggle", "boolean", "true", "true = a toggle (aria-pressed + self-latching); false = a one-shot action"],
          ["onChange", "(active: boolean, count: number) => void", "—", "Reports the next state and next count; not called when toggle is false"],
          ["size", `"sm" | "md" | "lg"`, `"md"`, "Scales the whole pill"],
          ["className", "string", `""`, "Extra classes on the button; disabled still applies"],
        ]}
      />

      <h2>事件</h2>
      <Props
        head={["事件", "回调参数", "说明"]}
        rows={[
          ["onChange", "active: boolean, count: number", "Fired on a toggle press, with the state the caller should store next"],
          ["onClick", "MouseEvent", "Native click; fires in both toggle and action mode"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[["children", "ReactNode", "Visible text inside the pill, so the whole pill is the hit area"]]}
      />
    </>
  );
}

