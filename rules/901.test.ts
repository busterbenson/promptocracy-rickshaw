import { test } from "node:test";
import assert from "node:assert/strict";
import { assembleRules, loadGame, makeCtx, parseRulesMd } from "promptocracy/engine/testing";
import rule from "./901.ts";

const { rulesMd, modules } = await loadGame(import.meta.url);
const rules = assembleRules(modules);
const flat = rulesMd.replace(/\s+/g, " ");

test("901: the grant action type names its parameters and the rules it touches", () => {
  assert.deepEqual(rule.actionType!(), {
    type: "grant", name: "Grant points", touches: [401, 402],
    params: [{ key: "to", label: "To", kind: "player", other: true }, { key: "amount", label: "Points", kind: "int", min: 1, max: 10 }],
  });
  assert.deepEqual(rules.actionTypes().map((t: any) => [t.type, t.rule]), [["grant", 901]]);
});
test("901: applying a grant gives the named player the points, with the proposal in the reason", () => {
  const out = rules.applyAction(makeCtx(), { type: "grant", params: { to: "p2", amount: 7 }, number: 12, player: "p1" });
  assert.deepEqual(out, [{ type: "points", player: "p2", delta: 7, reason: "P12 granted points", rule: 901 }]);
});
test("901: a type this game doesn't have is not applied (null, not an empty list)", () => {
  assert.equal(rules.applyAction(makeCtx(), { type: "resurrect", params: {}, number: 3, player: "p1" }), null);
});
test("901: the text says what the code does: 1 to 10 points, another player, touches 401 and 402", () => {
  assert.ok(flat.includes("**901.1** You can propose that another player gets 1 to 10 points."));
  assert.ok(flat.includes("**901.2** This action touches points (401) and winning (402)."));
  const d: any = rule.actionType!();
  assert.equal(d.params[1].min, 1);
  assert.equal(d.params[1].max, 10);
  assert.equal(d.params[0].other, true);
});
test("901: the rule carries its own mark (majority) inside a unanimous block, so adding an action type is unanimous and using this one is not", () => {
  assert.ok(flat.includes("## 900. Actions [unanimous]"));
  assert.ok(flat.includes("### 901 Grant points [majority]"));
  assert.deepEqual(parseRulesMd(rulesMd).rules.filter((r) => Math.floor(r.number / 100) === 9).map((r) => r.number), [901]);
});
test("103.5-103.7: the core text for actions", () => {
  assert.ok(flat.includes("**103.5** An action is a proposal that does one thing the game's rules already allow, and changes no rule. Only the action types in block 900 exist."));
  assert.ok(flat.includes("**103.6** An action needs the votes of its own rule (105.2) or of the strictest rule it touches (105.1), whichever is stricter."));
  assert.ok(flat.includes("**103.7** A passed action is applied each night with the other proposals, in the same order (107.2)."));
});
