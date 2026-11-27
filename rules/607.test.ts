import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./607.ts";

const catalog = [
  { id: "C12", kind: "creature", name: "Pancake", madeBy: "W2", requester: "ana", attrs: { hearts: 3, temper: "neutral" } },
  { id: "C13", kind: "creature", name: "Pancake asleep", madeBy: "W2", requester: "ana", attrs: { hearts: 3, temper: "neutral" } },
  { id: "C1", kind: "creature", name: "Blob", attrs: { hearts: 3, temper: "hostile" } },
];
const ctx = (o: any = {}) => makeCtx({ day: 4, catalog, ...o });
const cat = (resting: boolean, entry = "C12") => ({ id: 7, entry, x: 0, y: 0, z: 0, hearts: 3, resting });

test("607: while Pancake is resting the board shows her sleeping drawing; otherwise her own", () => {
  const c = ctx();
  assert.equal(rule.creatureDrawing!(c, { ...cat(true), hearts: 3 }), "C13");
  assert.equal(rule.creatureDrawing!(c, cat(false)), undefined);
});
test("607: another creature, resting or not, keeps its own drawing", () => {
  assert.equal(rule.creatureDrawing!(ctx(), cat(true, "C1")), undefined);
});
test("607: the sleeping entry is never placed on the board; every other entry is not this rule's to say", () => {
  const c = ctx();
  assert.equal(rule.placement!(c, c.catalog[1]), null);
  assert.equal(rule.placement!(c, c.catalog[0]), undefined);
  assert.equal(rule.placement!(c, c.catalog[2]), undefined);
});
test("607: nothing without W2's two entries", () => {
  const only = ctx({ catalog: [catalog[0]] });
  assert.equal(rule.creatureDrawing!(only, cat(true)), undefined);
  assert.equal(rule.placement!(only, only.catalog[0]), undefined);
  const none = ctx({ catalog: [] });
  assert.equal(rule.creatureDrawing!(none, cat(true)), undefined);
});
