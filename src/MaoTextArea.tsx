import type { ReactNode, TextareaHTMLAttributes } from "react";

export interface MaoTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

export function MaoTextArea({ label, className = "", rows = 3, ...rest }: MaoTextAreaProps) {
  return (
    <label className={`mt-field ${className}`.trim()}>
      {label ? <span className="mt-field-label">{label}</span> : null}
      <textarea className="mt-textarea" rows={rows} {...rest} />
    </label>
  );
}
