export function Crumbs({ group, label }: { group: string; label: string }) {
  return (
    <nav className="crumbs">
      <span>MaoTaUI</span>
      <span className="sep">/</span>
      <span>{group}</span>
      <span className="sep">/</span>
      <span className="now">{label}</span>
    </nav>
  );
}
