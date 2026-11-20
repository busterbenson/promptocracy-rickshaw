// The text, the settings and the modules of the starter pack agree (the same check the bundler runs on every game).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { assembleRules, checkRulebook, parseRulesMd } from "promptocracy/engine/testing";

const here = new URL("../", import.meta.url);
const rulesMd = readFileSync(new URL("RULES.md", here), "utf8");
const settings = JSON.parse(readFileSync(new URL("settings.json", here), "utf8"));
const files = readdirSync(new URL("./", import.meta.url)).filter((f) => /^\d+\.ts$/.test(f)).sort();
const modules = await Promise.all(files.map(async (f) => (await import(`./${f}`)).default));

test("RULES.md, settings.json and the modules agree", () => {
  assert.deepEqual(checkRulebook({ rulesMd, settings, moduleRules: modules.map((m) => m.rule) }), []);
});
test("each module's file name is its rule number", () => {
  assert.deepEqual(files, modules.map((m) => `${m.rule}.ts`));
});
test("the modules assemble: exactly one spawn rule", () => {
  const rules = assembleRules(modules);
  assert.deepEqual(rules.implementers("spawnTile"), [505]);
  assert.deepEqual(rules.implementers("actionAllowed"), [202, 504]);
});
test("the text still has the rules the modules belong to", () => {
  const nums = parseRulesMd(rulesMd).rules.map((r) => r.number);
  for (const n of [202, 504, 505]) assert.ok(nums.includes(n));
});
