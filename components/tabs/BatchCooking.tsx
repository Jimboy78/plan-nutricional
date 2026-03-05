import { BATCH, BATCH_TABS } from "../data/plan";
import { TAG } from "../ui/TAG";

interface Props {
  batchTab: string;
  setBatchTab: (t: string) => void;
}

export function BatchCooking({ batchTab, setBatchTab }: Props) {
  const batch = BATCH[batchTab];

  return (
    <div>
      <div style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "var(--info-text)" }}>
        <strong>Flujo del domingo:</strong> Cocinas todo en bulk → pesas en crudo primero → porcionas en tuppers etiquetados → Lun-Jue a la heladera, Vie-Dom al freezer.
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {BATCH_TABS.map(t => (
          <button key={t.key} onClick={() => setBatchTab(t.key)} style={{ padding: "7px 16px", borderRadius: 20, border: `2px solid ${batchTab === t.key ? t.color : "var(--border)"}`, background: batchTab === t.key ? t.color : "var(--bg-card)", color: batchTab === t.key ? "#fff" : "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: 15, fontWeight: 800 }}>{batch.col}</h3>
          <div style={{ background: "var(--bg-card-alt)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "var(--text-secondary)" }}>💡 {batch.tip}</div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {batch.items.map(it => (
            <div key={it.nom} style={{ background: "var(--bg-card-alt)", borderRadius: 8, padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 12px", alignItems: "start" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13, marginBottom: 3 }}>{it.nom}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{it.prep}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <TAG c="var(--tag-blue-bg)">{it.cant}</TAG>
                <TAG c="var(--tag-green-bg)">⏱ {it.tiempo}</TAG>
                <TAG c="var(--tag-yellow-bg)">📦 {it.rinde}</TAG>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
