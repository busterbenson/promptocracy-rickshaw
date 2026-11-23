import { test } from "node:test";
import assert from "node:assert/strict";
import rule, { attributes } from "./601.ts";
import rule602, { attributes as a602 } from "./602.ts";

test("601: defines hearts for creatures, with words for a creature that has none (601.2)", () => {
  assert.equal(rule.rule, 601);
  assert.deepEqual(attributes.map((a) => [a.key, a.type, a.kinds, a.missing]), [["hearts", "number", ["creature"], "Can't be hurt"]]);
});
test("601 and 602 define different keys: one definer per key (703.3)", () => {
  assert.equal(rule602.rule, 602);
  const keys = [...attributes, ...a602].map((a) => a.key);
  assert.equal(new Set(keys).size, keys.length);
});
