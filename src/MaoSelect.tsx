import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface MaoSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: ReactNode;
  options: readonly SelectOption[];
}

export function MaoSelect({ label, options, className = "", ...rest }: MaoSelectProps) {
  return (
    <label className={`mt-field ${className}`.trim()}>
      {label ? <span className="mt-field-label">{label}</span> : null}
      <span className="mt-select-wrap">
        <select className="mt-select" {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="mt-select-caret"
          viewBox="0 0 16 16"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 6.5L8 10l3.5-3.5" />
        </svg>
      </span>
    </label>
  );
}
