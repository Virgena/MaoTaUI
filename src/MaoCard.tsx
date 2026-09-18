import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { toneStyle } from "./color.ts";

export interface MaoCardProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  color?: "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";
  padding?: "sm" | "md" | "lg";
  bordered?: boolean;
  isTransparent?: boolean;
  isHoverable?: boolean;
  clickable?: boolean;
  href?: string;
  header?: ReactNode;
  cover?: ReactNode;
  footer?: ReactNode;
  contentClass?: string;
}

export function MaoCard({
  color = "neutral",
  padding = "lg",
  bordered = true,
  isTransparent = false,
  isHoverable = false,
  clickable = false,
  href,
  header,
  cover,
  footer,
  contentClass = "",
  className = "",
  style,
  children,
  ...rest
}: MaoCardProps) {
  const cls = `mt-card mt-card-${padding}${bordered ? " mt-card-bordered" : ""}${
    isTransparent ? " mt-card-transparent" : ""
  }${color === "neutral" ? "" : " mt-card-colored"}${isHoverable ? " mt-card-hoverable" : ""}${
    clickable || href ? " mt-card-clickable" : ""
  } ${className}`.trim();
  const props = { className: cls, style: { ...toneStyle(color), ...style } as CSSProperties };

  const inner = (
    <>
      {cover ? <span className="mt-card-cover">{cover}</span> : null}
      <span className={`mt-card-body ${contentClass}`.trim()}>
        {header ? <span className="mt-card-header">{header}</span> : null}
        {children}
        {footer ? <span className="mt-card-footer">{footer}</span> : null}
      </span>
    </>
  );

  if (href)
    return (
      <a {...rest} {...props} href={href}>
        {inner}
      </a>
    );
  if (clickable)
    return (
      <button {...rest} {...props} type="button">
        {inner}
      </button>
    );
  return (
    <div {...rest} {...props}>
      {inner}
    </div>
  );
}
