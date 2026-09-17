import type { ReactNode, TextareaHTMLAttributes } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

export function TextArea({ label, className = "", rows = 3, ...rest }: TextAreaProps) {
  return (
    <label className={`mt-field ${className}`.trim()}>
      {label ? <span className="mt-field-label">{label}</span> : null}
      <textarea className="mt-textarea" rows={rows} {...rest} />
    </label>
  );
}
