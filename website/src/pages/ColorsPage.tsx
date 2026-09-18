import { useEffect, useState } from "react";
import { DEFAULT_SEED, monetScale } from "../../../src/index.tsx";

const TONES = ["primary", "secondary", "info", "success", "warning", "danger", "neutral"] as const;

const HUES = ["primary", "secondary", "info", "success", "warning", "danger"] as const;

const SURFACES = [
  ["bg", "页面背景"],
  ["surface", "卡片 / 浮层"],
  ["surface-2", "次级面"],
  ["border", "描边"],
] as const;

function read() {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string) => style.getPropertyValue(name).trim();
  return {
    tones: TONES.map((tone) => ({ tone, fill: value(`--mt-fill-${tone}`), on: value(`--mt-on-${tone}`) })),
    surfaces: SURFACES.map(([name, label]) => ({ name, label, value: value(`--mt-${name}`) })),
  };
}

export function ColorsPage() {
  const [palette, setPalette] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(read()));
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <h1>色彩</h1>

      <h2>语义色 · 实心</h2>
      <div className="tone-grid">
        {palette.tones.map(({ tone, fill, on }) => (
          <div className="tone" key={tone} style={{ background: fill, color: on }}>
            <span className="tone-aa">Aa</span>
            <span className="tone-name">{tone}</span>
            <em>{fill}</em>
          </div>
        ))}
      </div>

      <h2>色阶</h2>
      <div className="scale">
        {HUES.map((hue) => (
          <div className="scale-row" key={hue}>
            <b>{hue}</b>
            <div className="scale-steps">
              {monetScale(DEFAULT_SEED, hue).map(({ step, color }) => (
                <span className="scale-step" key={step}>
                  <i style={{ background: color }} />
                  <em>{step}</em>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>表面 · 层级</h2>
      <div className="surface-grid">
        {palette.surfaces.map(({ name, label, value }) => (
          <div className="surface" key={name} style={{ background: `var(--mt-${name})` }}>
            <span className="surface-token">{name}</span>
            <span className="surface-label">{label}</span>
            <em>{value}</em>
          </div>
        ))}
      </div>
    </>
  );
}
