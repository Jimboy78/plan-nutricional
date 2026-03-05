import { SUPLEMENTOS } from "../data/plan";
import { TAG } from "../ui/TAG";

export function Suplementos() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {SUPLEMENTOS.map(s => (
        <div key={s.nom} style={{ background: "var(--bg-card)", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${s.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{s.nom}</div>
            <TAG c="var(--tag-green-bg)">Tomando</TAG>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13, marginBottom: 8 }}>
            <div><span style={{ color: "var(--text-muted)" }}>Dosis: </span><strong style={{ color: "var(--text-secondary)" }}>{s.dosis}</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Cuando: </span><strong style={{ color: "var(--text-secondary)" }}>{s.timing}</strong></div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-card-alt)", padding: "7px 10px", borderRadius: 6 }}>{s.nota}</div>
        </div>
      ))}
    </div>
  );
}
