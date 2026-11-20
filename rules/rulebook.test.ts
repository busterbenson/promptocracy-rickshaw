// The text, the settings and the modules of the game agree (the same check the bundler runs on every game).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assembleRules, checkRulebook, loadGame, parseRulesMd } from "promptocracy/engine/testing";

const { rulesMd, settings, files, modules } = await loadGame(import.meta.url);

test("RULES.md, settings.json and the modules agree", () => {
  assert.deepEqual(checkRulebook({ rulesMd, settings, moduleRules: modules.map((m) => m.rule) }), []);
});
test("each module's file name is its rule number", () => {
  assert.deepEqual(files, modules.map((m) => `${m.rule}.ts`));
});
test("the modules assemble: exactly one spawn rule and one order rule", () => {
  const rules = assembleRules(modules);
  assert.deepEqual(rules.implementers("spawnTile"), [505]);
  assert.deepEqual(rules.implementers("applyOrder"), [107]);
  assert.deepEqual(rules.implementers("onEnacted"), [401]);
  assert.deepEqual(rules.implementers("dayEnd"), [402]);
  assert.deepEqual(rules.implementers("actionAllowed"), [202, 504]);
});
test("the text still has the rules the modules belong to", () => {
  const nums = parseRulesMd(rulesMd).rules.map((r) => r.number);
  for (const n of [107, 202, 401, 402, 504, 505]) assert.ok(nums.includes(n));
});
test("102 says who the host is and who can invite, with no proposal; 203.1 says the host starts day 1 (the site enforces both)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  for (const clause of ["102.1", "102.2", "102.3", "102.4"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(flat.includes("The first player to join is the host. The host's only power is to start the game (203.1)."));
  assert.ok(flat.includes("Any player can invite people to join while the game isn't full (201), before day 1 and after it."));
  assert.ok(flat.includes("No proposal is needed."));
  assert.ok(flat.includes("Day 1 begins when the host presses Start (102.2)"));
  assert.ok(!/adding or removing a player takes a passed proposal/i.test(flat));
});
