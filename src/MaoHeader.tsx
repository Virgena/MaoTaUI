import type { ReactNode } from "react";

export interface MaoHeaderProps {
  name?: ReactNode;
  description?: ReactNode;
  scale?: "h1" | "h2" | "h3";
  end?: ReactNode;
  className?: string;
}

export function MaoHeader({ name, description, scale = "h1", end, className = "" }: MaoHeaderProps) {
  const Tag = scale as "h1" | "h2" | "h3";
  return (
    <div className={`mt-header mt-header-${scale} ${className}`.trim()}>
      <div className="mt-header-row">
        <Tag className="mt-header-title">{name}</Tag>
        {end ? <div className="mt-header-end">{end}</div> : null}
      </div>
      {description ? <p className="mt-header-desc">{description}</p> : null}
    </div>
  );
}
