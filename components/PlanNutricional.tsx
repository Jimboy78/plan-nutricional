"use client";

import { useState, useCallback } from "react";
import { NAV, NAV_ICONS, getTodayDayType, getDateKey } from "./data/plan";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DarkModeToggle } from "./ui/DarkModeToggle";
import { MacroSummaryBar } from "./ui/MacroSummaryBar";
import { Logo } from "./ui/Logo";
import { Hoy } from "./tabs/Hoy";
import { PerfilMacros } from "./tabs/PerfilMacros";
import { Suplementos } from "./tabs/Suplementos";
import { PlanPorDia } from "./tabs/PlanPorDia";
import { BatchCooking } from "./tabs/BatchCooking";
import { ListaCompras } from "./tabs/ListaCompras";

// Selected options: { "basquet_3": 1, "gimnasio_4": 2 } → dayType_mealIndex: optionIndex
export type SelectedOptionsMap = Record<string, number>;

const TAB_PLAN = 3;

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

  const goToPlan = useCallback(() => {
    setDiaActivo(getTodayDayType());
    setTab(TAB_PLAN);
  }, []);

  return (
    <div className="app">

      {/* Header */}
      <header className="hero">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <div className="container">
          <div className="hero__top">
            <Logo size={52} />
            <div style={{ flex: 1 }}>
              <div className="brand">Plan <span>Nutricional</span></div>
              <div className="hero__sub">Sebastian Martini · Pivot — Union de Arroyo Seco</div>
            </div>
            <DarkModeToggle />
          </div>
          <div className="chips">
            {([["95 kg", "Peso"], ["1.85 m", "Altura"], ["25 anos", "Edad"], ["Basquet + Gym", "Actividad"]] as const).map(([v, l], i) => (
              <div key={l} className="chip" style={{ animationDelay: `${i * 70}ms` }}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="nav">
        <div className="container nav__inner">
          {NAV.map((n, i) => (
            <button key={n} onClick={() => setTab(i)} className={tab === i ? "on" : ""}>
              <span aria-hidden="true">{NAV_ICONS[i]}</span> {n}
            </button>
          ))}
        </div>
      </nav>

      {/* Macro Summary Bar (the Hoy tab already shows full rings) */}
      {tab !== 0 && <MacroSummaryBar checkedMealsMap={checkedMealsMap} selectedOptions={selectedOptions} />}

      {/* Tab Content */}
      <main key={tab} className="container tab-anim" style={{ margin: "20px auto", padding: "0 14px" }}>
        {tab === 0 && <Hoy checkedMealsMap={checkedMealsMap} selectedOptions={selectedOptions} onGoToPlan={goToPlan} />}
        {tab === 1 && <PerfilMacros />}
        {tab === 2 && <Suplementos />}
        {tab === 3 && <PlanPorDia diaActivo={diaActivo} setDiaActivo={setDiaActivo} checkedMeals={checkedMeals} toggleMeal={toggleMeal} selectedOptions={selectedOptions} selectOption={selectOption} />}
        {tab === 4 && <BatchCooking batchTab={batchTab} setBatchTab={setBatchTab} />}
        {tab === 5 && <ListaCompras checkedItems={shoppingChecked} toggleItem={toggleShoppingItem} resetAll={resetShopping} />}
      </main>

      <footer className="footer">Plan Nutricional · hecho con Next.js · datos guardados solo en este dispositivo</footer>
    </div>
  );
}
