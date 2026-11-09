import { useEffect, useState } from "react";
import { DEFAULT_SEED, monetScale } from "../../../src/core/color.ts";
import { TOKEN_DESCRIPTIONS, TOKEN_NAMES } from "../../../src/core/tokens.ts";
import { Props } from "../components/Props.tsx";

const ROLES = ["primary", "secondary", "info", "success", "warning", "danger"] as const;

const SURFACES: Array<[string, string]> = [
  ["bg", "页面底色"],
  ["surface", "卡片表面"],
  ["surface-2", "次级表面"],
  ["border", "描边"],
  ["text", "正文墨色"],
  ["muted", "次要文字"],
];

function readTokens(): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  const pairs = TOKEN_NAMES.map((name) => [name, style.getPropertyValue(name).trim()] as const);
  return Object.fromEntries(pairs);
}

export function ColorsPage() {
  const [tokens, setTokens] = useState<Record<string, string>>(readTokens);

  useEffect(() => {
    const observer = new MutationObserver(() => setTokens(readTokens()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const value = (name: string) => tokens[name] ?? "";

  return (
    <>
      <h1>色彩</h1>
      <p className="demo-note">
        所有颜色来自 CSS 变量（设计令牌），亮暗主题各一套。切换顶栏主题即可看到实时变化。
      </p>

      <h2>语义色</h2>
      <div className="tone-grid">
        {ROLES.map((role) => (
          <div
            className="tone"
            key={role}
            style={{ background: `var(--mt-fill-${role})`, color: `var(--mt-on-${role})` }}
          >
            <span className="tone-aa">Aa</span>
            <span className="tone-name">{role}</span>
            <em>{value(`--mt-fill-${role}`)}</em>
          </div>
        ))}
      </div>

      <h2>表面与文字</h2>
      <div className="surface-grid">
        {SURFACES.map(([name, label]) => (
          <div className="surface" key={name} style={{ background: `var(--mt-${name})` }}>
            <span className="surface-token">--mt-{name}</span>
            <span className="surface-label">{label}</span>
            <em>{value(`--mt-${name}`)}</em>
          </div>
        ))}
      </div>

      <h2>色阶</h2>
      <p className="demo-note">
        以主色种子 {DEFAULT_SEED} 派生 50–950 的完整色阶，可用 monetScale(seed, role) 生成。
      </p>
      <div className="scale">
        {ROLES.map((role) => (
          <div className="scale-row" key={role}>
            <b>{role}</b>
            <div className="scale-steps">
              {monetScale(DEFAULT_SEED, role).map((entry) => (
                <span className="scale-step" key={entry.step}>
                  <i style={{ background: entry.color }} />
                  <em>{entry.step}</em>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>令牌</h2>
      <Props
        head={["令牌", "说明", "当前值"]}
        rows={TOKEN_NAMES.map((name) => [name, TOKEN_DESCRIPTIONS[name], value(name)])}
      />
    </>
  );
}
