import { PLAN, getTodayDayType, getMealMacros } from "../data/plan";
import type { Macros } from "../data/plan";
import type { SelectedOptionsMap } from "../PlanNutricional";

interface Props {
  checkedMealsMap: Record<string, number[]>;
  selectedOptions: SelectedOptionsMap;
}

export function MacroSummaryBar({ checkedMealsMap, selectedOptions }: Props) {
  const dayType = getTodayDayType();
  const plan = PLAN[dayType];
  const checkedIndices = checkedMealsMap[dayType] || [];

  const consumed: Macros = { kcal: 0, cho: 0, pro: 0, fat: 0 };
  checkedIndices.forEach(i => {
    if (plan.comidas[i]) {
      const optKey = `${dayType}_${i}`;
      const macros = getMealMacros(plan.comidas[i], selectedOptions[optKey]);
      consumed.kcal += macros.kcal;
      consumed.cho += macros.cho;
      consumed.pro += macros.pro;
      consumed.fat += macros.fat;
    }
  });

  const bars: { label: string; current: number; target: number; color: string; unit: string }[] = [
    { label: "kcal", current: consumed.kcal, target: plan.kcal, color: "#e87722", unit: "" },
    { label: "CHO", current: consumed.cho, target: plan.cho, color: "#3b82f6", unit: "g" },
    { label: "PRO", current: consumed.pro, target: plan.pro, color: "#22c55e", unit: "g" },
    { label: "FAT", current: consumed.fat, target: plan.fat, color: "#f59e0b", unit: "g" },
  ];

  const dayLabel = dayType === "basquet" ? "🏀 Basquet" : dayType === "gimnasio" ? "💪 Gimnasio" : "😴 Descanso";

  return (
    <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "10px 20px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>
          Hoy: {dayLabel} — {checkedIndices.length}/{plan.comidas.length} comidas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {bars.map(b => {
            const pct = b.target > 0 ? Math.min(100, (b.current / b.target) * 100) : 0;
            return (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, color: b.color }}>{b.label}</span>
                  <span style={{ color: "var(--text-muted)" }}>{b.current}/{b.target}{b.unit}</span>
                </div>
                <div style={{ background: "var(--border)", borderRadius: 99, height: 6 }}>
                  <div style={{ background: b.color, borderRadius: 99, height: 6, width: `${pct}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
