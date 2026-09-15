import { BATCH, BATCH_TABS, type BatchItem } from "../data/plan";

export type Station = "horno" | "hornalla" | "mesada";

export interface BatchTask {
  id: string;
  cat: string;
  item: BatchItem;
  minutes: number;
  station: Station;
  temp?: number;
  tuppers: number;
}

export interface Scheduled {
  task: BatchTask;
  lane: string;
  where: string;
  start: number; // minutes from session start
  end: number;
}

export interface SessionPlan {
  scheduled: Scheduled[];
  lanes: { id: string; label: string }[];
  total: number; // minutes with parallel stations
  sequential: number; // minutes if cooked one after another
  tuppers: number;
}

const OVEN_TRAYS = 3;
const BURNERS = 2;

const LANE_LABEL: Record<string, string> = {
  "horno-1": "🔥 Horno · bandeja 1",
  "horno-2": "🔥 Horno · bandeja 2",
  "horno-3": "🔥 Horno · bandeja 3",
  "hornalla-1": "🍳 Hornalla 1",
  "hornalla-2": "🍳 Hornalla 2",
  mesada: "🔪 Mesada",
};
const LANE_ORDER = Object.keys(LANE_LABEL);

export const taskId = (cat: string, nom: string) => `${cat}|${nom}`;

/** Derives station, oven temperature, duration and tupper yield from the free-text plan data. */
export function toTask(cat: string, item: BatchItem): BatchTask {
  const parsed = Number(/(\d+)/.exec(item.tiempo)?.[1] ?? 0);
  const temp = Number(/(\d{3})\s*°/.exec(item.prep)?.[1] ?? 0) || undefined;
  const text = `${item.nom} ${item.prep}`.toLowerCase();
  const station: Station = text.includes("horno") || temp ? "horno" : parsed <= 5 ? "mesada" : "hornalla";
  const tupperMatch = /(\d+)(?:-\d+)?\s*tuppers?/i.exec(item.rinde);
  const tuppers = tupperMatch ? Number(tupperMatch[1]) : /tupper/i.test(item.rinde) ? 1 : 0;

  return {
    id: taskId(cat, item.nom),
    cat,
    item,
    minutes: Math.max(2, parsed),
    station,
    temp: station === "horno" ? temp ?? 200 : undefined,
    tuppers,
  };
}

export const ALL_TASKS: BatchTask[] = BATCH_TABS.flatMap((t) => BATCH[t.key].items.map((it) => toTask(t.key, it)));
export const TASK_BY_ID = new Map(ALL_TASKS.map((t) => [t.id, t]));

/**
 * Oven rounds go hottest first with up to three trays sharing a round (shorter trays go in later so a
 * round comes out together); two burners are packed longest-first; counter prep is sequential.
 * Burner and counter lanes are then shifted to finish with the oven, so everything is ready at once.
 */
export function planSession(ids: string[]): SessionPlan {
  const tasks = ids.map((id) => TASK_BY_ID.get(id)).filter((t): t is BatchTask => Boolean(t));
  const scheduled: Scheduled[] = [];
  const usedLanes = new Set<string>();

  const oven = tasks.filter((t) => t.station === "horno");
  const temps = Array.from(new Set(oven.map((t) => t.temp ?? 200))).sort((a, b) => b - a);
  let ovenEnd = 0;
  for (const temp of temps) {
    const group = oven.filter((t) => (t.temp ?? 200) === temp).sort((a, b) => b.minutes - a.minutes);
    for (let i = 0; i < group.length; i += OVEN_TRAYS) {
      const round = group.slice(i, i + OVEN_TRAYS);
      const end = ovenEnd + round[0].minutes;
      round.forEach((task, tray) => {
        const lane = `horno-${tray + 1}`;
        usedLanes.add(lane);
        scheduled.push({ task, lane, where: `Horno ${temp}°`, start: end - task.minutes, end });
      });
      ovenEnd = end;
    }
  }

  const burners: number[] = new Array(BURNERS).fill(0);
  const stove: Scheduled[] = [];
  for (const task of tasks.filter((t) => t.station === "hornalla").sort((a, b) => b.minutes - a.minutes)) {
    const idx = burners.indexOf(Math.min(...burners));
    const lane = `hornalla-${idx + 1}`;
    usedLanes.add(lane);
    stove.push({ task, lane, where: `Hornalla ${idx + 1}`, start: burners[idx], end: burners[idx] + task.minutes });
    burners[idx] += task.minutes;
  }

  let counterEnd = 0;
  const counter: Scheduled[] = [];
  for (const task of tasks.filter((t) => t.station === "mesada")) {
    usedLanes.add("mesada");
    counter.push({ task, lane: "mesada", where: "Mesada", start: counterEnd, end: counterEnd + task.minutes });
    counterEnd += task.minutes;
  }

  const total = Math.max(0, ovenEnd, counterEnd, ...burners);
  for (const s of stove) {
    const shift = total - burners[Number(s.lane.split("-")[1]) - 1];
    scheduled.push({ ...s, start: s.start + shift, end: s.end + shift });
  }
  for (const s of counter) {
    const shift = total - counterEnd;
    scheduled.push({ ...s, start: s.start + shift, end: s.end + shift });
  }

  scheduled.sort((a, b) => a.start - b.start || b.task.minutes - a.task.minutes);

  return {
    scheduled,
    lanes: LANE_ORDER.filter((id) => usedLanes.has(id)).map((id) => ({ id, label: LANE_LABEL[id] })),
    total,
    sequential: tasks.reduce((sum, t) => sum + t.minutes, 0),
    tuppers: tasks.reduce((sum, t) => sum + t.tuppers, 0),
  };
}
