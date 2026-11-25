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
  assert.deepEqual(rules.implementers("actionAllowed"), [202, 504, 604]);
  assert.deepEqual(rules.implementers("giveHeart"), [603]);
  assert.deepEqual(rules.implementers("night"), [602, 603]);
  assert.deepEqual(rules.implementers("ending"), [404]);
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
  assert.ok(flat.includes("Any player can invite people to join while the game isn't full (201.1), before day 1 and after it."));
  assert.ok(flat.includes("No proposal is needed. Joining waits while the night is being processed (107.1)."));
  assert.ok(flat.includes("Day 1 begins when the game is started (102.2)"));
  assert.ok(!/adding or removing a player takes a passed proposal/i.test(flat));
});
test("103.2 lets you confirm up to 3 proposals a day, as the setting proposals.per_day; withdrawing frees a slot (103.3)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("**103.2** You can confirm up to 3 proposals a day. [setting: proposals.per_day] Each confirmed proposal gets the next number (P1, P2, ...) and goes on the ballot (104.3). The Champion's change (402.4) doesn't count toward the limit."));
  assert.equal(settings["proposals.per_day"], 3);
  assert.ok(flat.includes("A withdrawn proposal doesn't count toward the limit (103.2)."));
  assert.ok(!/one proposal a day|one proposal for the day/i.test(flat));
});
test("block 800 is the workshop: majority, with exactly the clauses the platform's tickets implement", () => {
  const book = parseRulesMd(rulesMd);
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("## 800. The workshop"));
  for (const n of ["801", "802", "803", "804"]) assert.equal(marks(rulesMd)[n], "majority", n);
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 8).map((r) => r.number), [801, 802, 803, 804]);
  for (const clause of ["801.1", "801.2", "801.3", "801.4", "801.5", "801.7", "801.8", "802.1", "803.1", "804.1"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(flat.includes("A commission is a proposal like any other (103): the way a catalog entry comes in or changes (701.2), or a new rule that makes an entry do something."));
  assert.ok(flat.includes("He draws each new entry while you draft it. You can keep any drawing he makes and pick the one the entry shows."));
  assert.ok(flat.includes("A commission that names nothing to make, or that would do something the workshop's limits rule out (802.1), is refused when it's drafted, with the reason."));
  assert.ok(flat.includes("It's paid in full when the commission passes. If you can't pay it all, it waits as Ready and you pay on the first night you can (803.1). Points you pay no longer count toward winning (402.2)."));
  assert.ok(flat.includes("You can reopen a refused or failed commission as a draft and confirm it again (103.1)."));
  assert.ok(flat.includes("**801.7** Gremlin sets a commission's nights, price, running cost, tasks and the rules it makes, and you change them by talking to him. You can lock it in once he has drafted it (103.1)."));
  assert.ok(flat.includes("**801.8** You can discard your commission while it's still a draft."));
  assert.ok(flat.includes("A commission joins the workshop's queue when it is paid for, in the order paid."));
  assert.ok(flat.includes("nobody can move, vote, propose, post in a ticket's discussion, talk to Starling or Gremlin or end their turn, on the site or through an AI client (rule 204)."));
  assert.ok(flat.includes("Anyone in the game can post in a ticket's discussion."));
});
test("Starling's and Gremlin's rules: 106.2 to 106.4 and 106.7, the settings the site reads (the message caps, the thread-reply cap, the price ceiling), and the limit the workshop can't pass (802.1)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("**106.3** Gremlin moderates the workshop by day (801, 804)."));
  assert.ok(flat.includes("**106.2** Starling moderates the rules by day (103.1, 103.5, 108.3). She answers questions about the rules by quoting them."));
  assert.ok(flat.includes("**106.4** Starling and Gremlin can't change a rule, rule on what one means, or change an approved commission. They pass anything they can't settle to Chalant."));
  // 107.6, checked in two pieces: the bundler's lint refuses the word for Node's global object anywhere in game code, strings included
  assert.ok(flat.includes("**107.6** The moderator has until 3:00 am to"));
  assert.ok(flat.includes("the day; a passed proposal not applied by then is not applied (rule 107.7). The changes it made must be live by 4:00 am; a change not live by then is not applied either."));
  assert.ok(flat.includes("**106.7** Starling and Gremlin talk only with players, and only once the game has started (day 1, rule 203.1). Gremlin answers up to 100 of your messages a day [setting: gremlin.messages_per_day], and Starling up to 100 [setting: starling.messages_per_day]. At the limit they tell you, and they're back at midnight. Each redraw counts as a message."));
  assert.ok(flat.includes("Anyone in the game can post in a ticket's discussion. Gremlin answers up to 20 of your posts a day [setting: gremlin.thread_replies_per_day]."));
  assert.ok(flat.includes("**106.5** The moderator rules on what the rules mean. Every ruling names the rules it relies on and is written to `rulings/`. The moderator makes rulings at night, after applying the day's proposals, and answers where the question was asked. A ruling doesn't change any rule. Earlier rulings are precedent: they bind the moderator until a passed proposal changes the ruling or a rule it relies on, or an appeal succeeds (301)."));
  assert.equal(settings["starling.messages_per_day"], 100);
  assert.equal(settings["gremlin.thread_replies_per_day"], 20);
  assert.ok(flat.includes("up to 25 points [setting: workshop.price_ceiling]"));
  assert.equal(settings["gremlin.messages_per_day"], 100);
  assert.equal(settings["workshop.price_ceiling"], 25);
  assert.ok(flat.includes("**802.1** Nothing the workshop builds can share players' private information, weaken the site's security, break the law, or reach outside this game."));
});
test("the workshop's text says nothing the site doesn't do yet: no building, no budgets or nightly limits, no creature (805)", () => {
  const block = rulesMd.slice(rulesMd.indexOf("## 800."));
  assert.ok(!/builds?\b|\bbuilt\b|C1|creature \(/i.test(block.replace(/\*\*802\.1\*\*[^\n]*/, "")));
  assert.ok(!/\*\*802\.2\*\*|\*\*805\.|### 805/.test(block));
});
test("402 is Eras: reaching the number of points wins an Era, ties by night order, points reset, the Champion names the next Era and has one change (the site enforces it)", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("### 402 Eras"));
  // the number is the setting eras.points_to_win, a proposal's to change, so the text is pinned without it
  assert.match(flat, /\*\*402\.1\*\* The game is played in Eras\. The first Era starts on day 1\./);
  assert.match(flat, /\*\*402\.2\*\* The first player to reach \d+ points wins the Era\. \[setting: eras\.points_to_win\] If several players reach it on the same night, the first one given the points wins \(401\.1, 107\.2\)\./);
  assert.match(flat, /\*\*402\.3\*\* When a player wins the Era \(402\.2\), the Era ends that night\. Everyone's points go back to 0, and the next Era starts the next day\./);
  assert.equal(typeof settings["eras.points_to_win"], "number");   // its value is a proposal's to change
  assert.ok(flat.includes("The Champion names the next Era."));
  assert.ok(flat.includes("It takes effect unless every other player who may vote (104.2) votes against it. Not voting doesn't count as against."));
  assert.ok(flat.includes("**402.4** Once in each Era, the Champion can make one change of their own."));
  assert.ok(flat.includes("It can change any rule a proposal can change, one with a unanimous mark included."));
  assert.ok(flat.includes("It goes on the ballot like any proposal (104.3), except as 103.2 and 104.3 say."));
  assert.ok(flat.includes("If there is no such player, it takes effect. A change that is withdrawn or not applied (107.7) doesn't count."));
  assert.ok(!/the game is over|deliberately dull/i.test(flat));
});
test("103, 104 and 105 name the one exception for the Champion's change (402.4), so 108.1 does not set the core rule against it", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("The Champion's change (402.4) doesn't count toward the limit."));
  assert.ok(flat.includes("Not voting counts neither for nor against, and the Champion's change is counted by 402.4."));
  assert.ok(flat.includes("The player who makes the Champion's change doesn't vote on it (402.4)."));
  assert.ok(flat.includes("The Champion's change is counted by 402.4 instead, here and in 103.4, 105.3 and 105.4."));
});

// The mark a rule has: its own, [u] or [m] after its title (105.1). Read from the headings, the way the site reads them.
function marks(md: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of md.replace(/<!--[\s\S]*?-->/g, "").split("\n")) {
    const r = line.match(/^###\s+(\d{3})\s+.*?\[(unanimous|majority|u|m)\]\s*$/);
    if (r) out[r[1]] = r[2][0] === "u" ? "unanimous" : "majority";
  }
  return out;
}
test("rule 110 is retired: no rule or clause 110, and nothing cites it", () => {
  const book = parseRulesMd(rulesMd);
  assert.ok(!book.rules.some((r) => r.number === 110));
  assert.ok(!/^###\s+110\b|\*\*110\.\d+\*\*|rule 110|\(110(?:\.\d+)?\)|what no proposal can change/im.test(rulesMd));
});
test("what rule 110 listed is now ordinary rules, each unanimous: sign-in 102.4, the day 203.1, the proposal limit 103.2, End turn 202.4, hidden votes 104.4, votes counted by code 104.5, the lock 107.1, the deadline 107.6", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  const m = marks(rulesMd);
  for (const [clause, rule] of [["102.4", "102"], ["203.1", "203"], ["103.2", "103"], ["202.4", "202"], ["104.4", "104"], ["104.5", "104"], ["107.1", "107"], ["107.6", "107"]]) {
    assert.ok(flat.includes(`**${clause}**`), `${clause} is in the text`);
    assert.equal(m[rule], "unanimous", `${clause} needs everyone (rule ${rule})`);
  }
  assert.ok(flat.includes("**102.4** You sign in with a link sent to your email address."));
});
test("marking 202 and 203 unanimous leaves the rest of block 200 as it was: 201 and 204 stay majority", () => {
  const m = marks(rulesMd);
  assert.deepEqual([m["201"], m["204"], m["301"], m["401"], m["504"]], ["majority", "majority", "majority", "majority", "majority"]);
});
test("103.6 states that the parts the site doesn't let a rule control yet are refused at drafting, and lists them: the eight clauses of old rule 110, and this clause", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  const clause = flat.match(/\*\*103\.6\*\* (.*?)(?= \*\*|\s*###|$)/)?.[1] ?? "";
  assert.ok(clause.includes("A proposal that changes one of them, or conflicts with one, is refused when it is drafted, with the reason \"not wired yet\"."), clause);
  assert.ok(clause.includes("Adding a clause or a rule, or changing only a setting, is not refused."));
  assert.deepEqual([...clause.matchAll(/\((\d{3}\.\d+)\)/g)].map((m) => m[1]), ["102.4", "103.2", "104.4", "104.5", "107.1", "107.6", "202.4", "203.1"]);
  assert.ok(clause.includes("and this clause."));
  assert.equal(marks(rulesMd)["103"], "unanimous");
});
test("block 700 is making things: majority, with the clauses the catalog implements (nothing promises entry numbering yet)", () => {
  const book = parseRulesMd(rulesMd);
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("## 700. Making things"));
  for (const n of ["701", "702", "703", "704", "705"]) assert.equal(marks(rulesMd)[n], "majority", n);
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 7).map((r) => r.number), [701, 702, 703, 704, 705]);
  for (const clause of ["701.1", "701.2", "701.3", "702.1", "703.1", "703.2", "703.3", "704.1", "704.2", "704.3", "705.1"]) assert.ok(flat.includes(`**${clause}**`), clause);
  assert.ok(!flat.includes("**705.2**"));
  assert.ok(!/entries are numbered|entry number/i.test(flat));
  assert.ok(flat.includes("Every entry is one kind: an item (I), a creature (C), a tile (T), a structure (S), or a feature (F). A feature is part of the site, not the board."));
  assert.ok(flat.includes("A creature needs hearts. An item needs the rule that gives it to you. A structure needs a size in tiles."));
  assert.ok(flat.includes("An entry can go live without an attribute its kind needs."));
});
test("109: the rulebook has three levels, a rule is its title and its clauses, and a value tagged as a setting is kept in the settings file", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(flat.includes("### 109 Numbers and settings [u] **109.1** The rulebook has three levels."));
  assert.ok(flat.includes("A rule, such as 804, is its title, its mark (105.1) and its clauses: it has no text of its own."));
  assert.ok(flat.includes("Citing a block cites all its rules, and citing a rule cites all its clauses."));
  assert.ok(flat.includes("Before day 1 they have no gaps. Once the game has started, a repealed clause leaves its number empty."));
  assert.ok(flat.includes("**109.2** A value the text tags as a setting is kept in the game's settings file, and the text and the file always agree."));
  assert.ok(!flat.includes("**109.3**"));
});
test("no rule has text of its own: the first line under each title is one of its clauses (N.1 before day 1; after a repeal it can be a later number, 109.1)", () => {
  const lines = rulesMd.replace(/<!--[\s\S]*?-->/g, "").split("\n");
  const bad: string[] = [];
  lines.forEach((l, i) => {
    const m = /^###\s+(\d{3})\s/.exec(l);
    if (!m) return;
    const next = lines.slice(i + 1).find((x) => x.trim() !== "") ?? "";
    if (!new RegExp(`^\\*\\*${m[1]}\\.\\d+\\*\\*`).test(next) && !/^\[(Repealed|Moved to \d+)\]/.test(next)) bad.push(m[1]);
  });
  assert.deepEqual(bad, []);
});
test("the rules that had text under their title now state it as clause 1, word for word", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  // One line per rule, so a passed proposal that rewords one of them can update only its own line (the moderator's night may change a line that names the rule it changes).
  assert.ok(flat.includes("**101.1** Every player, and the moderator, must follow the rules"), "101");
  assert.ok(flat.includes("**201.1** A game has at most 8 players."), "201");
  assert.ok(flat.includes("**204.1** A player may connect an AI client"), "204");
  assert.ok(flat.includes("**301.1** Any player may appeal a ruling within 24 hours"), "301");
  assert.ok(flat.includes("**401.1** A player whose proposal passes and is applied gets 10 points when it is applied (rule 107)."), "401");
  assert.ok(flat.includes("**403.1** If the rules are changed so that further play is impossible,"), "403");
  assert.ok(flat.includes("**501.1** The grid is infinite."), "501");
  assert.ok(flat.includes("**502.1** Tiles are named row first"), "502");
  assert.ok(flat.includes("**503.1** The game starts with an 8x8 charted island"), "503");
  assert.ok(flat.includes("**505.1** A new player's piece starts on a random unoccupied charted tile"), "505");
});
test("repeals and closed gaps: 102 ends at 102.4 (sign-in), 504 has 504.1 and 504.2, 802 has 802.1, 705 has only 705.1", () => {
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.ok(!flat.includes("you vote from the next day (104.2)"));
  for (const gone of ["**102.5**", "**504.3**", "**701.4**", "**705.2**", "**802.2**"]) assert.ok(!flat.includes(gone), gone);
  assert.ok(flat.includes("**504.1** When you move, every tile within 2 tiles of you is charted [setting: board.chart_radius], except the 4 corners of that square."));
  assert.ok(flat.includes("**504.2** You can only move onto a charted tile that no other piece stands on."));
  assert.ok(flat.includes("every tile that a move onto it would chart (rule 504.1) is already charted."));
});

test("block 600 and rule 404: hearts, hostile creatures, death, Ghosts and the three endings, with the core edits for the dead (603.1, 202.5)", () => {
  const book = parseRulesMd(rulesMd);
  const flat = rulesMd.replace(/\s+/g, " ");
  assert.deepEqual(book.rules.filter((r) => Math.floor(r.number / 100) === 6).map((r) => r.number), [601, 602, 603, 604]);
  assert.ok(book.rules.some((r) => r.number === 404));
  for (const c of ["601.1", "601.2", "601.3", "602.1", "602.2", "602.3", "602.4", "602.5", "603.1", "603.2", "603.3", "603.4", "604.1", "604.2", "202.5", "404.1", "404.2", "404.3", "404.4"]) assert.ok(flat.includes(`**${c}**`), c);
  for (const [k, v] of [["hearts.start", 3], ["creatures.appear_steps", 3], ["creatures.bite", 1], ["death.ghost_days", 3]] as const) {
    assert.equal(settings[k], v);
    assert.ok(flat.includes(`[setting: ${k}]`), k);
  }
  assert.ok(flat.includes("counted among the players who voted on it. Majority: more than half of them vote yes. Unanimous: every one of them votes yes. A proposal nobody votes on fails."));
  assert.ok(flat.includes("**105.4** A proposal's mark is set when it is confirmed, from the marks in effect then."));
  assert.ok(flat.includes("are the living players (603.1) when the day starts."));
  assert.ok(flat.includes("Every player who may vote (104.2), the proposer included, may vote"));
  assert.ok(flat.includes("Each day, every living player (603.1) and every Ghost (604.1) gets one turn."));
  assert.ok(flat.includes("the first living player (603.1) who is unable to complete a turn wins."));
  assert.ok(flat.includes("**404.3** Last one standing: when a night's deaths leave one living player (603.1), the game ends badly. Nobody wins, and that player becomes the King of Ghosts."));
  assert.ok(flat.includes("**202.5** Only living players (603.1) can vote or make proposals. A dead player can't move, but a Ghost can (604.1)."));
  assert.ok(flat.includes("**604.1** A Ghost has a turn each day (202.1). Its moves chart tiles like anyone's (504.1)."));
  assert.ok(!flat.includes("Rules may add more things to do on a turn."));
});
