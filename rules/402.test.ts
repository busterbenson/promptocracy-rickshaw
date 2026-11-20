import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./402.ts";

const end = (before: any, given: any[]) => rule.dayEnd!(makeCtx(), { before, given } as any);

test("402.1: reaching 100 points wins", () => {
  assert.deepEqual(end({ a: 90 }, [{ player: "a", delta: 10 }]), [{ type: "win", player: "a", reason: "reached 100 points" }]);
});
test("402.1: 99 points is not a win", () => {
  assert.deepEqual(end({ a: 89 }, [{ player: "a", delta: 10 }]), []);
});
test("402.2: two players pass 100 the same night: the first one given points wins", () => {
  const out = end({ a: 95, b: 95 }, [{ player: "b", delta: 10 }, { player: "a", delta: 10 }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].player, "b");
});
