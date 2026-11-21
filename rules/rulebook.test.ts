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
  assert.deepEqual(rules.implementers("actionType"), [901]);
  assert.deepEqual(rules.implementers("applyAction"), [901]);
});
test("the text still has the rules the modules belong to", () => {
  const nums = parseRulesMd(rulesMd).rules.map((r) => r.number);
  for (const n of [107, 202, 401, 402, 504, 505, 704, 901]) assert.ok(nums.includes(n));
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
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 8).map((r) => r.number), [801, 802, 803, 804]);
  for (const clause of ["801.1", "801.2", "801.3", "801.4", "801.5", "802.2", "803.1", "804.1"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(flat.includes("To add something new to the game (a new catalog entry of any kind, 702, or a rule that makes one do something), you commission it. A commission is a proposal like any other: it counts toward your proposals for the day (103.2)."));
  assert.ok(flat.includes("He draws each new entry while you draft it. You can keep any drawing he makes and pick the one the entry shows."));
  assert.ok(flat.includes("A commission that names nothing to make, or that would do something 802.2 rules out, is refused when it's drafted, with the reason."));
  assert.ok(flat.includes("It's paid in full when the commission passes. If you can't pay it all, it waits as Ready and you pay on the first night you can; it joins the queue then (803.1). Points you pay no longer count toward winning (402)."));
  assert.ok(flat.includes("You can reopen a refused or failed commission as a draft; confirming it again counts toward that day's proposals (103.2)."));
  assert.ok(flat.includes("A commission joins the workshop's queue when it is paid for, in the order paid."));
  assert.ok(flat.includes("nobody can move, vote, propose, post in a ticket's discussion, talk to Starling or Gremlin or end their turn, on the site or through an AI client (rule 204)."));
  assert.ok(flat.includes("Anyone in the game can post in a ticket's discussion."));
});
test("Starling's and Gremlin's rules: 106.2 to 106.4 and 106.7, the settings the site reads (the message caps, the thread-reply cap, the price ceiling), and the limit the workshop can't pass (802.2)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("**106.3** Gremlin moderates the workshop by day. He drafts your commissions with you and sets their price (801)."));
  assert.ok(flat.includes("**106.2** Starling moderates the rules by day. She drafts your proposals and actions with you (103.1, 103.5), names any rule they'd conflict with (108.3), and answers questions about the rules by quoting them."));
  assert.ok(flat.includes("**106.4** Starling and Gremlin can't change a rule, rule on what one means, or change an approved commission. They pass anything they can't settle to Chalant."));
  assert.ok(flat.includes("**106.7** Starling and Gremlin talk only with players, and only once the game has started (day 1, rule 203.1). Gremlin answers up to 30 of your messages a day [setting: gremlin.messages_per_day], and Starling up to 60 [setting: starling.messages_per_day]. At the limit they tell you, and they're back at midnight. Each redraw counts as a message."));
  assert.ok(flat.includes("Anyone in the game can post in a ticket's discussion. Gremlin answers up to 20 of your posts a day [setting: gremlin.thread_replies_per_day]; he hands questions he can't answer to the moderator."));
  assert.ok(flat.includes("**106.5** The moderator rules on what the rules mean. Every ruling names the rules it relies on and is written to `rulings/`. The moderator makes rulings at night, after applying the day's proposals, and answers where the question was asked. A ruling doesn't change any rule. Earlier rulings are precedent: they bind the moderator until a passed proposal changes the ruling or a rule it relies on, or an appeal succeeds (301)."));
  assert.equal(settings["starling.messages_per_day"], 60);
  assert.equal(settings["gremlin.thread_replies_per_day"], 20);
  assert.ok(flat.includes("up to 25 points [setting: workshop.price_ceiling]"));
  assert.equal(settings["gremlin.messages_per_day"], 30);
  assert.equal(settings["workshop.price_ceiling"], 25);
  assert.ok(flat.includes("**802.2** Nothing the workshop builds can share players' private information, weaken the site's security, break the law, or reach outside this game."));
});
test("the workshop's text says nothing the site doesn't do yet: no building, no limits (802.1), no creature (805)", () => {
  const block = rulesMd.slice(rulesMd.indexOf("## 800."));
  assert.ok(!/builds?\b|\bbuilt\b|C1|creature \(/i.test(block.replace(/\*\*802\.2\*\*[^\n]*/, "")));
  assert.ok(!/\*\*802\.1\*\*|\*\*805\.|### 805/.test(block));
});
test("402 is Eras: reaching the number of points wins an Era, ties by night order, points reset, the Champion names the next Era and has one change (the site enforces it)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("### 402 Eras"));
  // the number is a proposal's to change (402.1), so the text is pinned without it
  assert.match(flat, /\*\*402\.1\*\* The game is played in Eras\. The first Era starts on day 1\. The first player to reach \d+ points wins the Era, and the Era ends that night\./);
  assert.match(flat, /If several players pass \d+ on the same night, the first one to be given them wins\./);
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

// The mark a rule needs: its own, else its block's (105.2). Read from the headings, the way the site reads them.
function marks(md: string): Record<string, string> {
  const out: Record<string, string> = {};
  let block = "majority";
  for (const line of md.replace(/<!--[\s\S]*?-->/g, "").split("\n")) {
    const b = line.match(/^##\s+\d+\..*\[(unanimous|majority)\]\s*$/);
    if (b) block = b[1];
    const r = line.match(/^###\s+(\d{3})\s+.*?(?:\[(unanimous|majority)\])?\s*$/);
    if (r) out[r[1]] = r[2] || block;
  }
  return out;
}
test("rule 110 is retired: no rule or clause 110, and nothing cites it", () => {
  const book = parseRulesMd(rulesMd);
  assert.ok(!book.rules.some((r) => r.number === 110));
  assert.ok(!/^###\s+110\b|\*\*110\.\d+\*\*|rule 110|\(110(?:\.\d+)?\)|what no proposal can change/im.test(rulesMd));
});
test("what rule 110 listed is now ordinary rules, each unanimous: sign-in 102.5, the day 203.1, the proposal limit 103.2, End turn 202.4, hidden votes 104.4, votes counted by code 104.5, the lock 107.1, the deadline 107.6", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  const m = marks(rulesMd);
  for (const [clause, rule] of [["102.5", "102"], ["203.1", "203"], ["103.2", "103"], ["202.4", "202"], ["104.4", "104"], ["104.5", "104"], ["107.1", "107"], ["107.6", "107"]]) {
    assert.ok(flat.includes(`**${clause}**`), `${clause} is in the text`);
    assert.equal(m[rule], "unanimous", `${clause} needs everyone (rule ${rule})`);
  }
  assert.ok(flat.includes("**102.5** You sign in with a link sent to your email address."));
});
test("marking 202 and 203 unanimous leaves the rest of block 200 as it was: 201 and 204 stay majority", () => {
  const m = marks(rulesMd);
  assert.deepEqual([m["201"], m["204"], m["301"], m["401"], m["504"]], ["majority", "majority", "majority", "majority", "majority"]);
});
test("103.6 states that the parts the site doesn't let a rule control yet are refused at drafting, and lists them: the eight clauses of old rule 110, and this rule", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  const clause = flat.match(/\*\*103\.6\*\* (.*?)(?= \*\*|\s*###|$)/)?.[1] ?? "";
  assert.ok(clause.includes("A proposal that changes one of them, or conflicts with one, is refused when it is drafted, with the reason \"not wired yet\"."), clause);
  assert.ok(clause.includes("Adding a clause or a rule, or changing only a setting, is not refused."));
  assert.deepEqual([...clause.matchAll(/\((\d{3}\.\d+)\)/g)].map((m) => m[1]), ["102.5", "103.2", "104.4", "104.5", "107.1", "107.6", "202.4", "203.1"]);
  assert.ok(clause.includes("and this rule."));
  assert.equal(marks(rulesMd)["103"], "unanimous");
});
test("block 700 is making things: majority, with the clauses the catalog implements (701.3 waits for the code that numbers entries)", () => {
  const book = parseRulesMd(rulesMd);
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("## 700. Making things [majority]"));
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 7).map((r) => r.number), [701, 702, 703, 704, 705]);
  for (const clause of ["701.1", "701.2", "701.4", "702.1", "703.1", "703.2", "703.3", "704.1", "704.2", "704.3", "705.1", "705.2"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(!flat.includes("**701.3**"));
  assert.ok(flat.includes("Every entry is one kind: an item (I), a creature (C), a tile (T), a structure (S), or a feature (F). A feature is part of the site, not the board."));
  assert.ok(flat.includes("A creature needs hearts. An item needs the rule that gives it to you. A structure needs a size in tiles."));
  assert.ok(flat.includes("An entry can go live without an attribute its kind needs."));
});
