import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx, island } from "promptocracy/engine/testing";
import rule from "./602.ts";

const catalog = [{ id: "C1", kind: "creature", attrs: { temper: "hostile", hearts: 3 } }, { id: "C2", kind: "creature", attrs: { temper: "neutral", hearts: 3 } }];
const at = (ref: string, x: number, y: number, state = "living") => ({ ref, x, y, state });
const night = (o: any, applied: number[] = []) => rule.night!(makeCtx({ day: 3, catalog, nextCreatureId: 1, ...o }), { applied }) as any[];
const dist = (a: any, b: any) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

test("602: a hostile creature appears only on a night when nothing was applied", () => {
  const players = [at("a", -4, -4)];
  assert.equal(night({ players }, [7]).filter((e) => e.type === "appear").length, 0);
  const e = night({ players }).filter((x) => x.type === "appear");
  assert.equal(e.length, 1);
  assert.equal(e[0].entry, "C1"); // never the neutral entry
});
test("602: it appears on a charted unoccupied tile at least 3 steps from every living player (the dead don't count, their tile is taken)", () => {
  const players = [at("a", 0, 0), at("b", 3, 3), at("d", -4, -4, "dead")];
  for (const seed of ["s1", "s2", "s3", "s4", "s5", "s6"]) {
    const e = night({ players, seed }).find((x) => x.type === "appear");
    assert.ok(e, seed);
    assert.ok(players.filter((p) => p.state === "living").every((p) => dist(p, e.tile) >= 3), seed);
    assert.ok(!(e.tile.x === -4 && e.tile.y === -4), "the dead piece's tile is occupied");
  }
});
test("602: nothing appears when no tile qualifies, or there is no hostile entry", () => {
  const tiny = [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }];
  assert.deepEqual(night({ tiles: tiny, players: [at("a", 0, 0)] }), []);
  assert.deepEqual(night({ catalog: [catalog[1]], players: [at("a", 0, 0)] }), []);
});
test("602: a hostile creature steps 1 tile strictly closer, and doesn't step when already next to a living player", () => {
  const c = { id: 1, entry: "C1", x: 3, y: 3, z: 0, hearts: 3, resting: false };
  const e = night({ players: [at("a", 0, 0)], creatures: [c] }, [1]);
  const step = e.find((x) => x.type === "step");
  assert.ok(step && dist(step.to, { x: 0, y: 0 }) === 2 && dist(step.to, c) === 1);
  const near = night({ players: [at("a", 3, 2)], creatures: [c] }, [1]);
  assert.equal(near.filter((x) => x.type === "step").length, 0);
});
test("602: a creature boxed in by pieces stays; a second creature can't take the tile the first just took", () => {
  const boxed = night({ tiles: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }], players: [at("a", 0, 0), at("d", 1, 0, "dead")], creatures: [{ id: 1, entry: "C1", x: 2, y: 0, z: 0, hearts: 3, resting: false }] }, [1]);
  assert.equal(boxed.length, 0);
  const two = night({ players: [at("a", 0, 0)], creatures: [{ id: 1, entry: "C1", x: 2, y: 0, z: 0, hearts: 3, resting: false }, { id: 2, entry: "C1", x: 2, y: 1, z: 0, hearts: 3, resting: false }] }, [1]);
  const steps = two.filter((x) => x.type === "step");
  assert.equal(new Set(steps.map((s) => s.to.x + "," + s.to.y)).size, steps.length);
});
test("602: ties follow the seed", () => {
  const o = { players: [at("a", 0, 0)], creatures: [{ id: 1, entry: "C1", x: 3, y: 0, z: 0, hearts: 3, resting: false }] };
  assert.deepEqual(night({ ...o, seed: "same" }, [1]), night({ ...o, seed: "same" }, [1]));
});
test("602: bites every adjacent living player by creatures.bite, then rests; the dead and Ghosts aren't chased or bitten; a resting creature does nothing", () => {
  const c = { id: 1, entry: "C1", x: 1, y: 1, z: 0, hearts: 3, resting: false };
  const e = night({ players: [at("a", 1, 2), at("b", 2, 1), at("d", 0, 1, "dead"), at("g", 0, 0, "ghost")], creatures: [c], settings: { "creatures.bite": 2 } }, [1]);
  assert.deepEqual(e.map((x) => x.type), ["bite", "bite", "rest"]);
  assert.deepEqual(e.filter((x) => x.type === "bite").map((x) => [x.target.player, x.hearts]), [["a", 2], ["b", 2]]);
  assert.ok(e.filter((x) => x.type === "bite").every((x) => x.by === c.id), "each bite names the creature that bit (101.2)");
  assert.deepEqual(night({ players: [at("a", 1, 2)], creatures: [{ ...c, resting: true }] }, [1]), []);
});
test("602: neutral creatures never move or bite", () => {
  assert.deepEqual(night({ players: [at("a", 1, 2)], creatures: [{ id: 1, entry: "C2", x: 1, y: 1, z: 0, hearts: 3, resting: false }] }, [1]), []);
});
test("602: a new creature can't bite on its first night at the default setting", () => {
  for (const seed of ["a", "b", "c", "d", "e"]) assert.equal(night({ players: [at("a", 0, 0)], seed }).filter((x) => x.type === "bite").length, 0);
});
test("602: two creatures next to a one-heart player: the second bites nobody and doesn't rest", () => {
  const cs = [{ id: 1, entry: "C1", x: 1, y: 1, z: 0, hearts: 3, resting: false }, { id: 2, entry: "C1", x: 1, y: 2, z: 0, hearts: 3, resting: false }];
  const e = night({ players: [at("a", 0, 1)].map((p) => ({ ...p, hearts: 1 })), creatures: cs }, [1]);
  assert.deepEqual(e.map((x) => x.type + (x.creature ?? "")), ["bite", "rest1"]);
});
