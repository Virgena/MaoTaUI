import { useEffect, useRef, useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { Props } from "../components/Props.tsx";
import {
  MaoButton,
  MaoButtonGroup,
  MaoIcon,
} from "../../../src/index.tsx";

const SPLIT_CODE = `function SplitButton() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("");
  const box = useRef(null);
  const items = [
    { key: "存为草稿", icon: "bookmark", danger: false },
    { key: "定时发布", icon: "calendar", danger: false },
    { key: "丢弃", icon: "trash", danger: true },
  ];
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false);
    };
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div className="demo-col">
      <div className="split" ref={box}>
        <MaoButtonGroup aria-label="发布">
          <MaoButton color="primary" onClick={() => setLast("发布")}>发布</MaoButton>
          <MaoButton
            className="mt-btn-icon"
            color="primary"
            aria-label="更多发布选项"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <MaoIcon name="chevronDown" />
          </MaoButton>
        </MaoButtonGroup>
        {open && (
          <div className="split-menu" role="menu">
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={item.danger ? "is-danger" : ""}
                onClick={() => {
                  setLast(item.key);
                  setOpen(false);
                }}
              >
                <MaoIcon name={item.icon} size={14} />
                {item.key}
              </button>
            ))}
          </div>
        )}
      </div>
      {last && <span className="demo-note">上一次操作: {last}</span>}
    </div>
  );
}`;

function SplitButton() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const items = [
    { key: "存为草稿", icon: "bookmark" as const, danger: false },
    { key: "定时发布", icon: "calendar" as const, danger: false },
    { key: "丢弃", icon: "trash" as const, danger: true },
  ];
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div className="demo-col">
      <div className="split" ref={box}>
        <MaoButtonGroup aria-label="发布">
          <MaoButton color="primary" onClick={() => setLast("发布")}>
            发布
          </MaoButton>
          <MaoButton
            className="mt-btn-icon"
            color="primary"
            aria-label="更多发布选项"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <MaoIcon name="chevronDown" />
          </MaoButton>
        </MaoButtonGroup>
        {open && (
          <div className="split-menu" role="menu">
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={item.danger ? "is-danger" : ""}
                onClick={() => {
                  setLast(item.key);
                  setOpen(false);
                }}
              >
                <MaoIcon name={item.icon} size={14} />
                {item.key}
              </button>
            ))}
          </div>
        )}
      </div>
      {last && <span className="demo-note">上一次操作: {last}</span>}
    </div>
  );
}

export function ButtonGroupPage() {
  return (
    <>
      <h1>按钮组</h1>
      <pre className="demo-code">import {"{ MaoButtonGroup, MaoButton }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoButtonGroup aria-label="对齐">
  <MaoButton variant="bordered">左</MaoButton>
  <MaoButton variant="bordered">中</MaoButton>
  <MaoButton variant="bordered">右</MaoButton>
</MaoButtonGroup>`}
      >
        <MaoButtonGroup aria-label="对齐">
          <MaoButton variant="bordered">左</MaoButton>
          <MaoButton variant="bordered">中</MaoButton>
          <MaoButton variant="bordered">右</MaoButton>
        </MaoButtonGroup>
      </Demo>

      <h2>尺寸</h2>
      <Demo
        code={`{(["sm", "md", "lg"] as const).map((size) => (
  <MaoButtonGroup key={size} aria-label={"视图 " + size}>
    <MaoButton size={size} variant="bordered">列表</MaoButton>
    <MaoButton size={size} variant="bordered">网格</MaoButton>
    <MaoButton size={size} variant="bordered">时间线</MaoButton>
  </MaoButtonGroup>
))}`}
      >
        {(["sm", "md", "lg"] as const).map((size) => (
          <MaoButtonGroup key={size} aria-label={"视图 " + size}>
            <MaoButton size={size} variant="bordered">
              列表
            </MaoButton>
            <MaoButton size={size} variant="bordered">
              网格
            </MaoButton>
            <MaoButton size={size} variant="bordered">
              时间线
            </MaoButton>
          </MaoButtonGroup>
        ))}
      </Demo>

      <h2>纵向</h2>
      <Demo
        code={`<MaoButtonGroup orientation="vertical" aria-label="图片工具">
  <MaoButton variant="bordered"><MaoIcon name="search" />放大</MaoButton>
  <MaoButton variant="bordered"><MaoIcon name="minus" />缩小</MaoButton>
  <MaoButton variant="bordered"><MaoIcon name="refresh" />旋转</MaoButton>
</MaoButtonGroup>`}
      >
        <MaoButtonGroup orientation="vertical" aria-label="图片工具">
          <MaoButton variant="bordered">
            <MaoIcon name="search" />
            放大
          </MaoButton>
          <MaoButton variant="bordered">
            <MaoIcon name="minus" />
            缩小
          </MaoButton>
          <MaoButton variant="bordered">
            <MaoIcon name="refresh" />
            旋转
          </MaoButton>
        </MaoButtonGroup>
      </Demo>

      <h2>分裂按钮</h2>
      <Demo
        code={SPLIT_CODE}
      >
        <SplitButton />
      </Demo>

      <h2>属性</h2>
      <Props
        head={["属性", "类型", "默认值", "说明"]}
        rows={[
          [
            "orientation",
            `"horizontal" | "vertical"`,
            `"horizontal"`,
            "Lay the segments out as a row or a column; the squared inner corners and the collapsed seam follow it",
          ],
          ["className", "string", `""`, "Extra classes on the group; role=group and aria-label go straight through"],
        ]}
      />

      <h2>插槽</h2>
      <Props
        head={["插槽", "类型", "说明"]}
        rows={[["children", "ReactNode", "Must be .mt-btn elements — one wrapper div in between breaks the seam"]]}
      />
    </>
  );
}

