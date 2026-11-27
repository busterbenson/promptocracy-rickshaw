import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import rule from "./706.ts";

const flower = { id: "I1", kind: "item", name: "Flower", madeBy: "W4", attrs: { acquired: "706" } };
const give = (me: any, them: any, o: any = {}) => rule.giveItem!(makeCtx({ catalog: o.catalog ?? [flower], turn: o.turn, players: [{ ref: "m", x: 0, y: 0, ...me }, { ref: "t", x: 5, y: 5, ...them }] }), { ref: "m" }, o.target ?? "t", o.entry ?? "I1");

test("706.1: a living player may give the Flower to another player, however far away", () => {
  assert.equal(give({}, {}), null);
});
test("706.1: to a dead player and to a Ghost too", () => {
  assert.equal(give({}, { state: "dead", deadDay: 1 }), null);
  assert.equal(give({}, { state: "ghost", deadDay: 1 }), null);
});
test("706.1: not to yourself; not by a dead player or a Ghost; not twice in a day", () => {
  assert.match(give({}, {}, { target: "m" })!.error, /another player/);
  assert.match(give({ state: "dead", deadDay: 1 }, {})!.error, /living player/);
  assert.match(give({ state: "ghost", deadDay: 1 }, {})!.error, /living player/);
  assert.match(give({}, {}, { turn: { given: [{ entry: "I1", to: "x" }] } })!.error, /already gave a Flower today/);
});
test("706.1: says nothing (undefined) about another item, or when no Flower is in the catalog (703.4)", () => {
  assert.equal(give({}, {}, { entry: "I2" }), undefined);
  assert.equal(give({}, {}, { catalog: [] }), undefined);
});
test("706.1: the Flower is found by its commission, whatever its id", () => {
  const moved = { ...flower, id: "I7" };
  assert.equal(give({}, {}, { catalog: [moved], entry: "I7" }), null);
  assert.equal(give({}, {}, { catalog: [moved], entry: "I1" }), undefined);
});

// Giving never needs a holding check here: the engine refuses a giver who holds none ("You have no Flower."), whatever the rules say.
