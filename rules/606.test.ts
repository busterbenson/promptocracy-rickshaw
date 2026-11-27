import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./606.ts";

const catalog = [
  { id: "C12", kind: "creature", name: "Pancake", madeBy: "W2", requester: "ana", attrs: { hearts: 3, temper: "neutral" } },
  { id: "C13", kind: "creature", name: "Pancake asleep", madeBy: "W2", requester: "ana", attrs: { hearts: 3, temper: "neutral" } },
];
const cat = (o: any = {}) => ({ id: 7, entry: "C12", x: 0, y: 0, z: 0, hearts: 3, resting: false, ...o });
const player = (ref: string, x: number, y: number, state = "living") => ({ ref, x, y, state });
const night = (o: any) => rule.night!(makeCtx({ day: 4, catalog, ...o }), { applied: [] }) as any[];
const dist = (a: any, b: any) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

test("606: she takes 1 to 3 steps, each one strictly closer to her owner, then rests (the owner is the requester of the commission that made her)", () => {
  const seen = new Set<number>();
  for (const seed of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]) {
    const c = cat({ x: -3, y: -3 });
    const e = night({ seed, creatures: [c], players: [player("ana", 3, 3), player("bo", -3, -2)] });
    const steps = e.filter((x) => x.type === "step");
    assert.ok(steps.length >= 1 && steps.length <= 3, seed);
    seen.add(steps.length);
    let at: any = c;
    for (const s of steps) { assert.equal(s.creature, 7); assert.ok(dist(s.to, { x: 3, y: 3 }) < dist(at, { x: 3, y: 3 }) && dist(s.to, at) === 1); at = s.to; }
    assert.deepEqual(e.slice(-1), [{ type: "rest", creature: 7 }]);
  }
  assert.ok(seen.size > 1, "the number of steps varies with the roll");
});
test("606: she follows her owner, not another player, and stops next to the owner", () => {
  const e = night({ seed: "k", creatures: [cat({ x: 0, y: 0 })], players: [player("ana", 2, 0), player("bo", -4, -4)] });
  const steps = e.filter((x) => x.type === "step");
  assert.equal(steps.length, 1); // one step puts her next to the owner, then she stops
  assert.equal(dist(steps[0].to, { x: 2, y: 0 }), 1);
  assert.equal(night({ creatures: [cat({ x: 1, y: 0 })], players: [player("ana", 2, 0)] }).length, 0, "already next to her owner: nothing to do");
});
test("606: boxed in she stays and does not rest; a creature or a piece in the way is not stepped on", () => {
  const tiles = [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }];
  assert.deepEqual(night({ tiles, creatures: [cat()], players: [player("ana", 3, 0), player("bo", 1, 0)] }), []);
  const e = night({ seed: "m", creatures: [cat(), { id: 8, entry: "C1", x: 1, y: 0, z: 0, hearts: 3, resting: false }], players: [player("ana", 3, 3)] });
  assert.ok(e.filter((x) => x.type === "step").every((s) => !(s.to.x === 1 && s.to.y === 0)));
});
test("606: she does not move on the night she is sleeping, and she follows the piece of a dead owner or a Ghost", () => {
  assert.deepEqual(night({ creatures: [cat({ resting: true })], players: [player("ana", 3, 3)] }), []);
  for (const state of ["dead", "ghost"]) assert.ok(night({ seed: "z", creatures: [cat()], players: [player("ana", 3, 3, state)] }).some((x) => x.type === "step"), state);
});
test("606: nothing without her entry in the catalog, her on the board, or her owner in the game", () => {
  assert.deepEqual(night({ catalog: [], creatures: [cat()], players: [player("ana", 3, 3)] }), []);
  assert.deepEqual(night({ creatures: [], players: [player("ana", 3, 3)] }), []);
  assert.deepEqual(night({ creatures: [cat()], players: [player("bo", 3, 3)] }), []);
  assert.deepEqual(night({ catalog: [{ ...catalog[0], requester: null }, catalog[1]], creatures: [cat()], players: [player("ana", 3, 3)] }), []);
});
test("606: the same seed gives the same walk", () => {
  const o = { creatures: [cat({ x: -4, y: -4 })], players: [player("ana", 4, 3)] };
  assert.deepEqual(night({ ...o, seed: "same" }), night({ ...o, seed: "same" }));
});
