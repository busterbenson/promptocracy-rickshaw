import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./402.ts";

const end = (before: any, given: any[], settings: any = {}) => rule.dayEnd!(makeCtx({ settings }), { before, given } as any);

test("402.2: reaching 100 points wins the Era", () => {
  assert.deepEqual(end({ a: 90 }, [{ player: "a", delta: 10 }]), [{ type: "champion", player: "a", reason: "reached 100 points" }]);
});
test("402.2: 99 points does not win it", () => {
  assert.deepEqual(end({ a: 89 }, [{ player: "a", delta: 10 }]), []);
});
test("402.2: points from earlier nights count toward the 100", () => {
  assert.equal(end({ a: 95 }, [{ player: "a", delta: 10 }])[0].player, "a");
});
test("402.2: two players pass 100 the same night: the first one given points wins", () => {
  const out = end({ a: 95, b: 95 }, [{ player: "b", delta: 10 }, { player: "a", delta: 10 }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].player, "b");
});
test("402.2: the first to cross 100 wins, even when another player ends the night with more points", () => {
  const out = end({ a: 99, b: 50 }, [{ player: "a", delta: 2 }, { player: "b", delta: 60 }]);
  assert.deepEqual(out.map((e: any) => e.player), ["a"]);
});
test("402.2: the points a player is given after someone has crossed 100 do not change who won", () => {
  const out = end({ a: 99, b: 99 }, [{ player: "a", delta: 1 }, { player: "b", delta: 10 }, { player: "a", delta: 10 }]);
  assert.deepEqual(out.map((e: any) => e.player), ["a"]);
});
test("402.2: points are counted in the order they are given: crossing 100 first wins even if a payment follows", () => {
  assert.deepEqual(end({ a: 95 }, [{ player: "a", delta: 10 }, { player: "a", delta: -20 }]).map((e: any) => e.player), ["a"]);
});
test("402.2: a payment given before the points keeps a player under 100", () => {
  assert.deepEqual(end({ a: 85 }, [{ player: "a", delta: -20 }, { player: "a", delta: 10 }]), []);
});
test("402.3, 402.4: the Champion may name the Era and make their one change (the site counts and limits them)", () => {
  assert.equal(rule.championChange!(makeCtx(), { ref: "a" } as any, "name"), null);
  assert.equal(rule.championChange!(makeCtx(), { ref: "a" } as any, "change"), null);
});
test("402.3: no points given tonight, no Era ends tonight", () => {
  assert.deepEqual(end({ a: 150 }, []), []);
});
test("402.2: the points that win are the setting eras.points_to_win", () => {
  const set = { "eras.points_to_win": 50 };
  assert.deepEqual(end({ a: 45 }, [{ player: "a", delta: 5 }], set), [{ type: "champion", player: "a", reason: "reached 50 points" }]);
  assert.deepEqual(end({ a: 45 }, [{ player: "a", delta: 4 }], set), []);
  assert.deepEqual(end({ a: 90 }, [{ player: "a", delta: 10 }], set).map((e: any) => e.player), ["a"]);
});
