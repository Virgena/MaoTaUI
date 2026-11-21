import { iconSvg } from "../../src/core/icons.ts";

const logo = iconSvg("palette", { size: 40, strokeWidth: 2 }).replaceAll(
  "currentColor",
  "#617ff5",
);

export const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(logo)}`;
