import type { ReactNode } from "react";

export function Demo({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="demo">
      <div className="demo-stage">{children}</div>
      <details className="demo-code">
        <summary>Code</summary>
        <pre>{code}</pre>
      </details>
    </div>
  );
}
