"use client";

import { useEffect, useState } from "react";
import { PLAN, DAY_STYLE, getTodayDayType, getDayTypeFor, getDateKey, getDateKeyFor, getMealMacros } from "../data/plan";
import type { Macros } from "../data/plan";
import type { SelectedOptionsMap } from "../PlanNutricional";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MacroRing } from "../ui/MacroRing";
import { Confetti } from "../ui/Confetti";

interface Props {
  checkedMealsMap: Record<string, number[]>;
  selectedOptions: SelectedOptionsMap;
  onGoToPlan: () => void;
}

const WATER_GOAL = 10; // vasos de 250ml
const WEEK = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const toMinutes = (hora: string) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hora);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

function formatIn(mins: number) {
  if (mins <= 0) return "ahora";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `en ${h}h ${m.toString().padStart(2, "0")}m` : `en ${m} min`;
}

function greeting(hour: number) {
  if (hour < 12) return "Buen dia";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

/** Consecutive past days (before today) where every meal of that day's plan was checked. */
function computeStreak(): number {
  let streak = 0;
  for (let i = 1; i <= 90; i++) {
    const d = new Date(Date.now() - i * 86400000);
    const type = getDayTypeFor(d);
    try {
      const map = JSON.parse(localStorage.getItem(`nutri_meals_${getDateKeyFor(d)}`) ?? "{}") as Record<string, number[]>;
      if ((map[type]?.length ?? 0) >= PLAN[type].comidas.length) streak++;
      else break;
    } catch {
      break;
    }
  }
  return streak;
}

export function Hoy({ checkedMealsMap, selectedOptions, onGoToPlan }: Props) {
  const dayType = getTodayDayType();
  const plan = PLAN[dayType];
  const style = DAY_STYLE[dayType];
  const checked = checkedMealsMap[dayType] || [];

  const [now, setNow] = useState<Date | null>(null);
  const [pastStreak, setPastStreak] = useState(0);
  const [water, setWater] = useLocalStorage<number>(`nutri_agua_${getDateKey()}`, 0);

  useEffect(() => {
    setNow(new Date());
    setPastStreak(computeStreak());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const consumed: Macros = { kcal: 0, cho: 0, pro: 0, fat: 0 };
  checked.forEach((i) => {
    const c = plan.comidas[i];
    if (!c) return;
    const m = getMealMacros(c, selectedOptions[`${dayType}_${i}`]);
    consumed.kcal += m.kcal;
    consumed.cho += m.cho;
    consumed.pro += m.pro;
    consumed.fat += m.fat;
  });

  const done = checked.length >= plan.comidas.length;
  const streak = pastStreak + (done ? 1 : 0);
  const pctMeals = Math.round((checked.length / plan.comidas.length) * 100);

  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const next = plan.comidas
    .map((c, i) => ({ c, i, t: toMinutes(c.hora) }))
    .find(({ i, t }) => !checked.includes(i) && (t === null || t >= nowMin - 45));

  const todayIdx = now ? (now.getDay() + 6) % 7 : -1;
  const maxKcal = Math.max(PLAN.basquet.kcal, PLAN.gimnasio.kcal, PLAN.descanso.kcal);

  return (
    <div className="hoy">
      {done && <Confetti />}

      <section className="hoy-hero card-pop" style={{ ["--day" as string]: style.color }}>
        <div>
          <p className="eyebrow">{now ? greeting(now.getHours()) : "Hola"}, Sebastian</p>
          <h2 className="display">
            Hoy es dia de {style.label} <span className="bounce">{style.emoji}</span>
          </h2>
          <p className="muted">{plan.detalle}</p>
        </div>
        <div className="hoy-hero__stats">
          <div className="stat">
            <strong>{plan.kcal}</strong>
            <span>kcal objetivo</span>
          </div>
          <div className="stat">
            <strong>
              {checked.length}/{plan.comidas.length}
            </strong>
            <span>comidas</span>
          </div>
          <div className={`stat ${streak > 0 ? "stat--fire" : ""}`}>
            <strong>{streak}🔥</strong>
            <span>dias de racha</span>
          </div>
        </div>
        <div className="progress">
          <span style={{ width: `${pctMeals}%` }} />
        </div>
      </section>

      {done && (
        <section className="banner card-pop">
          🏆 <strong>Dia completo.</strong> Todas las comidas registradas — así se construye un pivot.
        </section>
      )}

      <section className="panel card-pop" style={{ animationDelay: "80ms" }}>
        <h3 className="panel__title">Macros consumidos</h3>
        <div className="rings">
          <MacroRing label="kcal" current={consumed.kcal} target={plan.kcal} color="#e87722" unit="" />
          <MacroRing label="Carbos" current={consumed.cho} target={plan.cho} color="#3b82f6" />
          <MacroRing label="Proteina" current={consumed.pro} target={plan.pro} color="#22c55e" />
          <MacroRing label="Grasas" current={consumed.fat} target={plan.fat} color="#f59e0b" />
        </div>
      </section>

      <div className="hoy-grid">
        <section className="panel card-pop" style={{ animationDelay: "140ms" }}>
          <h3 className="panel__title">Proxima comida</h3>
          {next ? (
            <div className="next-meal">
              <div className="next-meal__time">
                <span>{next.c.hora}</span>
                {next.t !== null && now && <em>{formatIn(next.t - nowMin)}</em>}
              </div>
              <div>
                <strong>{next.c.nom}</strong>
                <p className="muted">
                  {next.c.opciones && selectedOptions[`${dayType}_${next.i}`] !== undefined
                    ? next.c.opciones[selectedOptions[`${dayType}_${next.i}`]].desc
                    : next.c.desc}
                </p>
                <button className="btn-primary" onClick={onGoToPlan}>
                  Ver plan del dia →
                </button>
              </div>
            </div>
          ) : (
            <p className="muted">{done ? "Nada pendiente. A descansar y recuperar 💤" : "Sin comidas pendientes por ahora."}</p>
          )}
        </section>

        <section className="panel card-pop" style={{ animationDelay: "200ms" }}>
          <div className="panel__row">
            <h3 className="panel__title">Hidratacion</h3>
            <span className="muted">
              {(water * 0.25).toFixed(2).replace(/\.?0+$/, "")} / {WATER_GOAL * 0.25} L
            </span>
          </div>
          <div className="water">
            {Array.from({ length: WATER_GOAL }, (_, i) => (
              <button
                key={i}
                className={`glass ${i < water ? "glass--full" : ""}`}
                onClick={() => setWater(i < water ? i : i + 1)}
                aria-label={`${i + 1} vasos`}
              >
                <span />
              </button>
            ))}
          </div>
          <p className="muted small">Tocá un vaso para marcarlo. Se reinicia cada dia.</p>
        </section>
      </div>

      <section className="panel card-pop" style={{ animationDelay: "260ms" }}>
        <h3 className="panel__title">Semana de entrenamiento</h3>
        <div className="week">
          {WEEK.map((d, i) => {
            const type = i === 6 ? "descanso" : [0, 2, 4].includes(i) ? "basquet" : "gimnasio";
            const s = DAY_STYLE[type];
            const kcal = PLAN[type].kcal;
            return (
              <div key={d} className={`week__day ${i === todayIdx ? "week__day--today" : ""}`}>
                <span className="week__kcal">{kcal}</span>
                <div className="week__bar">
                  <span style={{ height: `${(kcal / maxKcal) * 100}%`, background: s.color, animationDelay: `${i * 60}ms` }} />
                </div>
                <span className="week__emoji">{s.emoji}</span>
                <span className="week__label">{d}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
