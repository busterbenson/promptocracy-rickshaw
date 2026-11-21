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
  const out = rules.applyAction(makeCtx({ players: [{ ref: "p1" }, { ref: "p2" }] }), { type: "grant", params: { to: "p2", amount: 7 }, number: 12, player: "p1" });
  assert.deepEqual(out, [{ type: "points", player: "p2", delta: 7, reason: "P12 granted points", rule: 901 }]);
});
const apply = (params: any, o: any = {}) => rules.applyAction(makeCtx({ players: [{ ref: "p1" }, { ref: "p2" }] }), { type: "grant", params, number: 12, player: "p1", ...o });
test("901.1: applying checks the details again (a rule changed tonight may have narrowed them): 1 to 10, a whole number, another player, in the game", () => {
  assert.match((rules.applyAction(makeCtx(), { type: "grant", number: 1, player: "p1" } as any) as any).error, /whole number from 1 to 10/);
  assert.match((apply({ to: 7, amount: 3 }) as any).error, /another player/);
  for (const amount of [0, 11, 2.5, -4, "7", null]) assert.match((apply({ to: "p2", amount }) as any).error, /whole number from 1 to 10/, String(amount));
  assert.match((apply({ to: "p1", amount: 3 }) as any).error, /another player/);
  assert.match((apply({ to: "p9", amount: 3 }) as any).error, /not in the game/);
  assert.equal((apply({ to: "p2", amount: 10 }) as any)[0].delta, 10);
  assert.equal((apply({ to: "p2", amount: 1 }) as any)[0].delta, 1);
});
test("901.2: it touches winning: 10 points on top of 95 wins the night (402), and the first player given points past 100 wins", () => {
  const given = apply({ to: "p2", amount: 10 }) as any;
  const end = rules.dayEnd(makeCtx(), { before: { p1: 0, p2: 95 }, given: [{ player: given[0].player, delta: given[0].delta }], enacted: [12] });
  assert.deepEqual(end.map((e: any) => [e.type, e.player]), [["win", "p2"]]);
  const two = rules.dayEnd(makeCtx(), { before: { p1: 95, p2: 95 }, given: [{ player: "p1", delta: 10 }, { player: "p2", delta: 10 }], enacted: [12, 13] });
  assert.deepEqual(two.map((e: any) => [e.type, e.player]), [["win", "p1"]]);
});
test("901.3 with 401: an action is a proposal, so one applied action gives the proposer 401's 10 and the player the grant", () => {
  const ctx = makeCtx({ players: [{ ref: "p1" }, { ref: "p2" }] });
  const both = [...rules.onEnacted(ctx, { number: 12, player: "p1", target: "901", kind: "action" }), ...(rules.applyAction(ctx, { type: "grant", params: { to: "p2", amount: 4 }, number: 12, player: "p1" }) as any)];
  assert.deepEqual(both.map((e: any) => [e.player, e.delta]), [["p1", 10], ["p2", 4]]);
});
test("901: a type this game doesn't have is not applied (null, not an empty list)", () => {
  assert.equal(rules.applyAction(makeCtx(), { type: "resurrect", params: {}, number: 3, player: "p1" }), null);
});
test("901: the text says what the code does: a whole number of points from 1 to 10, another player, touches 401 and 402", () => {
  assert.ok(flat.includes("**901.1** You can propose that another player gets a whole number of points, from 1 to 10."));
  assert.ok(flat.includes("**901.2** This action touches points (401) and winning (402)."));
  const d: any = rule.actionType!();
  assert.equal(d.params[1].min, 1);
  assert.equal(d.params[1].max, 10);
  assert.equal(d.params[0].other, true);
});
test("block 900 is unanimous and rule 901 carries its own majority (105.2): adding an action type needs everyone, using this one does not", () => {
  assert.ok(flat.includes("## 900. Actions [unanimous]"));
  assert.ok(flat.includes("### 901 Grant points [majority]"));
  assert.deepEqual(parseRulesMd(rulesMd).rules.filter((r) => Math.floor(r.number / 100) === 9).map((r) => r.number), [901]);
});
test("every module that names an action type is a rule of block 900 (103.5: only the types in block 900 exist), and block 900 holds only those", () => {
  const types = rules.actionTypes().map((t: any) => t.rule);
  assert.ok(types.every((n: number) => n >= 900 && n < 1000));
  assert.deepEqual(parseRulesMd(rulesMd).rules.filter((r) => Math.floor(r.number / 100) === 9).map((r) => r.number), types);
});
test("103.5-103.7: the core text for actions", () => {
  assert.ok(flat.includes("**103.5** An action is a proposal that does one thing the game's rules already allow, and changes no rule. Only the action types in block 900 exist."));
  assert.ok(flat.includes("**901.3** The points are given when the action is applied (103.7)."));
  assert.ok(flat.includes("**103.6** An action needs the votes its own rule asks for (105.2) or the votes of the strictest rule it touches, whichever is stricter."));
  assert.ok(flat.includes("**103.7** A passed action is applied each night after the proposals that change rules, in the order they were proposed (107.2)."));
  assert.ok(flat.includes("An action whose type the rules no longer have, or whose details they no longer allow, is not applied (107.7)."));
});
