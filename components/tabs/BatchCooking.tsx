"use client";

import { useMemo, useState } from "react";
import { BATCH, BATCH_TABS } from "../data/plan";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { TASK_BY_ID, planSession, taskId, type SessionPlan, type Station } from "../batch/schedule";
import { CookMode, type CookSession } from "../batch/CookMode";

interface Props {
  batchTab: string;
  setBatchTab: (t: string) => void;
}

const STATION_LABEL: Record<Station, string> = { horno: "🔥 Horno", hornalla: "🍳 Hornalla", mesada: "🔪 Mesada" };
const START_VERB: Record<Station, string> = { horno: "Meter al horno", hornalla: "Arrancar", mesada: "Preparar" };

// A typical week: two proteins, two carbs, two vegetables.
const PRESET = [
  "proteina|Pollo al horno en cubos",
  "proteina|Huevos duros batch",
  "carbo|Arroz blanco",
  "carbo|Papa y batata al horno",
  "verdura|Verduras grilladas mixtas",
  "verdura|Brocoli/Coliflor al vapor",
];

function Gantt({ plan }: { plan: SessionPlan }) {
  const step = plan.total > 90 ? 30 : plan.total > 40 ? 15 : 5;
  const ticks = Array.from({ length: Math.floor(plan.total / step) + 1 }, (_, i) => i * step);
  const pct = (m: number) => `${(m / Math.max(1, plan.total)) * 100}%`;

  return (
    <div className="gantt" role="img" aria-label={`Sesión de ${plan.total} minutos en ${plan.lanes.length} estaciones`}>
      <div className="gantt__ticks" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t} style={{ left: pct(t) }}>
            {t}&apos;
          </span>
        ))}
      </div>
      {plan.lanes.map((lane) => (
        <div className="gantt__row" key={lane.id}>
          <span className="gantt__label">{lane.label}</span>
          <div className="gantt__track">
            {plan.scheduled
              .filter((s) => s.lane === lane.id)
              .map((s, i) => (
                <span
                  key={s.task.id}
                  className={`gantt__bar station--${s.task.station}`}
                  style={{ left: pct(s.start), width: pct(s.end - s.start), animationDelay: `${i * 90}ms` }}
                  title={`${s.task.item.nom} · ${s.where} · ${s.start}'–${s.end}'`}
                >
                  {s.task.item.nom}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BatchCooking({ batchTab, setBatchTab }: Props) {
  const batch = BATCH[batchTab];
  const [selected, setSelected] = useLocalStorage<string[]>("nutri_batch_sel", []);
  const [session, setSession] = useLocalStorage<CookSession | null>("nutri_batch_session", null);
  const [cookOpen, setCookOpen] = useState(false);

  const plan = useMemo(() => planSession(selected), [selected]);
  const sessionPlan = useMemo(() => (session ? planSession(session.ids) : null), [session]);
  const saved = plan.sequential - plan.total;

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const startCooking = () => {
    if (!session) {
      if (!selected.length) return;
      setSession({ ids: selected, startedAt: Date.now(), pausedAt: null, pausedMs: 0 });
    }
    setCookOpen(true);
  };

  const endSession = (next: CookSession | null) => {
    setSession(next);
    if (!next) setCookOpen(false);
  };

  return (
    <div className="batch">
      <section className="batch-hero card-pop">
        <div>
          <p className="eyebrow">Modo domingo</p>
          <h2 className="display">{plan.total ? `Cociná la semana en ${plan.total} min` : "Armá tu sesión de cocina"}</h2>
          <p className="muted">
            Elegí qué preparar y armamos el orden: horno y hornallas en paralelo para que todo termine junto. Después, el modo cocina te
            avisa cuándo meter y sacar cada cosa.
          </p>
        </div>

        <div className="batch-hero__stats">
          <div className="batch-stat">
            <strong>{selected.length}</strong>
            <span>preparaciones</span>
          </div>
          <div className="batch-stat">
            <strong>{plan.total}&apos;</strong>
            <span>de cocina</span>
          </div>
          <div className="batch-stat batch-stat--saved">
            <strong>{saved > 0 ? `-${saved}'` : "0'"}</strong>
            <span>vs. de a una</span>
          </div>
          <div className="batch-stat">
            <strong>{plan.tuppers}</strong>
            <span>tuppers aprox.</span>
          </div>
        </div>

        <div className="batch-hero__actions">
          <button className="btn-primary" onClick={startCooking} disabled={!session && !selected.length}>
            {session ? "▶ Volver a la cocina" : "👨‍🍳 Empezar a cocinar"}
          </button>
          <button className="btn-ghost" onClick={() => setSelected(PRESET)}>
            ✨ Semana típica
          </button>
          {selected.length > 0 && (
            <button className="btn-ghost" onClick={() => setSelected([])}>
              Limpiar
            </button>
          )}
          {session && !cookOpen && <span className="batch-live">● Sesión en curso</span>}
        </div>
      </section>

      <div className="batch-flow">
        <strong>Flujo del domingo:</strong> Cocinás todo en bulk → pesás en crudo primero → porcionás en tuppers etiquetados → Lun-Jue a la
        heladera, Vie-Dom al freezer.
      </div>

      <div className="batch-tabs" role="tablist">
        {BATCH_TABS.map((t) => {
          const count = selected.filter((id) => id.startsWith(`${t.key}|`)).length;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={batchTab === t.key}
              className={batchTab === t.key ? "on" : ""}
              style={{ ["--tab" as string]: t.color }}
              onClick={() => setBatchTab(t.key)}
            >
              {t.label}
              {count > 0 && <b>{count}</b>}
            </button>
          );
        })}
      </div>

      <section className="panel card-pop" key={batchTab}>
        <div className="panel__row batch-head">
          <h3 className="panel__title">{batch.col}</h3>
          <span className="muted">💡 {batch.tip}</span>
        </div>
        <div className="batch-grid">
          {batch.items.map((it, i) => {
            const id = taskId(batchTab, it.nom);
            const task = TASK_BY_ID.get(id);
            const on = selected.includes(id);
            return (
              <button
                key={id}
                className={`batch-card ${on ? "on" : ""}`}
                onClick={() => toggle(id)}
                aria-pressed={on}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <span className="batch-card__check" aria-hidden="true">
                  {on ? "✓" : "+"}
                </span>
                <span className="batch-card__body">
                  <strong>{it.nom}</strong>
                  <span className="muted">{it.prep}</span>
                  <span className="batch-card__tags">
                    {task && (
                      <em className={`batch-tag station station--${task.station}`}>
                        {STATION_LABEL[task.station]}
                        {task.temp ? ` ${task.temp}°` : ""}
                      </em>
                    )}
                    <em className="batch-tag">⏱ {it.tiempo}</em>
                    <em className="batch-tag">📦 {it.rinde}</em>
                    <em className="batch-tag batch-tag--soft">{it.cant}</em>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selected.length > 0 && (
        <section className="panel card-pop">
          <div className="panel__row">
            <h3 className="panel__title">Plan de la sesión</h3>
            <span className="muted">
              {plan.total} min · {plan.lanes.length} estaciones
            </span>
          </div>
          <Gantt plan={plan} />
          <ol className="batch-steps">
            {plan.scheduled.map((s) => (
              <li key={s.task.id}>
                <time>+{s.start}&apos;</time>
                <span>
                  {START_VERB[s.task.station]} <b>{s.task.item.nom}</b> · {s.where} · sale en el minuto {s.end}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {session && sessionPlan && cookOpen && (
        <CookMode plan={sessionPlan} session={session} onChange={endSession} onMinimize={() => setCookOpen(false)} />
      )}
    </div>
  );
}
