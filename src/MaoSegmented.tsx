import type { SelectOption } from "./MaoSelect.tsx";

export interface MaoSegmentedProps {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function MaoSegmented({ options, value, onChange, label, className = "" }: MaoSegmentedProps) {
  return (
    <div className={`mt-segmented ${className}`.trim()} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`mt-segmented-item${option.value === value ? " is-on" : ""}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
