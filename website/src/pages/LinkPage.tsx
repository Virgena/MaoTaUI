import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  BUTTON_COLORS,
  MaoLink,
} from "../../../src/index.tsx";

export function LinkPage() {
  return (
    <>
      <h1>链接</h1>
      <pre className="demo-code">import {"{ MaoLink }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoLink href="#/link">内部链接</MaoLink>
<MaoLink href="#/link" underline="hover">悬停显示下划线</MaoLink>
<MaoLink href="#/link" underline="none">无下划线</MaoLink>`}
      >
        <MaoLink href="#/link">内部链接</MaoLink>
        <MaoLink href="#/link" underline="hover">
          悬停显示下划线
        </MaoLink>
        <MaoLink href="#/link" underline="none">
          无下划线
        </MaoLink>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`<MaoLink href="#/link" color="primary">primary</MaoLink>
<MaoLink href="#/link" color="secondary">secondary</MaoLink>
<MaoLink href="#/link" color="success">success</MaoLink>
<MaoLink href="#/link" color="warning">warning</MaoLink>
<MaoLink href="#/link" color="danger">danger</MaoLink>
<MaoLink href="#/link" color="info">info</MaoLink>
<MaoLink href="#/link" color="neutral">neutral</MaoLink>`}
      >
        {BUTTON_COLORS.map((color) => (
          <MaoLink key={color} href="#/link" color={color}>
            {color}
          </MaoLink>
        ))}
      </Demo>

      <h2>外部链接</h2>
      <Demo
        code={`<MaoLink href="https://example.com" target="_blank" isShowAnchorIcon>
  新窗口打开
</MaoLink>
<MaoLink href="https://example.com" target="_blank">不带箭头</MaoLink>`}
      >
        <MaoLink href="https://example.com" target="_blank" isShowAnchorIcon>
          新窗口打开
        </MaoLink>
        <MaoLink href="https://example.com" target="_blank">
          不带箭头
        </MaoLink>
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          ["color", "ButtonColor", `"primary"`, "Palette key; paints the text and the underline"],
          ["underline", `"always" | "hover" | "none"`, `"always"`, "Default is always — a link can't be told apart by colour alone"],
          ["size", `"sm" | "md" | "lg"`, `"md"`, "Font step"],
          ["isShowAnchorIcon", "boolean", "false", "Trailing external-link arrow"],
          ["href / target / rel", "string", "—", `target other than "_self" with no rel gets noopener noreferrer`],
          ["className", "string", `""`, "Extra classes on the anchor"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[["children", "ReactNode", "Link text; the arrow is appended after it"]]}
      />
    </>
  );
}

