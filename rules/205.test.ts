import { test } from "node:test";
import assert from "node:assert/strict";
import rule, { CYCLE_DAYS, moonOn, moonToday } from "./205.ts";

const LA = "America/Los_Angeles";
const DAY = 86_400_000;

test("205.1: the cycle is the 29.53-day lunar cycle", () => {
  assert.equal(Math.round(CYCLE_DAYS * 100) / 100, 29.53);
});
test("205.1: the day of a new moon has a new moon (2024-04-08, the eclipse, in the game's time zone)", () => {
  assert.equal(moonOn("2024-04-08T19:00:00Z", LA), "new");
  assert.equal(moonOn("2024-04-07T19:00:00Z", LA), "neither");
  assert.equal(moonOn("2024-04-09T19:00:00Z", LA), "neither");
});
test("205.1: the day of a full moon has a full moon (2024-04-23)", () => {
  assert.equal(moonOn("2024-04-23T19:00:00Z", LA), "full");
  assert.equal(moonOn("2024-04-22T19:00:00Z", LA), "neither");
  assert.equal(moonOn("2024-04-24T19:00:00Z", LA), "neither");
});
test("205.1: the date is the one in the game's time zone (203.1): one new moon falls on different dates in different zones", () => {
  // The new moon of 2000-01-06 18:14 UTC is the 6th in Los Angeles and the 7th in Tokyo.
  assert.equal(moonOn("2000-01-06T20:00:00Z", LA), "new");
  assert.equal(moonOn("2000-01-07T20:00:00Z", LA), "neither");
  assert.equal(moonOn("2000-01-06T20:00:00Z", "Asia/Tokyo"), "new"); // 05:00 on the 7th in Tokyo
  assert.equal(moonOn("2000-01-06T12:00:00Z", "Asia/Tokyo"), "neither"); // 21:00 on the 6th in Tokyo
  assert.equal(moonOn("2000-01-06T20:00:00Z", "UTC"), "new");
});
test("205.1: every instant of one local day has the same moon, from midnight to just before the next", () => {
  // 2024-04-08 in Los Angeles runs from 07:00 UTC on the 8th to 07:00 UTC on the 9th (daylight time).
  assert.equal(moonOn("2024-04-08T07:00:00Z", LA), "new");
  assert.equal(moonOn("2024-04-09T06:59:59Z", LA), "new");
  assert.equal(moonOn("2024-04-08T06:59:59Z", LA), "neither");
});
test("205.1: over a year each phase falls on 12 or 13 days, one day per new or full moon, and most days are neither", () => {
  let n = 0, f = 0, x = 0;
  for (let i = 0; i < 366; i++) {
    const m = moonOn(Date.UTC(2024, 0, 1, 20) + i * DAY, LA);
    if (m === "new") n++; else if (m === "full") f++; else x++;
  }
  assert.ok(n >= 12 && n <= 13, `new ${n}`);
  assert.ok(f >= 12 && f <= 13, `full ${f}`);
  assert.equal(x, 366 - n - f);
  // a full moon and the next new moon are about half a cycle apart: never on adjacent days
  for (let i = 0; i < 365; i++) {
    const a = moonOn(Date.UTC(2024, 0, 1, 20) + i * DAY, LA), b = moonOn(Date.UTC(2024, 0, 1, 20) + (i + 1) * DAY, LA);
    assert.ok(a === "neither" || b === "neither", `day ${i}`);
  }
});
test("205.1: moonToday reads today from the time (ctx.now) and the game's time zone setting (203.1)", () => {
  assert.equal(moonToday({ now: new Date("2024-04-23T19:00:00Z"), settings: { "game.timezone": LA } }), "full");
  assert.equal(moonToday({ now: new Date("2000-01-06T20:00:00Z"), settings: { "game.timezone": "Asia/Tokyo" } }), "new");
});
test("205.1: by itself it changes nothing in play: the module is the rule, with no hooks", () => {
  assert.equal(rule.rule, 205);
  assert.deepEqual(Object.keys(rule), ["rule"]);
});
