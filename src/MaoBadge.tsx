import type { HTMLAttributes, ReactNode } from "react";

export interface MaoBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "accent" | "danger";
  children: ReactNode;
}

export function MaoBadge({ tone = "neutral", className = "", children, ...rest }: MaoBadgeProps) {
  return (
    <span className={`mt-badge mt-badge-${tone} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
