import type { ButtonHTMLAttributes, CSSProperties, MouseEvent } from "react";
import { MaoIcon } from "./MaoIcon.tsx";
import type { IconName } from "./MaoIcon.tsx";
import { toneStyle } from "./color.ts";

export interface MaoReactionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "color"> {
  active?: boolean;
  count?: number;
  icon?: IconName;
  color?: string;
  label?: string;
  toggle?: boolean;
  onChange?: (active: boolean, count: number) => void;
  size?: "sm" | "md" | "lg";
}

export function MaoReaction({
  active = false,
  count,
  icon = "heart",
  color = "danger",
  label,
  toggle = true,
  onChange,
  size = "md",
  className = "",
  onClick,
  children,
  ...rest
}: MaoReactionProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !toggle) return;
    onChange?.(!active, count === undefined ? 0 : count + (active ? -1 : 1));
  };
  const name = label ?? (typeof children === "string" ? children : "Reaction");

  return (
    <button
      {...rest}
      type="button"
      className={`mt-reaction mt-reaction-${size}${active ? " is-on" : ""} ${className}`.trim()}
      style={toneStyle(color) as CSSProperties}
      aria-pressed={toggle ? active : undefined}
      aria-label={count === undefined ? name : `${name} ${count}`}
      onClick={handleClick}
    >
      <MaoIcon name={icon} size={14} />
      {children}
      {count === undefined ? null : <span className="mt-reaction-count">{count}</span>}
    </button>
  );
}
