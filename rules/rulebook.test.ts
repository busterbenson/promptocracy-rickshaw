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
  assert.deepEqual(rules.implementers("championChange"), [402]);
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
  assert.ok(flat.includes("No proposal is needed. Joining waits while the night is being processed (107.1)."));
  assert.ok(flat.includes("Day 1 begins when the host presses Start (102.2)"));
  assert.ok(!/adding or removing a player takes a passed proposal/i.test(flat));
});
test("103.2 lets you confirm up to 3 proposals a day, as the setting proposals.per_day; withdrawing frees a slot (103.3)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("**103.2** You can confirm up to 3 proposals a day. [setting: proposals.per_day] Each confirmed proposal gets the next number (P1, P2, ...) and goes on the next day's ballot."));
  assert.equal(settings["proposals.per_day"], 3);
  assert.ok(flat.includes("A withdrawn proposal doesn't count toward the limit (103.2)."));
  assert.ok(!/one proposal a day|one proposal for the day/i.test(flat));
});
test("block 800 is the workshop: majority, with exactly the clauses the platform's tickets implement", () => {
  const book = parseRulesMd(rulesMd);
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("## 800. The workshop [majority]"));
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 8).map((r) => r.number), [801, 803, 804]);
  for (const clause of ["801.1", "801.2", "801.3", "801.4", "801.5", "803.1", "804.1"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(flat.includes("A commission is a proposal like any other: it counts toward your proposals for the day (103.2)."));
  assert.ok(flat.includes("A commission that names nothing to make is refused, with the reason."));
  assert.ok(flat.includes("paid in full when it passes. If you can't pay it all, it waits as Ready and you pay on the first night you can; it joins the queue then (803.1). Points you pay no longer count toward winning (402)."));
  assert.ok(flat.includes("You can reopen a refused or failed commission as a draft; confirming it again counts toward that day's proposals (103.2)."));
  assert.ok(flat.includes("A commission joins the workshop's queue when it is paid for, in the order paid."));
  assert.ok(flat.includes("nobody can move, vote, propose, post in a ticket's discussion or end their turn, on the site or through an AI client (rule 204)."));
  assert.ok(flat.includes("Anyone in the game can post in a ticket's discussion."));
});
test("the workshop's text says nothing the site doesn't do yet: no Gremlin, no building, no limits (802), no creature (805)", () => {
  const block = rulesMd.slice(rulesMd.indexOf("## 800."));
  assert.ok(!/gremlin|builds?\b|\bbuilt\b|C1|creature \(/i.test(block.replace("(a creature, a tile, an item, or a feature like a forum)", "")));
  assert.ok(!/\*\*80[25]\.|### 80[25]/.test(block));
});
test("402 is Eras: 100 points wins an Era, ties by night order, points reset, the Champion names the next Era and has one change (the site enforces it)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("### 402 Eras"));
  assert.ok(flat.includes("**402.1** The game is played in Eras. The first Era starts on day 1. The first player to reach 100 points wins the Era, and the Era ends that night."));
  assert.ok(flat.includes("If several players pass 100 on the same night, the first one to be given them wins."));
  assert.ok(flat.includes("When an Era ends, everyone's points go back to 0, and the next Era starts the next day."));
  assert.ok(flat.includes("The Champion names the next Era."));
  assert.ok(flat.includes("It takes effect unless every other player votes against it. Not voting doesn't count as against."));
  assert.ok(flat.includes("**402.4** Once in each Era, the Champion can make one change of their own, on top of their proposals for the day (103.2)."));
  assert.ok(flat.includes("It can change any rule a proposal can change, one with a unanimous mark included."));
  assert.ok(flat.includes("It goes on the next day's ballot, and the player who makes it doesn't vote on it."));
  assert.ok(flat.includes("If there are no other players, it takes effect. A change that is withdrawn or not applied (107.7) doesn't count."));
  assert.ok(!/the game is over|deliberately dull/i.test(flat));
});
test("103, 104 and 105 name the one exception for the Champion's change (402.4), so 108.1 does not set the core rule against it", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("The Champion's change (402.4) doesn't count toward the limit."));
  assert.ok(flat.includes("Not voting counts as no, except on the Champion's change (402.4)."));
  assert.ok(flat.includes("The player who makes the Champion's change doesn't vote on it (402.4)."));
  assert.ok(flat.includes("The Champion's change is counted by 402.4 instead, here and in 103.4, 105.3 and 105.4."));
});
