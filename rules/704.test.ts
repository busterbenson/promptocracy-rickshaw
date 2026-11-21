import { test } from "node:test";
import assert from "node:assert/strict";
import rule, { required } from "./704.ts";

test("704.1: a creature needs hearts, an item needs the rule that gives it to you, a structure needs a size", () => {
  assert.deepEqual(required, {
    creature: [{ key: "hearts", type: "number" }],
    item: [{ key: "acquired", type: "rule" }],
    structure: [{ key: "size", type: "size" }],
  });
});
test("704.1: only creatures, items and structures need anything (a tile and a feature need nothing)", () => {
  assert.deepEqual(Object.keys(required).sort(), ["creature", "item", "structure"]);
});
test("704.1: every required attribute has a key (lowercase letters and _) and one of the six value types", () => {
  const types = ["number", "yesno", "choice", "text", "size", "rule"];
  for (const list of Object.values(required)) for (const a of list) {
    assert.match(a.key, /^[a-z][a-z_]*$/);
    assert.ok(types.includes(a.type));
  }
});
test("704: the module is the rule, with no hooks (it is data; the platform reads `required`)", () => {
  assert.equal(rule.rule, 704);
  assert.deepEqual(Object.keys(rule), ["rule"]);
});
