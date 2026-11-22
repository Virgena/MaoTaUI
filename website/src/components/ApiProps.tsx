import { componentMeta } from "../../../src/core/registry.ts";
import { Props } from "./Props.tsx";

/** 由 registry 驱动的 API 表：属性 / 事件 / 插槽，单一事实源。 */
const DETAIL: Record<string, string> = {
  click: "MouseEvent",
  "mt-change":
    "{ value?: string; checked?: boolean; values?: string[]; page?: number; pageSize?: number; href?: string }",
  "mt-toggle": "{ active: boolean; value?: string }",
  "mt-input": "{ value: string; name?: string }",
  "mt-copy": "{ text: string }",
  "mt-submit": "{ values: Record<string, string> }",
  "mt-invalid": "{ errors: Record<string, string> }",
  "mt-open": "{}",
  "mt-close": "{}",
};

const NOTE: Record<string, string> = {
  click: "原生点击；loading / disabled 时不会触发",
  "mt-change": "值变化时派发，bubbles + composed，可穿透 Shadow DOM",
  "mt-toggle": "选中态切换时派发",
  "mt-input": "输入过程中持续派发",
  "mt-copy": "复制成功后派发",
  "mt-submit": "表单校验通过后派发，携带全部字段值",
  "mt-invalid": "表单校验失败时派发，键为字段 name",
  "mt-open": "打开时派发",
  "mt-close": "关闭时派发",
};

export function ApiProps({ tag }: { tag: string }) {
  const meta = componentMeta(tag);
  if (!meta) return null;
  return (
    <>
      <h2>
        {meta.title} · 属性
      </h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={meta.attributes.map((item) => [
          item.name,
          item.type,
          item.default ?? "—",
          item.description,
        ])}
      />

      {meta.events.length > 0 ? (
        <>
          <h2>
            {meta.title} · 事件
          </h2>
          <Props
            head={["事件", "回调参数", "说明"]}
            rows={meta.events.map((event) => [
              event,
              DETAIL[event] ?? "Event",
              NOTE[event] ?? "",
            ])}
          />
        </>
      ) : null}

      {meta.slots.length > 0 ? (
        <>
          <h2>
            {meta.title} · 插槽
          </h2>
          <Props head={["插槽", "说明"]} rows={meta.slots.map((slot) => [slot, "Light DOM 子节点"])} />
        </>
      ) : null}
    </>
  );
}
