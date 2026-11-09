import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";
import { BUTTON_COLORS, BUTTON_SIZES } from "./shared.ts";

export function CopyPage() {
  const [last, setLast] = useState("");
  const ref = useMaoEvents<HTMLDivElement>({
    "mt-copy": (event) => setLast(String(event.detail.text ?? "")),
  });

  return (
    <>
      <h1>复制</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <div ref={ref}>
        <Demo
          code={`<mao-copy text="pnpm add maotaui" label="复制命令"></mao-copy>
<mao-copy text="maota@example.com" label="复制邮箱" copied-label="已复制!"></mao-copy>`}
        >
          <mao-copy text="pnpm add maotaui" label="复制命令" />
          <mao-copy text="maota@example.com" label="复制邮箱" copied-label="已复制!" />
        </Demo>
        {last ? <p className="demo-note">mt-copy: {last}</p> : null}
      </div>

      <h2>颜色</h2>
      <Demo code={BUTTON_COLORS.map((color) => `<mao-copy color="${color}" text="${color}" label="${color}" />`).join("\n")}>
        {BUTTON_COLORS.map((color) => (
          <mao-copy key={color} color={color} text={color} label={color} />
        ))}
      </Demo>

      <h2>实心外观</h2>
      <Demo code={`<mao-copy variant="solid" text="pnpm add maotaui" label="复制安装命令" />`}>
        <mao-copy variant="solid" text="pnpm add maotaui" label="复制安装命令" />
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<mao-copy size="${size}" text="${size}" label="${size}" />`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <mao-copy key={size} size={size} text={size} label={size} />
        ))}
      </Demo>

      <ApiProps tag="mao-copy" />
    </>
  );
}
