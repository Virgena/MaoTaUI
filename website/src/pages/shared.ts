export const BUTTON_COLORS = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "neutral",
] as const;

export const BUTTON_VARIANTS = ["solid", "shadow", "bordered", "flat", "light"] as const;

export const BUTTON_SIZES = ["sm", "md", "lg"] as const;

/** 布尔属性「存在即 true」，因此 false 必须映射成 undefined 才能移除属性。 */
export const on = (flag: boolean): true | undefined => (flag ? true : undefined);
