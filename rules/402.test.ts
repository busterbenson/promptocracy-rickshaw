import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./402.ts";

const end = (before: any, given: any[]) => rule.dayEnd!(makeCtx(), { before, given } as any);

test("402.1: reaching 100 points wins the Era", () => {
  assert.deepEqual(end({ a: 90 }, [{ player: "a", delta: 10 }]), [{ type: "champion", player: "a", reason: "reached 100 points" }]);
});
test("402.1: 99 points does not win it", () => {
  assert.deepEqual(end({ a: 89 }, [{ player: "a", delta: 10 }]), []);
});
test("402.1: points from earlier nights count", () => {
  assert.equal(end({ a: 95 }, [{ player: "a", delta: 10 }])[0].player, "a");
});
test("402.2: two players pass 100 the same night: the first one given points wins", () => {
  const out = end({ a: 95, b: 95 }, [{ player: "b", delta: 10 }, { player: "a", delta: 10 }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].player, "b");
});
test("402.2: a player already over 100 earlier in the night's order wins before a later one", () => {
  const out = end({ a: 99, b: 99 }, [{ player: "a", delta: 1 }, { player: "b", delta: 10 }, { player: "a", delta: 10 }]);
  assert.deepEqual(out.map((e: any) => e.player), ["a"]);
});
test("402.3: no points given, no Era ends", () => {
  assert.deepEqual(end({ a: 150 }, []), []);
});
