"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Confetti } from "../ui/Confetti";
import type { Scheduled, SessionPlan } from "./schedule";

export interface CookSession {
  ids: string[];
  startedAt: number;
  pausedAt: number | null;
  pausedMs: number;
}

interface Props {
  plan: SessionPlan;
  session: CookSession;
  onChange: (session: CookSession | null) => void;
  onMinimize: () => void;
}

interface Alert {
  id: number;
  kind: "start" | "end";
  text: string;
}

type WakeSentinel = { release: () => Promise<void>; addEventListener: (type: "release", cb: () => void) => void };
type WakeNavigator = Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeSentinel> } };

const MIN = 60000;
const START_VERB = { horno: "Meter al horno", hornalla: "Arrancar", mesada: "Preparar" } as const;
const END_VERB = { horno: "Sacar del horno", hornalla: "Apagar", mesada: "Listo" } as const;

function clock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

function beep(ctx: AudioContext | null, kind: Alert["kind"]) {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const tones = kind === "end" ? [880, 880, 1175] : [660, 880];
  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = t0 + i * 0.18;
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  });
}

function TaskRow({ s, elapsed, state }: { s: Scheduled; elapsed: number; state: "active" | "next" | "done" }) {
  const startMs = s.start * MIN;
  const endMs = s.end * MIN;
  const progress = state === "done" ? 1 : state === "next" ? 0 : (elapsed - startMs) / (endMs - startMs);
  const r = 23;
  const c = 2 * Math.PI * r;

  return (
    <div className={`cook-task cook-task--${state}`}>
      <div className="cook-task__ring">
        <svg viewBox="0 0 54 54" aria-hidden="true">
          <circle className="track" cx="27" cy="27" r={r} />
          <circle className="bar" cx="27" cy="27" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
        </svg>
        <span>{state === "done" ? "✓" : state === "active" ? clock(endMs - elapsed) : `${s.task.minutes}'`}</span>
      </div>
      <div className="cook-task__body">
        <strong>{s.task.item.nom}</strong>
        <small>
          {state === "next" ? START_VERB[s.task.station] : state === "active" ? END_VERB[s.task.station] + " al terminar" : "Terminado"} ·{" "}
          {s.where}
        </small>
      </div>
      {state === "next" && <span className="cook-task__when">{clock(startMs - elapsed)}</span>}
    </div>
  );
}

export function CookMode({ plan, session, onChange, onMinimize }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [sound, setSound] = useState(true);
  const [awake, setAwake] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const prevElapsed = useRef<number | null>(null);
  const alertId = useRef(0);

  const paused = session.pausedAt !== null;
  const elapsed = Math.max(0, (session.pausedAt ?? now) - session.startedAt - session.pausedMs);
  const totalMs = plan.total * MIN;
  const finished = totalMs > 0 && elapsed >= totalMs;

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioRef.current = new Ctx();
    }
    if (audioRef.current.state === "suspended") void audioRef.current.resume();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    ensureAudio();
    return () => {
      void audioRef.current?.close();
      audioRef.current = null;
    };
  }, [ensureAudio]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keep the screen on while cooking (re-acquired when the tab becomes visible again).
  useEffect(() => {
    let lock: WakeSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      const wake = (navigator as WakeNavigator).wakeLock;
      if (!wake || document.visibilityState !== "visible") return;
      try {
        lock = await wake.request("screen");
        if (cancelled) {
          void lock.release();
          return;
        }
        setAwake(true);
        lock.addEventListener("release", () => setAwake(false));
      } catch {
        setAwake(false);
      }
    };
    void request();
    const onVisible = () => {
      if (document.visibilityState === "visible") void request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release().catch(() => undefined);
    };
  }, []);

  // Fire alerts for every start/end the clock crossed since the previous tick.
  useEffect(() => {
    const prev = prevElapsed.current;
    prevElapsed.current = elapsed;
    if (prev === null || elapsed <= prev) return;

    const fresh: Alert[] = [];
    for (const s of plan.scheduled) {
      const startMs = s.start * MIN;
      const endMs = s.end * MIN;
      if (startMs > 0 && prev < startMs && startMs <= elapsed) {
        fresh.push({ id: ++alertId.current, kind: "start", text: `${START_VERB[s.task.station]}: ${s.task.item.nom} · ${s.where}` });
      }
      if (prev < endMs && endMs <= elapsed) {
        fresh.push({ id: ++alertId.current, kind: "end", text: `${END_VERB[s.task.station]}: ${s.task.item.nom}` });
      }
    }
    if (!fresh.length) return;

    const hasEnd = fresh.some((f) => f.kind === "end");
    setAlerts((a) => [...fresh, ...a].slice(0, 4));
    if (sound) beep(audioRef.current, hasEnd ? "end" : "start");
    navigator.vibrate?.(hasEnd ? [300, 120, 300, 120, 300] : [150, 80, 150]);
    fresh.forEach((f) => setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== f.id)), 9000));
  }, [elapsed, plan, sound]);

  const pause = () => onChange({ ...session, pausedAt: Date.now() });
  const resume = () => {
    ensureAudio();
    onChange({ ...session, pausedAt: null, pausedMs: session.pausedMs + (Date.now() - (session.pausedAt ?? Date.now())) });
  };

  const active = plan.scheduled.filter((s) => elapsed >= s.start * MIN && elapsed < s.end * MIN).sort((a, b) => a.end - b.end);
  const upcoming = plan.scheduled.filter((s) => elapsed < s.start * MIN);
  const done = plan.scheduled.filter((s) => elapsed >= s.end * MIN);

  const progress = totalMs ? Math.min(1, elapsed / totalMs) : 0;
  const r = 80;
  const c = 2 * Math.PI * r;

  return (
    <div className={`cook ${paused ? "cook--paused" : ""}`} role="dialog" aria-modal="true" aria-label="Modo cocina" onPointerDown={ensureAudio}>
      {finished && <Confetti />}
      <div className="cook__alerts" aria-live="assertive">
        {alerts.map((a) => (
          <div key={a.id} className={`cook-alert cook-alert--${a.kind}`}>
            <span aria-hidden="true">{a.kind === "end" ? "⏰" : "👨‍🍳"}</span>
            {a.text}
          </div>
        ))}
      </div>

      <div className="cook__inner">
        <header className="cook__top">
          <div>
            <p className="eyebrow">Modo cocina</p>
            <h2 className="display">{finished ? "¡Todo listo! 🎉" : paused ? "En pausa" : "Domingo de batch"}</h2>
          </div>
          <div className="cook__tools">
            {awake && <span className="cook__awake">🔆 Pantalla siempre encendida</span>}
            <button className="cook__btn" onClick={() => setSound((v) => !v)} aria-label={sound ? "Silenciar alarmas" : "Activar alarmas"}>
              {sound ? "🔔" : "🔕"}
            </button>
            <button className="cook__btn" onClick={onMinimize}>
              Minimizar
            </button>
            <button className="cook__btn" onClick={() => onChange(null)}>
              Terminar
            </button>
          </div>
        </header>

        <section className="cook__clock">
          <div className="cook__ring">
            <svg viewBox="0 0 190 190" aria-hidden="true">
              <defs>
                <linearGradient id="cookGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffb877" />
                  <stop offset="1" stopColor="#e87722" />
                </linearGradient>
              </defs>
              <circle className="track" cx="95" cy="95" r={r} />
              <circle className="bar" cx="95" cy="95" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
            </svg>
            <div className="cook__ring-center">
              <strong>{clock(finished ? totalMs : elapsed)}</strong>
              <span>de {plan.total} min</span>
            </div>
          </div>

          <div className="cook__summary">
            <div className="cook__facts">
              <span className="cook__fact">
                <b>{finished ? 0 : clock(totalMs - elapsed)}</b> restante
              </span>
              <span className="cook__fact">
                <b>{done.length}</b>/{plan.scheduled.length} listas
              </span>
              <span className="cook__fact">
                <b>{plan.tuppers}</b> tuppers
              </span>
            </div>
            <p className="muted">
              Las alarmas suenan al empezar y al terminar cada preparación. Podés minimizar: el reloj sigue corriendo aunque recargues la página.
            </p>
            <div className="cook__tools">
              {finished ? (
                <button className="cook__btn cook__btn--main" onClick={() => onChange(null)}>
                  Guardar tuppers y cerrar
                </button>
              ) : paused ? (
                <button className="cook__btn cook__btn--main" onClick={resume}>
                  ▶ Reanudar
                </button>
              ) : (
                <button className="cook__btn cook__btn--main" onClick={pause}>
                  ❚❚ Pausar
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="cook__cols">
          <section className="cook__col">
            <h3>🔥 Ahora</h3>
            {active.length ? (
              active.map((s) => <TaskRow key={s.task.id} s={s} elapsed={elapsed} state="active" />)
            ) : (
              <p className="cook__empty">{finished ? "Nada en el fuego." : "Nada cocinándose — mirá lo próximo."}</p>
            )}
          </section>
          <section className="cook__col">
            <h3>⏭ Próximo</h3>
            {upcoming.length ? (
              upcoming.slice(0, 6).map((s) => <TaskRow key={s.task.id} s={s} elapsed={elapsed} state="next" />)
            ) : (
              <p className="cook__empty">Todo ya arrancó.</p>
            )}
          </section>
          <section className="cook__col">
            <h3>✅ Listo</h3>
            {done.length ? (
              done.map((s) => <TaskRow key={s.task.id} s={s} elapsed={elapsed} state="done" />)
            ) : (
              <p className="cook__empty">Todavía nada terminado.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
