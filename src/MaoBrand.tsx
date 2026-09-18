import type { ReactNode } from "react";
import { MaoBadge } from "./MaoBadge.tsx";

export interface MaoBrandProps {
  name: string;
  iconSrc?: string;
  iconAlt?: string;
  iconClass?: string;
  nameClass?: string;
  badge?: ReactNode;
  badgeColor?: "neutral" | "accent" | "danger";
  to?: string;
  className?: string;
}

export function MaoBrand({
  name,
  iconSrc,
  iconAlt = "",
  iconClass = "",
  nameClass = "",
  badge,
  badgeColor = "accent",
  to = "/",
  className = "",
}: MaoBrandProps) {
  return (
    <a className={`mt-brand ${className}`.trim()} href={to}>
      {iconSrc ? <img className={`mt-brand-img ${iconClass}`.trim()} src={iconSrc} alt={iconAlt} /> : null}
      <span className={`mt-brand-name ${nameClass}`.trim()}>{name}</span>
      {badge ? <MaoBadge tone={badgeColor}>{badge}</MaoBadge> : null}
    </a>
  );
}
