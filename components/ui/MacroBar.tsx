export function MacroBar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{val}g</span>
      </div>
      <div style={{ background: "var(--border)", borderRadius: 99, height: 8 }}>
        <div style={{ background: color, borderRadius: 99, height: 8, width: `${Math.min(100, (val / max) * 100)}%` }} />
      </div>
    </div>
  );
}
