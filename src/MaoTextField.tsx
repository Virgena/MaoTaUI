import type { InputHTMLAttributes, ReactNode } from "react";

export interface MaoTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export function MaoTextField({ label, className = "", ...rest }: MaoTextFieldProps) {
  return (
    <label className={`mt-field ${className}`.trim()}>
      {label ? <span className="mt-field-label">{label}</span> : null}
      <input className="mt-input" {...rest} />
    </label>
  );
}
