import type { InputHTMLAttributes, ReactNode } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export function TextField({ label, className = "", ...rest }: TextFieldProps) {
  return (
    <label className={`mt-field ${className}`.trim()}>
      {label ? <span className="mt-field-label">{label}</span> : null}
      <input className="mt-input" {...rest} />
    </label>
  );
}
