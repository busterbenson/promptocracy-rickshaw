import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./603.ts";

const dead = (deadDay: number) => ({ ref: "a", x: 0, y: 0, state: "dead", deadDay });
test("603: rises on day deadDay + 3, not before", () => {
  assert.deepEqual(rule.night!(makeCtx({ day: 5, players: [dead(2)] }), { applied: [] }), [{ type: "rise", player: "a" }]);
  assert.deepEqual(rule.night!(makeCtx({ day: 4, players: [dead(2)] }), { applied: [] }), []);
});
test("603: never re-rises a Ghost, and the living don't rise", () => {
  const ctx = makeCtx({ day: 20, players: [{ ref: "g", x: 0, y: 0, state: "ghost", deadDay: 1 }, { ref: "l", x: 1, y: 1 }] });
  assert.deepEqual(rule.night!(ctx, { applied: [] }), []);
});
test("603: follows the setting death.ghost_days", () => {
  assert.deepEqual(rule.night!(makeCtx({ day: 5, settings: { "death.ghost_days": 1 }, players: [dead(4)] }), { applied: [] }), [{ type: "rise", player: "a" }]);
  assert.deepEqual(rule.night!(makeCtx({ day: 5, settings: { "death.ghost_days": 2 }, players: [dead(4)] }), { applied: [] }), []);
});

const give = (me: any, them: any, turn: any = {}) => rule.giveHeart!(makeCtx({ players: [{ ref: "m", x: 0, y: 0, hearts: 3, ...me }, { ref: "t", x: 1, y: 1, state: "dead", deadDay: 1, hearts: 0, ...them }], turn }), { ref: "m" }, "t");
test("603.4: a living player next to a dead player's piece may give a heart", () => {
  assert.equal(give({}, {}), null);
  assert.equal(give({ x: 1, y: 0 }, {}), null); // diagonals and orthogonals alike
});
test("603.4: refused when not next to them, when the giver has 1 heart, when they are a Ghost or living, and a second time in a day", () => {
  assert.match(give({ x: 3, y: 3 }, {})!.error, /aren't next to/);
  assert.match(give({ hearts: 1 }, {})!.error, /at least 2 hearts/);
  assert.match(give({}, { state: "ghost" })!.error, /Ghost/);
  assert.match(give({}, { state: "living" })!.error, /aren't dead/);
  assert.match(give({}, {}, { gave: true })!.error, /already gave a heart today/);
  assert.match(give({ state: "dead", deadDay: 1 }, {})!.error, /Only a living player/);
});
test("603.4: no other turn action is ruled here", () => {
  assert.equal(rule.actionAllowed, undefined);
});
