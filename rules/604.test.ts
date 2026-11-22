import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./604.ts";
import r202 from "./202.ts";

const ghost = { ref: "g", x: 0, y: 0, state: "ghost", deadDay: 1 };
const ctx = makeCtx({ players: [ghost, { ref: "l", x: 3, y: 3 }] });
test("604: a Ghost can't propose, with the 604.1 reason", () => {
  assert.deepEqual(rule.actionAllowed!(ctx, { ref: "g" }, { kind: "propose" }), { error: "A Ghost can't propose (604.1).", status: 403 });
});
test("604: a Ghost can move and end its turn (module 202 lets it too)", () => {
  for (const kind of ["move", "end_turn"] as const) {
    assert.equal(rule.actionAllowed!(ctx, { ref: "g" }, { kind }), null);
    assert.equal(r202.actionAllowed!(ctx, { ref: "g" }, { kind }), null);
  }
});
test("604: a living player can propose", () => {
  assert.equal(rule.actionAllowed!(ctx, { ref: "l" }, { kind: "propose" }), null);
});
