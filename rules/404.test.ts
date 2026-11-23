import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./404.ts";

const p = (ref: string, state = "living") => ({ ref, x: 0, y: 0, state });
test("404: one living after deaths is Last one standing, naming that player", () => {
  assert.deepEqual(rule.ending!(makeCtx({ players: [p("a"), p("b", "dead"), p("c", "ghost")] }), { died: ["b"] }), { type: "game_over", ending: "last_standing", player: "a", reason: "was the last one living" });
});
test("404: none living is Everyone dead, with nobody named (the last two dying the same night)", () => {
  assert.deepEqual(rule.ending!(makeCtx({ players: [p("a", "dead"), p("b", "dead")] }), { died: ["a", "b"] }), { type: "game_over", ending: "everyone_dead", player: null, reason: "everyone died" });
});
test("404: two or more living: the game goes on", () => {
  assert.equal(rule.ending!(makeCtx({ players: [p("a"), p("b"), p("c", "dead")] }), { died: ["c"] }), null);
});
