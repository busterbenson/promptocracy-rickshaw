import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./202.ts";

const me = { ref: "a", x: 0, y: 0 };

test("202: a first move this turn is fine", () => {
  assert.equal(rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: false } }), { ref: "a" }, { kind: "move" }), null);
});
test("202: a second move this turn is refused with a 409", () => {
  const r = rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: true } }), { ref: "a" }, { kind: "move" });
  assert.deepEqual(r, { error: "You already moved this turn.", status: 409 });
});
test("202: having moved does not stop a proposal", () => {
  assert.equal(rule.actionAllowed!(makeCtx({ players: [me], turn: { moved: true } }), { ref: "a" }, { kind: "propose" }), null);
});
