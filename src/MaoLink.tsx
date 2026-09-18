import type { AnchorHTMLAttributes, CSSProperties } from "react";
import { MaoIcon } from "./MaoIcon.tsx";
import type { ButtonColor } from "./MaoButton.tsx";
import { toneStyle } from "./color.ts";

export interface MaoLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
  color?: ButtonColor;
  underline?: "always" | "hover" | "none";
  size?: "sm" | "md" | "lg";
  isShowAnchorIcon?: boolean;
}

export function MaoLink({
  color = "primary",
  underline = "always",
  size = "md",
  isShowAnchorIcon = false,
  className = "",
  style,
  target,
  rel,
  children,
  ...rest
}: MaoLinkProps) {
  return (
    <a
      {...rest}
      className={`mt-link mt-link-${size} mt-link-${underline} ${className}`.trim()}
      style={{ ...toneStyle(color), ...style } as CSSProperties}
      target={target}
      rel={rel ?? (target && target !== "_self" ? "noopener noreferrer" : undefined)}
    >
      {children}
      {isShowAnchorIcon ? <MaoIcon name="external" size={12} /> : null}
    </a>
  );
}
