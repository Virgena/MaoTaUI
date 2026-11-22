---
name: maotaui-web-components
description: Build and extend the MaoTaUI native Web Components library, its complete Lucide icon catalog, fonts, and docs site.
---

# MaoTaUI Web Components

Native custom elements with no runtime UI framework. The docs shell is React, but all library controls are `mao-*` elements.

## Repo map

- `src/index.ts` exports the core/elements and registers custom elements only when a DOM exists.
- `src/elements/*.ts` contains element classes. Shadow-DOM elements declare `mode`, `shadowHTML`, and `styles`; the rest are light DOM.
- `src/core/registry.ts` is the source of truth for component attributes, events, slots, and examples.
- `src/core/icons.generated.ts` is generated from the complete Lucide icon data and aliases. Never hand-edit it.
- `scripts/build-icons.ts` enumerates all official Lucide names and aliases, resolves aliases, normalizes SVG bodies, and writes `icons.generated.ts`.
- `src/styles.css` contains design tokens, `@font-face`, and `.mt-*` classes.
- `src/fonts/` contains all nine self-hosted Noto Sans SC WOFF2 weights and `OFL.txt`.
- `website/src/Docs.tsx` and `website/src/shell.css` contain the docs shell.
- `scripts/ssr-smoke.ts` checks Node import safety and registry consistency.

## Commands

```bash
pnpm icons
pnpm typecheck
pnpm --filter maotaui-website exec tsc -p tsconfig.json --noEmit
pnpm check
pnpm ssr
pnpm build
pnpm build:lib
```

`pnpm build:lib` generates icons, compiles the package, copies `styles.css`, and copies every file in `src/fonts/` to `dist/fonts/`.

## Icons

- The public icon catalog is the complete `@iconify-json/lucide/icons.json` dataset, including official names and aliases.
- At the current dependency version this is 2109 official icons plus 237 aliases, 2346 names total.
- Use kebab-case Lucide names such as `house`, `home`, `menu`, `settings-2`, and `chart-no-axes-column`.
- Do not restore a hand-maintained icon allowlist.
- Do not draw functional icons with Unicode glyphs, CSS borders, hand-authored SVG, or another icon package.
- Use `iconSvg()` from `src/core/icons.ts` for icons rendered by components.
- Consumers use `<mao-icon>` or components that render Lucide icons internally; never import Lucide directly in a consumer.
- Unknown names return an empty string, so validate new names against `ICON_NAMES`.
- Purely decorative geometry, such as progress rings, is not an icon.

## Fonts

- Noto Sans SC is self-hosted. Weights 100 through 900 are separate subsetted WOFF2 files.
- `--mt-font`, `--mt-font-display`, and `--mt-font-cn` use Noto Sans SC; keep `--mt-mono` monospaced.
- Read [references/fonts.md](references/fonts.md) before changing or regenerating font assets.
- Keep the OFL license with every published font build.

## Components and tokens

- Use `var(--mt-*)` tokens and `.mt-*` classes. Do not introduce a parallel color or spacing system.
- Solid fills pair with their `--mt-on-*` token.
- Boolean custom-element attributes mean presence is true. Consumers must remove the attribute instead of writing `"false"`.
- Events use the `mt-` prefix through `src/core/events.ts` and are `bubbles: true, composed: true`.
- Add or change an element by updating the class, `ELEMENT_DEFINITIONS`, `COMPONENT_REGISTRY`, docs route/page, and tests.

## Constraints

- Keep icons inline and generated; no network icon requests.
- SSR-safe: guard browser globals and keep `src/index.ts` free of non-JS static imports.
- Deterministic library code: no random values or clock-dependent behavior.
- Keep comments minimal and follow `AGENTS.md`.
- Sanity-check the rendered UI in both themes and verify keyboard/focus behavior for interactive controls.

## Gotchas

- React does not map `mt-*` events to `onXxx`; use refs or the provided event hook.
- The registry drives docs and AI discovery. An unregistered attribute is effectively invisible.
- Full Lucide data is intentionally larger than a small curated subset; do not “optimize” by silently removing names.
