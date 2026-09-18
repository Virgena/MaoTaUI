import { useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { MaoButton } from "./MaoButton.tsx";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./MaoButton.tsx";
import { MaoIcon } from "./MaoIcon.tsx";

export interface MaoCopyProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children"> {
  text: string;
  name?: string;
  copiedText?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function MaoCopy({
  text,
  name = "",
  copiedText = "Copied",
  color = "primary",
  variant = "light",
  size = "md",
  className = "",
  onClick,
  ...rest
}: MaoCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    navigator.clipboard?.writeText(text)?.then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  };

  return (
    <MaoButton
      {...rest}
      color={color}
      variant={variant}
      size={size}
      className={`${name ? "" : "mt-btn-icon"} ${className}`.trim()}
      aria-label={copied ? copiedText : name || "Copy"}
      onClick={handleClick}
    >
      {name ? (copied ? copiedText : name) : null}
      <MaoIcon name={copied ? "check" : "copy"} />
    </MaoButton>
  );
}
