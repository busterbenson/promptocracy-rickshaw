import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule, { canBeDefeated } from "./605.ts";

const blob = { x: 0, y: 0, z: 0 };
const p = (ref: string, x: number, y: number, o: any = {}) => ({ ref, x, y, z: 0, state: "living", ...o });
const ok = (players: any[], c: any = blob) => canBeDefeated(makeCtx({ players }) as any, c);

test("605.1: two living players next to it on opposite sides, in a straight line, can defeat it", () => {
  assert.equal(ok([p("a", 1, 0), p("b", -1, 0)]), true); // east and west
  assert.equal(ok([p("a", 0, 1), p("b", 0, -1)]), true); // north and south
  assert.equal(ok([p("a", 1, 1), p("b", -1, -1)]), true); // a diagonal line
  assert.equal(ok([p("a", -1, 1), p("b", 1, -1)]), true); // the other diagonal
});
test("605.1: a creature elsewhere on the board is checked around its own tile", () => {
  assert.equal(ok([p("a", 6, 5), p("b", 4, 5)], { x: 5, y: 5, z: 0 }), true);
  assert.equal(ok([p("a", 1, 0), p("b", -1, 0)], { x: 5, y: 5, z: 0 }), false);
});
test("605.1: not when the two are next to it but not opposite each other", () => {
  assert.equal(ok([p("a", 1, 0), p("b", 0, 1)]), false);
  assert.equal(ok([p("a", 1, 1), p("b", -1, 0)]), false);
});
test("605.1: not with one player, or when one of the two is not next to it", () => {
  assert.equal(ok([p("a", 1, 0)]), false);
  assert.equal(ok([p("a", 2, 0), p("b", -2, 0)]), false);
  assert.equal(ok([p("a", 1, 0), p("b", -2, 0)]), false);
  assert.equal(ok([]), false);
});
test("605.1: only living players count: a dead player or a Ghost doesn't (603.1)", () => {
  assert.equal(ok([p("a", 1, 0), p("b", -1, 0, { state: "dead", deadDay: 1 })]), false);
  assert.equal(ok([p("a", 1, 0), p("b", -1, 0, { state: "ghost", deadDay: 1 })]), false);
});
test("605.1: a player on another level is not next to it", () => {
  assert.equal(ok([p("a", 1, 0), p("b", -1, 0, { z: 1 })]), false);
});
test("605: the module has no hooks; nothing takes a creature's hearts yet", () => {
  assert.equal(rule.rule, 605);
  assert.equal(rule.night, undefined);
  assert.equal(rule.actionAllowed, undefined);
});
