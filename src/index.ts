import { defineMaoElements } from "./elements/index.ts";

export * from "./core/index.ts";
export * from "./elements/index.ts";

if (typeof customElements !== "undefined") {
  defineMaoElements();
}
