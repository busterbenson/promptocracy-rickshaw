import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./401.ts";

test("401: the proposer of an applied proposal gets 10 points", () => {
  const out = rule.onEnacted!(makeCtx(), { number: 8, player: "p1" } as any);
  assert.deepEqual(out, [{ type: "points", player: "p1", delta: 10, reason: "P8 was applied" }]);
});
