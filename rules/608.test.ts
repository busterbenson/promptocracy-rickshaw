import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule, { attributes } from "./608.ts";

const catalog = [
  { id: "C1", kind: "creature", name: "Blob", attrs: { hearts: 3, temper: "hostile" } },
  { id: "C2", kind: "creature", name: "Cat", attrs: { hearts: 3, temper: "neutral" } },
  { id: "S1", kind: "structure", name: "House", madeBy: "W6", attrs: { size: { w: 2, h: 2 }, refuge: true } },
  { id: "S2", kind: "structure", name: "Shed", attrs: { size: { w: 1, h: 1 } } },
];
const blob = { id: 1, entry: "C1", x: 5, y: 5, z: 0, hearts: 3, resting: false };
const ask = (o: any, creature: any, ref: string) => {
  const ctx = makeCtx({ day: 4, catalog, players: [{ ref: "a", x: 0, y: 0 }, { ref: "d", x: 1, y: 0, state: "dead" }, { ref: "g", x: 0, y: 1, state: "ghost" }, { ref: "out", x: 4, y: 4 }], structures: [{ id: 1, entry: "S1", x: 0, y: 0, w: 2, h: 2 }], ...o });
  return rule.biteAllowed!(ctx, creature, ctx.players.find((p) => p.ref === ref)!);
};

test("608: a living player on any of the 4 tiles of a refuge can't be bitten by a hostile creature; a refusal names this rule", () => {
  for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const r = ask({ players: [{ ref: "a", x, y }] }, blob, "a") as any;
    assert.match(r.error, /608\.1/, `${x},${y}`);
  }
});
test("608: outside the footprint they can be bitten", () => {
  assert.equal(ask({}, blob, "out"), null);
  assert.equal(ask({ players: [{ ref: "a", x: 2, y: 0 }] }, blob, "a"), null);
});
test("608: a structure without refuge protects nobody, and with no structures there is nothing to refuse", () => {
  assert.equal(ask({ structures: [{ id: 2, entry: "S2", x: 0, y: 0, w: 1, h: 1 }] }, blob, "a"), null);
  assert.equal(ask({ structures: [] }, blob, "a"), null);
});
test("608: only hostile creatures are held back, and only for living players (the dead and Ghosts are not bitten anyway, 602.5)", () => {
  assert.equal(ask({}, { ...blob, entry: "C2" }, "a"), null);
  assert.equal(ask({}, blob, "d"), null);
  assert.equal(ask({}, blob, "g"), null);
});
test("608: ctx.mayBite runs this rule's answer", () => {
  const ctx = makeCtx({ day: 4, catalog, modules: [rule], players: [{ ref: "a", x: 0, y: 0 }, { ref: "out", x: 4, y: 4 }], structures: [{ id: 1, entry: "S1", x: 0, y: 0, w: 2, h: 2 }] });
  assert.equal(ctx.mayBite(blob, "a"), false);
  assert.equal(ctx.mayBite(blob, "out"), true);
});
test("608: it defines the refuge attribute, a yes or no for structures", () => {
  assert.deepEqual(attributes.map((a) => [a.key, a.type, a.kinds.join()]), [["refuge", "yesno", "structure"]]);
});
