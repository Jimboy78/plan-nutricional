"use client";

import { useState, useCallback } from "react";
import { NAV, getTodayDayType, getDateKey } from "./data/plan";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DarkModeToggle } from "./ui/DarkModeToggle";
import { MacroSummaryBar } from "./ui/MacroSummaryBar";
import { PerfilMacros } from "./tabs/PerfilMacros";
import { Suplementos } from "./tabs/Suplementos";
import { PlanPorDia } from "./tabs/PlanPorDia";
import { BatchCooking } from "./tabs/BatchCooking";
import { ListaCompras } from "./tabs/ListaCompras";

// Selected options: { "basquet_3": 1, "gimnasio_4": 2 } → dayType_mealIndex: optionIndex
export type SelectedOptionsMap = Record<string, number>;

export default function PlanNutricional() {
  const [tab, setTab] = useState(0);
  const [diaActivo, setDiaActivo] = useState(getTodayDayType());
  const [batchTab, setBatchTab] = useState("proteina");

  // Meal checklist: { basquet: [0,2], gimnasio: [1], descanso: [] }
  const dateKey = getDateKey();
  const [checkedMealsMap, setCheckedMealsMap] = useLocalStorage<Record<string, number[]>>(
    `nutri_meals_${dateKey}`, {}
  );

  const checkedMeals = checkedMealsMap[diaActivo] || [];
  const toggleMeal = useCallback((index: number) => {
    setCheckedMealsMap(prev => {
      const current = prev[diaActivo] || [];
      const next = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];
      return { ...prev, [diaActivo]: next };
    });
  }, [diaActivo, setCheckedMealsMap]);

  // Selected meal options (persisted per date)
  const [selectedOptions, setSelectedOptions] = useLocalStorage<SelectedOptionsMap>(
    `nutri_opciones_${dateKey}`, {}
  );

  const selectOption = useCallback((dayType: string, mealIndex: number, optionIndex: number) => {
    const key = `${dayType}_${mealIndex}`;
    setSelectedOptions(prev => ({ ...prev, [key]: optionIndex }));
  }, [setSelectedOptions]);

  // Shopping checklist
  const [shoppingChecked, setShoppingChecked] = useLocalStorage<string[]>("nutri_shopping_checked", []);
  const toggleShoppingItem = useCallback((name: string) => {
    setShoppingChecked(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  }, [setShoppingChecked]);
  const resetShopping = useCallback(() => setShoppingChecked([]), [setShoppingChecked]);

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "var(--bg-page)", minHeight: "100vh", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "var(--header-gradient)", padding: "24px 20px 18px", color: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Sebastian Martini</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Pivot - Union de Arroyo Seco</div>
            </div>
            <DarkModeToggle />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {([["95 kg", "Peso"], ["1.85 m", "Altura"], ["25 anos", "Edad"], ["Basquet + Gym", "Actividad"]] as const).map(([v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "5px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "var(--bg-card)", borderBottom: "2px solid var(--border)", overflowX: "auto" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex" }}>
          {NAV.map((n, i) => (
            <button key={n} onClick={() => setTab(i)} style={{ padding: "13px 16px", border: "none", background: "none", cursor: "pointer", fontWeight: tab === i ? 700 : 500, color: tab === i ? "#e87722" : "var(--text-secondary)", borderBottom: tab === i ? "3px solid #e87722" : "3px solid transparent", whiteSpace: "nowrap", fontSize: 13 }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Summary Bar */}
      <MacroSummaryBar checkedMealsMap={checkedMealsMap} selectedOptions={selectedOptions} />

      {/* Tab Content */}
      <div style={{ maxWidth: 820, margin: "20px auto", padding: "0 14px" }}>
        {tab === 0 && <PerfilMacros />}
        {tab === 1 && <Suplementos />}
        {tab === 2 && <PlanPorDia diaActivo={diaActivo} setDiaActivo={setDiaActivo} checkedMeals={checkedMeals} toggleMeal={toggleMeal} selectedOptions={selectedOptions} selectOption={selectOption} />}
        {tab === 3 && <BatchCooking batchTab={batchTab} setBatchTab={setBatchTab} />}
        {tab === 4 && <ListaCompras checkedItems={shoppingChecked} toggleItem={toggleShoppingItem} resetAll={resetShopping} />}
      </div>
    </div>
  );
}
