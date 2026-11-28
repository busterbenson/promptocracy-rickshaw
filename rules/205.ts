// Rule 205, The moon. Each day's moon is full, new or neither (205.1), worked out from the date alone: the mean lunar
// cycle (29.53 days, 29.530588853 to the precision used here) counted from a known new moon. A day's moon is new when a
// new moon falls inside that day (midnight to midnight in the game's time zone, 203.1), full when a full moon does, and
// neither otherwise. The rule by itself changes nothing in play, so the module has no hooks; it is the calculation.
import { defineRule } from "promptocracy/engine";

/** The lunar cycle in days, and a known new moon (2000-01-06 18:14 UTC) to count from. @rule 205.1 */
export const CYCLE_DAYS = 29.530588853;
/** @rule 205.1 */
export const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);
const DAY_MS = 86_400_000;
const CYCLE_MS = CYCLE_DAYS * DAY_MS;

export type Moon = "full" | "new" | "neither";

/** The local calendar date and clock time of an instant in a time zone. @rule 205.1 */
function localParts(t: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(t));
  /** @rule 205.1 */
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day"), h: get("hour") % 24, mi: get("minute"), s: get("second") };
}

/** How far the time zone's clock is ahead of UTC at an instant, in ms. @rule 205.1 */
function offsetMs(t: number, timeZone: string): number {
  const p = localParts(t, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(t / 1000) * 1000;
}

/** The instant a local date's midnight falls in the time zone (203.1). @rule 205.1 */
function localMidnight(y: number, m: number, d: number, timeZone: string): number {
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - offsetMs(guess, timeZone);
  t = guess - offsetMs(t, timeZone);
  return t;
}

/** Whether an event of the cycle (new moon at phase 0, full at phase 0.5) falls in [start, end). @rule 205.1 */
function eventIn(start: number, end: number, phase: number): boolean {
  const base = NEW_MOON_EPOCH + phase * CYCLE_MS;
  const k = Math.ceil((start - base) / CYCLE_MS);
  return base + k * CYCLE_MS < end;
}

/** The moon of the day that contains `when`, in the given time zone: full, new or neither. @rule 205.1 */
export function moonOn(when: Date | string | number, timeZone: string): Moon {
  const p = localParts(new Date(when).getTime(), timeZone);
  const start = localMidnight(p.y, p.m, p.d, timeZone);
  const next = new Date(Date.UTC(p.y, p.m - 1, p.d + 1));
  const end = localMidnight(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), timeZone);
  if (eventIn(start, end, 0.5)) return "full";
  if (eventIn(start, end, 0)) return "new";
  return "neither";
}

/** Today's moon, for other rules to use as a condition: the day of ctx.now in the game's time zone (203.1). @rule 205.1 */
export function moonToday(ctx: { now: Date | string | number; settings: Record<string, any> }): Moon {
  return moonOn(ctx.now, ctx.settings["game.timezone"] ?? "UTC");
}

export default defineRule({ rule: 205 });
