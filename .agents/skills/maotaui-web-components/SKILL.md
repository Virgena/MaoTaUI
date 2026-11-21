---
name: maotaui-web-components
description: Build and extend the MaoTaUI native Web Components library and its docs site. Use when adding or documenting mao-* elements, adding Lucide icons, editing design tokens, or fixing SSR and hydration issues. Do not use for unrelated React-only UI work.
---

# MaoTaUI Web Components

Native custom elements, no runtime framework. Docs site is a React 19 shell that only renders `mao-*` tags.

## Repo map

- `src/index.ts` — entry. Exports core + elements, then calls `defineMaoElements()` only when `customElements` exists. It is JS-only: styles are a separate `maotaui/styles.css` subpath.
- `src/elements/*.ts` — element classes. Each declares `static mode`; most controls, display and layout elements are `"shadow"` (with `static styles` + `shadowHTML`), the rest render light DOM.
- `src/core/registry.ts` — single source of truth for tag, attributes, events, slots, example. Docs and AI read this instead of duplicating tables.
- `src/core/` — `theme.ts`, `tokens.ts`, `color.ts`, `icons.ts`, `events.ts`, `form.ts`, `dom.ts`.
- `src/core/icons.generated.ts` — generated Lucide icon bodies; gitignored, never hand-edit.
- `scripts/build-icons.ts` — reads `@iconify-json/lucide`, extracts the required icons, writes `icons.generated.ts`.
- `src/styles.css` — design tokens (color head generated from `color.ts`) plus `.mt-*` classes used by elements and consumers. It is not imported by the entry; consumers import the published `maotaui/styles.css`.
- `website/` — React docs shell (`routes.ts`, `pages/`, `components/ApiProps.tsx`).
- `website/src/main.tsx` — React entry; imports `../../src/styles.css` explicitly before the site styles.
- `website/src/Docs.tsx` + `website/src/shell.css` — docs chrome: topbar, `.sidebar` nav grouped by `route.group`, `.content`; demo-stage styles live in `demo.css`.
- `scripts/ssr-smoke.ts` — Node import + registry consistency test. It runs without a CSS resolve hook, so it catches non-JS imports in the entry.

## Commands

```bash
pnpm icons        # regenerate src/core/icons.generated.ts from @iconify-json/lucide
pnpm typecheck
pnpm --filter maotaui-website exec tsc -p tsconfig.json --noEmit
pnpm build
pnpm check        # generated tokens vs styles.css + contrast sweep, both themes
pnpm ssr          # Node import smoke test
pnpm dev          # docs site on http://localhost:5173
```

## Color and tokens

- `src/core/color.ts` generates the palette from `DEFAULT_SEED` (`#a95d68`); `monetScale()` exposes the 50–950 scale.
- `NEUTRAL_HEX` pins paper/surface/border/ink to the Stillform reference palette in both themes. Neutrals are fixed and must not be tinted by the seed hue.
- `--mt-accent` mirrors the primary fill (the seed in light, the deepened rose in dark), so `--mt-on-accent` is white with the default seed and primary actions read white-on-rose in both themes.
- When you need the light rose as *text* on soft backgrounds (badge / avatar / notice accent), use `--mt-color-primary`, never `--mt-accent`.
- Secondary is the ink/paper pair (`--mt-fill-secondary` = `--mt-text`), not a separate hue.
- Ambient tokens are hand-maintained in `src/styles.css`, not generated: `--mt-faint`, `--mt-line-strong`, `--mt-accent-soft`, `--mt-sage(-soft)`, `--mt-blue(-soft)`, `--mt-shadow(-overlay)`.
- Workflow: change `color.ts`, re-paste the palette into the `:root` / `[data-theme="dark"]` / media-query blocks of `src/styles.css`, then run `pnpm check`. Generated tokens must match `monetPalette()` exactly; ambient tokens are not asserted.
- `pnpm check` sweeps 7 seeds × 2 themes at ≥4.5. One intentional deviation from the reference: light `--mt-muted` is `#6f6860` (`#777168` fails on `--mt-surface-2`).
- In dark theme `--mt-fill-primary` / `--mt-fill-neutral` / `--mt-accent` share the deepened rose picked by `fillFor()` so white `--mt-on-*` clears 4.5:1; ambient `--mt-accent-soft` is `#3a2729` (dark) / `#f5e8e8` (light) so `--mt-color-primary` text on it reaches 4.5:1.
- Solid fills always pair with their `--mt-on-*`: buttons use `fill-*` / `on-*`, the checked checkbox and `badge-solid` use `accent` / `on-accent`. Never paint text or icons on a solid fill with `--mt-text`.
- `pnpm check` only asserts generated tokens; ambient pairs (e.g. `--mt-color-primary` on `--mt-accent-soft`) are hand-verified, so recheck them whenever you touch soft backgrounds.
- `website/src/pages/ColorsPage.tsx` renders 基础色板 / 强调与支持 / 语义色 / 色阶 / 令牌. New tokens must be added to `TOKEN_NAMES` and `TOKEN_DESCRIPTIONS` to appear there.

## Add or change an element

1. Implement the class in `src/elements/`, extending `MaoElement`; declare `observedAttributes` and update existing nodes in `update()`.
2. Pick a render mode: default light DOM; set `static mode = "shadow"` plus `static styles` and `static shadowHTML` for encapsulated components (checkbox, radio, switch, icon, progress, dialog…). `styles` is adopted once per class; `update()` must only touch existing shadow nodes.
3. Register it in `ELEMENT_DEFINITIONS` in `src/elements/index.ts`.
4. Add a `COMPONENT_REGISTRY` entry in `src/core/registry.ts` with attributes, events, slots, and an example.
5. Add a docs page under `website/src/pages/` and a route in `website/src/routes.ts`; end the page with `<ApiProps tag="mao-x" />`.
6. Style with `.mt-*` classes and `var(--mt-*)` tokens only, then run both typechecks and `pnpm check`.

## Docs site shell

- Sidebar rows are grouped nav links in `shell.css` (264px column, 2px gaps, `--mt-radius-sm`); tune density there, not inline.
- Scroll surfaces must match the library's thin scrollbar (6px, pill thumb in `--mt-border`, transparent track, from `.mt-scroll-area[data-scrollbar="thin"]`). `html` and `.sidebar` already mirror it — never ship a native-looking scrollbar.

## Built-in icons

- Source of truth: the `ICON_SOURCES` list in `scripts/build-icons.ts`. To add an icon, append its Lucide id there and run `pnpm icons`.
- Public names are Lucide kebab-case ids (`chevron-down`, `folder-open`, `triangle-alert`). There are no camelCase aliases; old names render nothing.
- Icons are inline SVG at runtime; the Iconify package is a build-time devDependency only. Default stroke width is 2 (`iconSvg()` and `<mao-icon stroke-width>`), and generated bodies must not contain inline `stroke-*` attributes.
- `predev` / `prebuild` / `pretypecheck` / `pressr` regenerate the file automatically; run `pnpm icons` after a fresh clone before typechecking.
- `iconSvg()` returns `""` for an unknown name, so a component referencing a missing icon silently renders nothing. Add the Lucide id to `ICON_SOURCES` first, then rebuild.
- Light-DOM elements that need an authored icon (e.g. `mao-link`'s `external` arrow) append the `iconSvg()` result as a child in `update()`, cache the node to avoid duplicates, and size it in CSS with `em` units so it follows the element's font size.

## Hard constraints

- SSR safe: never touch `window`, `document`, `localStorage`, or `customElements` at module top level. Guard with `typeof`. Importing `src/index.ts` in Node must not throw.
- The entry must contain no non-JS static imports (no `import "./styles.css"`, JSON, etc.). Styles ship through the `maotaui/styles.css` subpath and are imported by the client entry.
- No network: icons are inline SVG bodies generated into `src/core/icons.generated.ts`; no fetch, no remote images, no `@import url(`.
- Deterministic output: no `Math.random`, `Date.now`, or `crypto.randomUUID` in `src/`.
- Events use the `mt-` prefix, are dispatched through `src/core/events.ts`, and always set `bubbles: true, composed: true`.
- Boolean attributes mean presence = true. Never encode truth with `active="false"`.
- Keep comments minimal; follow `AGENTS.md`.

## Gotchas

- React 19 does not map `mt-*` events to `onXxx`. Use `ref` + `addEventListener`, as in `website/src/useMaoEvents.ts`.
- Passing `false` to a boolean prop writes `attr="false"`, which is still present and truthy for elements. Pass `undefined` instead (`on()` in `website/src/pages/shared.ts`).
- Form-associated elements extend `FormAssociated` in `src/core/form.ts`, which falls back to an empty base class when `HTMLElement` is undefined.
- The registry drives docs: if an attribute is missing there, it is invisible to users and AI.
