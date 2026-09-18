import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export const BUTTON_COLORS = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "neutral",
] as const;
export const BUTTON_VARIANTS = ["solid", "bordered", "light", "flat", "shadow"] as const;
export const BUTTON_SIZES = ["sm", "md", "lg"] as const;

export type ButtonColor = (typeof BUTTON_COLORS)[number];
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

type ButtonVariantOld = "primary" | "ghost" | "danger";

const OLD_VARIANTS: Record<ButtonVariantOld, { color: ButtonColor; variant: ButtonVariant }> = {
  primary: { color: "neutral", variant: "solid" },
  ghost: { color: "neutral", variant: "bordered" },
  danger: { color: "danger", variant: "bordered" },
};

export interface MaoButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  color?: ButtonColor;
  variant?: ButtonVariant | ButtonVariantOld;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
}

export function MaoButton({
  color,
  variant = "solid",
  size = "md",
  loading = false,
  href,
  type = "button",
  className = "",
  disabled,
  children,
  ...rest
}: MaoButtonProps) {
  const old = OLD_VARIANTS[variant as ButtonVariantOld];
  const tone = color ?? old?.color ?? "neutral";
  const kind = old?.variant ?? variant;
  const cls = `mt-btn mt-btn-${kind} mt-btn-${tone} mt-btn-${size} ${className}`.trim();
  const inner = (
    <>
      {loading && <span className="mt-btn-spinner" aria-hidden="true" />}
      {children}
    </>
  );

  if (href !== undefined) {
    const external = /^https?:/i.test(href);
    return (
      <a
        className={cls}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button {...rest} type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined}>
      {inner}
    </button>
  );
}
