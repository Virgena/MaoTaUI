import { type ReactNode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MaoButton, BUTTON_COLORS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../src/index.tsx";
import "./docs.css";

const THEME_KEY = "maotaui.theme";

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((now) => (now === "dark" ? "light" : "dark")) };
}

const pages = [
  { id: "button", group: "通用", label: "MaoButton 按钮", render: ButtonPage },
];

function Demo({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="demo">
      <div className="demo-stage">{children}</div>
      <details className="demo-code">
        <summary>Code</summary>
        <pre>{code}</pre>
      </details>
    </div>
  );
}

function ButtonPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <h1>MaoButton 按钮</h1>
      <pre className="demo-code">import {"{ MaoButton }"} from "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<MaoButton color="primary">Primary</MaoButton>
<MaoButton color="secondary">Secondary</MaoButton>
<MaoButton color="danger">Danger</MaoButton>`}
      >
        <MaoButton color="primary">Primary</MaoButton>
        <MaoButton color="secondary">Secondary</MaoButton>
        <MaoButton color="danger">Danger</MaoButton>
      </Demo>

      <h2>颜色</h2>
      <Demo
        code={`{BUTTON_COLORS.map((color) => (
  <MaoButton key={color} color={color}>
    {color}
  </MaoButton>
))}`}
      >
        {BUTTON_COLORS.map((color) => (
          <MaoButton key={color} color={color}>
            {color}
          </MaoButton>
        ))}
      </Demo>

      <h2>变体</h2>
      <Demo
        code={BUTTON_VARIANTS.map(
          (variant) => `<MaoButton color="primary" variant="${variant}">${variant}</MaoButton>`,
        ).join("\n")}
      >
        {BUTTON_VARIANTS.map((variant) => (
          <MaoButton key={variant} color="primary" variant={variant}>
            {variant}
          </MaoButton>
        ))}
      </Demo>

      <h2>尺寸</h2>
      <Demo code={BUTTON_SIZES.map((size) => `<MaoButton size="${size}">${size}</MaoButton>`).join("\n")}>
        {BUTTON_SIZES.map((size) => (
          <MaoButton key={size} size={size}>
            {size}
          </MaoButton>
        ))}
      </Demo>

      <h2>状态与事件</h2>
      <Demo code={`<MaoButton color="primary" loading>Submit</MaoButton>`}>
        <MaoButton color="primary" loading>
          Submit
        </MaoButton>
      </Demo>
      <Demo code={`<MaoButton color="primary" disabled>Disabled</MaoButton>`}>
        <MaoButton color="primary" disabled>
          Disabled
        </MaoButton>
      </Demo>
      <Demo code={`<MaoButton color="success" onClick={() => setClicked(true)}>Click me</MaoButton>`}>
        <MaoButton color="success" onClick={() => setClicked(true)}>
          Click me
        </MaoButton>
        {clicked && <span className="demo-note">Clicked!</span>}
      </Demo>

      <h2>作为链接</h2>
      <Demo
        code={`<MaoButton href="#/button">Internal link</MaoButton>
<MaoButton href="https://example.com">External link</MaoButton>`}
      >
        <MaoButton href="#/button">Internal link</MaoButton>
        <MaoButton href="https://example.com">External link</MaoButton>
      </Demo>

      <h2>属性</h2>
      <table className="props">
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>默认</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>color</td>
            <td>"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral"</td>
            <td>"neutral"</td>
            <td>Hue. neutral is the inverted block (what MaoTa's own UI uses)</td>
          </tr>
          <tr>
            <td>variant</td>
            <td>"solid" | "bordered" | "light" | "flat" | "shadow"</td>
            <td>"solid"</td>
            <td>Material. shadow is the only one with a shadow, tinted with its own hue</td>
          </tr>
          <tr>
            <td>size</td>
            <td>"xs" | "sm" | "md" | "lg" | "xl"</td>
            <td>"md"</td>
            <td>md is 32px tall; sm is for toolbars and list rows</td>
          </tr>
          <tr>
            <td>loading</td>
            <td>boolean</td>
            <td>false</td>
            <td>Prepends a spinner and disables the button, so clicks don't fire</td>
          </tr>
          <tr>
            <td>href</td>
            <td>string</td>
            <td>—</td>
            <td>Renders an {"<a>"} instead; external URLs get target="_blank". disabled / loading don't apply on this path</td>
          </tr>
          <tr>
            <td>disabled</td>
            <td>boolean</td>
            <td>false</td>
            <td>Native disabled state: reduced opacity + not-allowed</td>
          </tr>
          <tr>
            <td>…rest</td>
            <td>ButtonHTMLAttributes</td>
            <td>—</td>
            <td>Native button attributes; type defaults to "button"</td>
          </tr>
        </tbody>
      </table>

      <h2>事件</h2>
      <table className="props">
        <thead>
          <tr>
            <th>事件</th>
            <th>参数</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>onClick</td>
            <td>MouseEvent</td>
            <td>Fires on click; not fired while loading / disabled</td>
          </tr>
          <tr>
            <td>onFocus / onBlur</td>
            <td>FocusEvent</td>
            <td>Native focus events; reachable with Tab, focus ring is visible in both themes</td>
          </tr>
          <tr>
            <td>…rest</td>
            <td>—</td>
            <td>Any other native handler (onMouseEnter, onPointerDown, ...) passes straight through</td>
          </tr>
        </tbody>
      </table>

      <h2>插槽</h2>
      <table className="props">
        <thead>
          <tr>
            <th>插槽</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>children</td>
            <td>ReactNode</td>
            <td>Button content. children is the only slot; there are no named slots</td>
          </tr>
          <tr>
            <td>—</td>
            <td>—</td>
            <td>The spinner shown while loading is added automatically</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function Crumbs({ group, label }: { group: string; label: string }) {
  return (
    <nav className="crumbs">
      <span>MaoTaUI</span>
      <span className="sep">/</span>
      <span>{group}</span>
      <span className="sep">/</span>
      <span className="now">{label}</span>
    </nav>
  );
}

function useRoute() {
  const [hash, setHash] = useState(() => location.hash.slice(1));
  useEffect(() => {
    const sync = () => setHash(location.hash.slice(1));
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);
  const id = hash.replace(/^\//, "");
  return pages.find((page) => page.id === id) ?? pages[0];
}

function App() {
  const page = useRoute();
  const { theme, toggle } = useTheme();
  // 侧边栏按 group 分段, group 名就是那段的 h1。
  const groups = [...new Set(pages.map((p) => p.group))];
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">MaoTaUI</div>
        {groups.map((group) => (
          <nav key={group}>
            <h1>{group}</h1>
            {pages
              .filter((p) => p.group === group)
              .map((p) => (
                <a key={p.id} href={`#/${p.id}`} className={p.id === page.id ? "active" : ""}>
                  {p.label}
                </a>
              ))}
          </nav>
        ))}
        <div className="sidebar-foot">
          <MaoButton variant="bordered" size="sm" onClick={toggle}>
            切换到{theme === "dark" ? "亮色" : "暗色"}
          </MaoButton>
        </div>
      </aside>
      {/* key 换页就重挂, 让 fade 重新播一遍。 */}
      <main className="content" key={page.id}>
        <Crumbs group={page.group} label={page.label} />
        <page.render />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
