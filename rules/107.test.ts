import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./107.ts";

test("107.2: passed proposals are applied in the order they were proposed (lowest P-number first)", () => {
  const out = rule.applyOrder!(makeCtx(), [{ number: 9 }, { number: 3 }, { number: 7 }] as any);
  assert.deepEqual(out.map((p: any) => p.number), [3, 7, 9]);
});
test("107.2: one proposal, or none, keeps its order", () => {
  assert.deepEqual(rule.applyOrder!(makeCtx(), [{ number: 4 }] as any).map((p: any) => p.number), [4]);
  assert.deepEqual(rule.applyOrder!(makeCtx(), [] as any), []);
});
