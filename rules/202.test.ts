import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./202.ts";
import r504 from "./504.ts";

const me = { ref: "a", x: 0, y: 0 };

test("202: a first move today is fine", () => {
  assert.equal(rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: false } }), { ref: "a" }, { kind: "move" }), null);
});
test("202: a second move the same day is refused with a 409", () => {
  const r = rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: true } }), { ref: "a" }, { kind: "move" });
  assert.deepEqual(r, { error: "You already moved today.", status: 409 });
});
test("202: having moved does not stop a proposal", () => {
  assert.equal(rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: true } }), { ref: "a" }, { kind: "propose" }), null);
});

test("202.2: with the move distance at 2 you can move 2 spaces, diagonals included, but not 3", () => {
  const ask = (to: any) => r504.actionAllowed!(makeCtx({ players: [me], settings: { "turn.move_distance": 2 } }), { ref: "a" }, { kind: "move", to });
  assert.equal(ask({ x: 0, y: 2, z: 0 }), null);
  assert.equal(ask({ x: 2, y: 2, z: 0 }), null);
  assert.equal(ask({ x: -2, y: -1, z: 0 }), null);
  assert.match(ask({ x: 3, y: 0, z: 0 })!.error, /not within 2 steps of you/);
});

test("202: a dead player can't move, propose or end their turn (603.1, 403)", () => {
  const ctx = makeCtx({ players: [{ ref: "a", x: 0, y: 0, state: "dead", deadDay: 1 }] });
  for (const kind of ["move", "propose", "end_turn"] as const) {
    assert.deepEqual(rule.actionAllowed!(ctx, { ref: "a" }, { kind }), { error: "You're dead (603.1).", status: 403 });
  }
});
test("202: a Ghost has its turn (604.1) and can move (202.5)", () => {
  const ctx = makeCtx({ players: [{ ref: "a", x: 0, y: 0, state: "ghost", deadDay: 1 }] });
  assert.equal(rule.actionAllowed!(ctx, { ref: "a" }, { kind: "move" }), null);
});
