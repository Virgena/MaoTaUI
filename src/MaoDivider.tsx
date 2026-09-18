import type { CSSProperties, HTMLAttributes } from "react";
import { toneStyle } from "./color.ts";

export interface MaoDividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  orientation?: "horizontal" | "vertical";
  borderStyle?: "solid" | "dashed";
  color?: "default" | "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";
}

export function MaoDivider({
  orientation = "horizontal",
  borderStyle = "solid",
  color = "default",
  className = "",
  style,
  children,
  ...rest
}: MaoDividerProps) {
  const tone = color === "default" ? {} : toneStyle(color);
  const cls = `mt-divider mt-divider-${orientation}${children ? " has-label" : ""}${
    borderStyle === "dashed" ? " is-dashed" : ""
  } ${className}`.trim();

  return (
    <div
      {...rest}
      className={cls}
      style={{ ...tone, ...style } as CSSProperties}
      role="separator"
      aria-orientation={orientation}
    >
      {children ? <span className="mt-divider-label">{children}</span> : null}
    </div>
  );
}
