import { PLAN, getMealMacros } from "../data/plan";
import type { SelectedOptionsMap } from "../PlanNutricional";

interface Props {
  diaActivo: string;
  setDiaActivo: (d: string) => void;
  checkedMeals: number[];
  toggleMeal: (index: number) => void;
  selectedOptions: SelectedOptionsMap;
  selectOption: (dayType: string, mealIndex: number, optionIndex: number) => void;
}

export function PlanPorDia({ diaActivo, setDiaActivo, checkedMeals, toggleMeal, selectedOptions, selectOption }: Props) {
  const plan = PLAN[diaActivo];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {([["basquet", "🏀 Basquet", "#1e4a8a"], ["gimnasio", "💪 Gimnasio", "#e87722"], ["descanso", "😴 Descanso", "#6b7280"]] as const).map(([k, l, c]) => (
          <button key={k} onClick={() => setDiaActivo(k as string)} style={{ padding: "7px 16px", borderRadius: 20, border: `2px solid ${diaActivo === k ? c : "var(--border)"}`, background: diaActivo === k ? c : "var(--bg-card)", color: diaActivo === k ? "#fff" : "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: 10, padding: 14, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{plan.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{plan.detalle}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {([["kcal", plan.kcal, "#e87722"], ["CHO", plan.cho + "g", "#3b82f6"], ["PRO", plan.pro + "g", "#22c55e"], ["FAT", plan.fat + "g", "#f59e0b"]] as [string, string | number, string][]).map(([l, v, c]) => (
              <div key={l} style={{ background: "var(--bg-card-alt)", borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {plan.comidas.map((c, i) => {
          const checked = checkedMeals.includes(i);
          const optKey = `${diaActivo}_${i}`;
          const selectedOpt = selectedOptions[optKey];
          const macros = getMealMacros(c, selectedOpt);
          const hasOptions = c.opciones && c.opciones.length > 1;
          const activeDesc = (hasOptions && selectedOpt !== undefined && c.opciones)
            ? c.opciones[selectedOpt].desc
            : c.desc;

          return (
            <div key={i} style={{ background: "var(--bg-card)", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: checked ? "2px solid #22c55e" : "2px solid transparent", transition: "all 0.2s", opacity: checked ? 0.7 : 1 }}>
              {/* Main meal row */}
              <div
                onClick={() => toggleMeal(i)}
                style={{ display: "flex", gap: 12, cursor: "pointer", padding: 14 }}
              >
                {/* Checkbox */}
                <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 2 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: checked ? "2px solid #22c55e" : "2px solid var(--border)",
                    background: checked ? "#22c55e" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    {checked && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
                <div style={{ minWidth: 58, textAlign: "center", paddingTop: 2 }}>
                  <div style={{ background: "var(--text-primary)", color: "#fff", borderRadius: 8, padding: "4px 6px", fontSize: 11, fontWeight: 700 }}>{c.hora}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13, marginBottom: 4 }}>
                    {c.nom}
                    {hasOptions && <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400, marginLeft: 6 }}>({c.opciones!.length} opciones)</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: checked ? "line-through" : "none" }}>{activeDesc}</div>
                  {macros.kcal > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#e87722", fontWeight: 600 }}>{macros.kcal} kcal</span>
                      <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>C:{macros.cho}g</span>
                      <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>P:{macros.pro}g</span>
                      <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>G:{macros.fat}g</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Options selector */}
              {hasOptions && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "8px 14px 10px" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Elegir opcion:</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {c.opciones!.map((opt, oi) => {
                      const isSelected = selectedOpt === oi || (selectedOpt === undefined && opt.desc === c.desc);
                      return (
                        <button
                          key={oi}
                          onClick={(e) => { e.stopPropagation(); selectOption(diaActivo, i, oi); }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: isSelected ? "2px solid #e87722" : "1px solid var(--border)",
                            background: isSelected ? "var(--bg-card-alt)" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            {isSelected && <span style={{ color: "#e87722", fontWeight: 700, marginRight: 4 }}>●</span>}
                            {opt.desc}
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0, fontSize: 10, opacity: 0.8 }}>
                            <span style={{ color: "#e87722", fontWeight: 600 }}>{opt.macros.kcal}</span>
                            <span style={{ color: "#3b82f6" }}>C:{opt.macros.cho}</span>
                            <span style={{ color: "#22c55e" }}>P:{opt.macros.pro}</span>
                            <span style={{ color: "#f59e0b" }}>G:{opt.macros.fat}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
