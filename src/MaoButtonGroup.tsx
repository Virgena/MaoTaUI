import type { HTMLAttributes, ReactNode } from "react";

export interface MaoButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
}

export function MaoButtonGroup({
  orientation = "horizontal",
  className = "",
  children,
  ...rest
}: MaoButtonGroupProps) {
  return (
    <div role="group" className={`mt-btn-group mt-btn-group-${orientation} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
