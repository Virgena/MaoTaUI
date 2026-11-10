import { useEffect, useState } from "react";
import { DEFAULT_SEED, monetScale } from "../../../src/core/color.ts";
import { TOKEN_DESCRIPTIONS, TOKEN_NAMES } from "../../../src/core/tokens.ts";
import { Props } from "../components/Props.tsx";

const ROLES = ["primary", "secondary", "info", "success", "warning", "danger"] as const;

const FOUNDATIONS: Array<[string, string, string]> = [
  ["--mt-bg", "纸面", "var(--mt-text)"],
  ["--mt-surface", "浮层表面", "var(--mt-text)"],
  ["--mt-surface-2", "次级表面", "var(--mt-text)"],
  ["--mt-border", "细描边", "var(--mt-text)"],
  ["--mt-text", "正文墨色", "var(--mt-bg)"],
  ["--mt-muted", "次要文字", "var(--mt-bg)"],
  ["--mt-faint", "最弱文字", "var(--mt-bg)"],
];

const SUPPORTS: Array<[string, string, string]> = [
  ["--mt-accent", "强调", "var(--mt-on-accent)"],
  ["--mt-accent-soft", "强调软背景", "var(--mt-color-primary)"],
  ["--mt-sage", "鼠尾草绿", "var(--mt-bg)"],
  ["--mt-sage-soft", "鼠尾草软背景", "var(--mt-sage)"],
  ["--mt-blue", "雾蓝", "var(--mt-bg)"],
  ["--mt-blue-soft", "雾蓝软背景", "var(--mt-blue)"],
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

      <h2>基础色板</h2>
      <p className="demo-note">纸面、表面与墨色固定为参考稿的暖色，不随强调色种子变化。</p>
      <div className="tone-grid">
        {FOUNDATIONS.map(([token, label, fg]) => (
          <div className="tone" key={token} style={{ background: `var(${token})`, color: fg }}>
            <span className="tone-aa">Aa</span>
            <span className="tone-name">{label}</span>
            <em>{token.replace("--mt-", "")}</em>
            <em>{value(token)}</em>
          </div>
        ))}
      </div>

      <h2>强调与支持</h2>
      <p className="demo-note">强调色只用于需要被注意的动作与状态；鼠尾草绿和雾蓝承担成功与信息语境。</p>
      <div className="tone-grid">
        {SUPPORTS.map(([token, label, fg]) => (
          <div className="tone" key={token} style={{ background: `var(${token})`, color: fg }}>
            <span className="tone-aa">Aa</span>
            <span className="tone-name">{label}</span>
            <em>{token.replace("--mt-", "")}</em>
            <em>{value(token)}</em>
          </div>
        ))}
      </div>

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
