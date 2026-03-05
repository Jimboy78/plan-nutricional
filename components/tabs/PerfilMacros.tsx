import { MacroBar } from "../ui/MacroBar";

export function PerfilMacros() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>BMR calculado (Mifflin-St Jeor): <strong>1.986 kcal</strong></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
          {[
            { tipo: "Dia de Basquet", sub: "Lun / Mie / Vie", kcal: 3400, cho: 450, pro: 180, fat: 100, color: "#1e4a8a", factor: "x1.75" },
            { tipo: "Dia de Gimnasio", sub: "Mar / Jue / Sab", kcal: 3100, cho: 390, pro: 180, fat: 90, color: "#e87722", factor: "x1.6" },
            { tipo: "Dia de Descanso", sub: "Domingo", kcal: 2700, cho: 320, pro: 175, fat: 80, color: "#6b7280", factor: "x1.375" },
          ].map(d => (
            <div key={d.tipo} style={{ border: `2px solid ${d.color}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>{d.tipo}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{d.sub} - {d.factor}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>{d.kcal} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>kcal</span></div>
              <MacroBar label="Carbohidratos" val={d.cho} max={500} color="#3b82f6" />
              <MacroBar label="Proteinas" val={d.pro} max={220} color="#22c55e" />
              <MacroBar label="Grasas" val={d.fat} max={130} color="#f59e0b" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de carbos por dia */}
      <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15, marginBottom: 4 }}>Cantidad de carbohidrato por tipo de dia</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Pesas siempre en crudo. Proteina y verdura no cambian (150g cocido cada una).</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-page)" }}>
                {["Carbohidrato", "🏀 Basquet", "💪 Gimnasio", "😴 Descanso"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "var(--text-primary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Arroz (cualquier tipo)", "150g crudo", "120g crudo", "80g crudo"],
                ["Papa / Batata", "200g crudo", "170g crudo", "120g crudo"],
                ["Fideos", "90g crudo", "75g crudo", "55g crudo"],
                ["Quinoa", "130g crudo", "100g crudo", "70g crudo"],
              ].map((r, i) => (
                <tr key={r[0]} style={{ background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-card-alt)" }}>
                  {r.map((c, j) => (
                    <td key={j} style={{ padding: "8px 12px", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400 }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "var(--info-text)" }}>
          La proteina y la verdura son iguales todos los dias: <strong>150g cocido por tupper</strong>. Solo el carbo cambia.
        </div>
      </div>
    </div>
  );
}
