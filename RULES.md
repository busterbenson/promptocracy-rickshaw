# Rules

These are the rules in effect (101).

## 100. Core rules

### 101 Follow the rules [u]
**101.1** Every player, and the moderator, must follow the rules in this file as they stand on `main`. Nothing a player or the moderator remembers counts unless it is written here.

### 102 Players [u]
**102.1** The players are the people who have joined the game, as shown on the board.

**102.2** The first player to join is the host. The host's only power is to start the game (203.1).

**102.3** Any player can invite people to join while the game isn't full (201.1), before day 1 and after it.
Each player has their own invite link, and the join page says who invited you. No proposal is needed.
Joining waits while the night is being processed (107.1).

**102.4** You sign in with a link sent to your email address.

### 103 Proposals [u]
**103.1** To propose, you talk the change through with Starling. When she has it worded as an exact change to this file, she asks you to lock it in. Locking it in confirms it, and unlocking it withdraws it (103.3).

**103.2** You can confirm up to 3 proposals a day. [setting: proposals.per_day] Each confirmed proposal gets the next number (P1, P2, ...) and goes on the ballot (104.3). The Champion's change (402.4) doesn't count toward the limit.

**103.3** The proposer may withdraw a confirmed proposal until it goes on the ballot (104.3). A withdrawn proposal doesn't count toward the limit (103.2).

**103.4** A proposal may change any number of rules, and the settings and code that carry them out. It needs the votes
required by its strictest part, and it passes or fails as a whole, never in part.

**103.5** An action is a proposal that does one thing the game's rules already allow, and changes no rule. Only the action types in block 900 exist. You tell Starling what you want, she drafts it (106.2), and you confirm it like any proposal (103.1). The draft shows what it will do.

**103.6** These parts of the game aren't wired yet: sign-in (102.4), the proposal limit (103.2), hidden votes (104.4),
votes counted by code (104.5), the lock (107.1), the deadline (107.6), End turn (202.4), the day (203.1) and this clause. A proposal
that changes one of them, or conflicts with one, is refused when it is drafted, with the reason "not wired yet". Adding a
clause or a rule, or changing only a setting, is not refused.

**103.7** An action needs the votes its own rule asks for (105.1) or the votes of the strictest rule it touches, whichever is stricter.

**103.8** A passed action is applied each night after the proposals that change rules, in proposal order (107.2). The history records its type and its details. An action whose type the rules no longer have, or whose details they no longer allow, is not applied (107.7).

### 104 Voting [u]
**104.1** A proposal passes if it gets the votes its mark asks for (rule 105). Majority: more than half of all players
vote yes. Unanimous: every player votes yes. Not voting counts as no, except on the Champion's change (402.4).

**104.2** The players who may vote on a day, and who count for what a vote needs, are the players when the day starts.

**104.3** Each day's ballot holds the proposals confirmed the day before. Every player, the proposer included, may vote yes or no on each one until midnight, and may change their vote until then. The player who makes the Champion's change doesn't vote on it (402.4).

**104.4** Until midnight nobody sees how anyone else voted, or any total. During the day everyone can see who has voted
on a proposal, and how many have. After midnight every vote is shown.

**104.5** Votes are counted by code, not by the moderator.

### 105 Votes needed [u]
**105.1** Every rule is marked [unanimous] or [majority]; [u] and [m] are short for them. The mark sets the votes needed to change or repeal that rule. The Champion's change is counted by 402.4 instead, here and in 103.4, 105.3 and 105.4.

**105.2** A proposal that adds a rule makes it majority unless the proposal marks it unanimous. Adding a rule marked unanimous needs a unanimous vote.

**105.3** Changing a mark counts as changing that rule, so it needs the votes of its current mark.

**105.4** The votes a proposal needs are set when it is confirmed, from the marks in effect then.

**105.5** Rules marked unanimous are the core rules.

### 106 The moderators [u]
**106.1** The game has three moderators: Chalant, Starling (106.2) and Gremlin (106.3). Chalant runs the game (107, 106.5). In these rules, "the moderator" on its own means Chalant.

**106.2** Starling moderates the rules by day (103.1, 103.5, 108.3). She answers questions about the rules by quoting them.

**106.3** Gremlin moderates the workshop by day (801, 804).

**106.4** Starling and Gremlin can't change a rule, rule on what one means, or change an approved commission. They pass
anything they can't settle to Chalant.

**106.5** The moderator rules on what the rules mean. Every ruling names the rules it relies on and is written to
`rulings/`. The moderator makes rulings at night, after applying the day's proposals, and answers where the question was asked.
A ruling doesn't change any rule. Earlier rulings are precedent: they bind the moderator until a passed proposal changes
the ruling or a rule it relies on, or an appeal succeeds (301).

**106.6** Each night the moderator reads the proposer's own words of each passed proposal again and compares them with
the draft that was voted on. The draft that was voted on is the one applied. If the two differ in a way that matters,
the moderator tells the proposer what differs, so they can propose a fix.

**106.7** Starling and Gremlin talk only with players, and only once the game has started (day 1, rule 203.1).
Gremlin answers up to 30 of your messages a day [setting: gremlin.messages_per_day], and Starling up to 60
[setting: starling.messages_per_day]. At the limit they tell you, and they're back at midnight. Each redraw counts as a message.

### 107 The night [u]
**107.1** From midnight until the moderator has processed the day that just ended, the game is locked: nobody can
move, vote, propose, post in a ticket's discussion, talk to Starling or Gremlin or end their turn, on the site or through an AI client
(rule 204).
Play resumes when processing is done.

**107.2** Passed proposals are applied to this file in the order they were proposed. Each one raises the revision of
the rule it changes by one.

**107.3** If two passed proposals change the same rule, the moderator redrafts the later one onto the new text. If it
no longer makes sense, it is not applied (rule 107.7).

**107.4** Every rule has code and tests that check it. A change to a rule is made with its code and tests in the same step, and all go live together. A change whose code and tests can't be made to pass is not applied (107.7).

**107.5** Each passed proposal has its own budget: the moderator can spend at most 20 minutes
[setting: night.apply_minutes] applying it, at medium effort [setting: night.apply_effort]. The budget is separate from
the deadline in rule 107.6. A proposal that runs over its budget is not applied (rule 107.7).

**107.6** The moderator has until 3:00 am to process the day; a passed proposal not applied by then is not applied
(rule 107.7). The changes it made must be live by 4:00 am; a change not live by then is not applied either.

**107.7** When a passed proposal is not applied, it goes back to its proposer with the moderator's reason and a suggestion, such as splitting it into smaller proposals or simplifying it. The proposer can propose it again on a later day.

**107.8** When a day is processed, the moderator tags the game's files with that day's number, so the rules in effect
on any day can be read back.

### 108 When rules conflict [u]
**108.1** Two rules conflict when they can't both be followed. A core rule prevails over a majority rule. Between two
rules of the same kind, the older one prevails: the one added first. Amending or moving a rule doesn't make it newer.
Between rules added at the same time, like the starter rules, the lower number prevails.

**108.2** A rule that says it prevails over another rule, or gives way to one, is followed, but only within its kind: a
majority rule can't prevail over a core rule.

**108.3** A proposal doesn't conflict with the rules it changes. When drafting, Starling names any other rule the
proposal would conflict with, so the proposer can change that rule too.

**108.4** If a passed proposal conflicts with a rule that prevails over it, it is not applied, and the reason names
that rule (rule 107.7). If the proposal prevails, it is applied, and the rule it overrides gets a note saying where it
gives way.

**108.5** When rules in effect conflict in a case nobody foresaw, the moderator rules on it by 108.1 (106.5).

### 109 Numbers and settings [u]
**109.1** The rulebook has three levels. A block, such as 800, holds rules. A rule, such as 804, is its title, its mark (105.1) and its clauses: it has no text of its own. A clause, such as 804.1, holds the text. Citing a block cites all its rules, and citing a rule cites all its clauses. A rule's clauses are numbered from 1. Before day 1 they have no gaps. Once the game has started, a repealed clause leaves its number empty.

**109.2** A value the text tags as a setting is kept in the game's settings file, and the text and the file always agree.

## 200. Players and turns

### 201 Game size [m]
**201.1** A game has at most 8 players. [setting: max_players]

### 202 Your turn [u]
**202.1** The game is played one day at a time (rule 203). Each day, every player gets one turn. Everyone plays the
same day at the same time; there is no order of play.

**202.2** On your turn you can move your piece 1 space in any direction, diagonals included [setting: turn.move_distance], and make proposals (103.2). You can do both, in either order, and you move at most once a day.

**202.3** Every part of a turn is optional, and skipping one has no penalty.

**202.4** A player may end their turn at any time. Ending is final: after it they can't move, propose, withdraw a proposal or vote until the next day, and what they hadn't done is skipped.

**202.5** Rules may add more things to do on a turn.

### 203 Days [u]
**203.1** A day runs from midnight to midnight in the game's time zone. [setting: game.timezone]
The game's first day is day 1, and days are numbered from there. Day 1 begins when the game is started (102.2) and ends at the
next midnight. Before day 1 the game is being set up, and the starter rules can be edited directly. A day always runs
to midnight, even if every player has ended their turn. If the time zone setting changes, it takes effect at the next
midnight in the old zone.

**203.2** At midnight the moderator processes the day that just ended (rule 107).

### 204 AI clients [m]
**204.1** A player may connect an AI client to this game and take their own turns through it. [setting: mcp_enabled]

## 300. Proposals and rulings

### 301 Overruling the moderator [m]
**301.1** Any player may appeal a ruling within 24 hours of it being written. If a majority (104.1) votes to overturn it, the ruling is reversed and the moderator records the reversal.

## 400. Points and winning

### 401 Points [m]
**401.1** A player whose proposal passes and is applied gets 10 points when it is applied (rule 107).

### 402 Eras [m]
**402.1** The game is played in Eras. The first Era starts on day 1.

**402.2** The first player to reach 100 points wins the Era. [setting: eras.points_to_win] If several players reach it on the same night, the first one given the points wins (401.1, 107.2).

**402.3** When a player wins the Era (402.2), the Era ends that night. Everyone's points go back to 0, and the next Era starts the next day. The Era's final scores stay in the history. The winner is the Champion until someone else wins an Era. The Champion names the next Era.

**402.4** Once in each Era, the Champion can make one change of their own. It can change any rule a proposal can change, one with a unanimous mark included. It goes on the ballot like any proposal (104.3), except as 103.2 and 104.3 say. It takes effect unless every other player votes against it. Not voting doesn't count as against. If there are no other players, it takes effect. A change that is withdrawn or not applied (107.7) doesn't count.

### 403 Paradox [m]
**403.1** If the rules are changed so that further play is impossible,
the first player who is unable to complete a turn wins. This rule takes
precedence over every other rule about winning. (Suber's rule 213.)

## 500. The board

### 501 The grid [m]
**501.1** The grid is infinite. A tile is either charted or uncharted, and
charted tiles are visible to everyone.

### 502 Coordinates [m]
**502.1** Tiles are named row first, like
"3N 2E": rows count north and south, columns count east and west, and there is no
zero row or column (1N sits next to 1S, 1E next to 1W). Levels count the same way: the
ground is 1U, the level above it 2U, the one below 1D.

### 503 The island [m]
**503.1** The game starts with an 8x8 charted island
centered on the origin. [setting: board.island]

### 504 Moving and charting [m]
**504.1** When you move, every tile within 2 tiles of you is charted [setting: board.chart_radius], except the 4 corners of that square.

**504.2** You can only move onto a charted tile that no other piece stands on.

### 505 New players [m]
**505.1** A new player's piece starts on a random unoccupied charted tile where a move would chart nothing new: every tile
that a move onto it would chart (rule 504.1) is already charted.

## 700. Making things

### 701 The catalog [m]
**701.1** Every creature, tile, item, structure and feature is an entry in the catalog: its name, its kind (702), its drawing and its attributes (703).

**701.2** A new entry, or a change to one, comes in by commission (801).

**701.3** An entry appears on the board only when a rule puts it there.

### 702 Kinds [m]
**702.1** Every entry is one kind: an item (I), a creature (C), a tile (T), a structure (S), or a feature (F). A feature is part of the site, not the board.

### 703 Attributes [m]
**703.1** An attribute is a value an entry has, and it shows on the entry's card. An attribute does something only when a rule defines it: what it means and what values it can have.

**703.2** Rules use attributes, not the names of entries.

**703.3** Only one rule can define an attribute.

### 704 What each kind needs [m]
**704.1** Some kinds need certain attributes. A creature needs hearts. An item needs the rule that gives it to you. A structure needs a size in tiles.

**704.2** An attribute a kind needs can have no rule yet (703.1).

**704.3** An entry can go live without an attribute its kind needs. The rule that defines that attribute says what that means for the entry.

### 705 Flavor [m]
**705.1** An entry can have attributes no rule defines and its kind doesn't need (704.1). They are flavor.

## 800. The workshop

### 801 Commissions [m]
**801.1** A commission is a proposal like any other (103): the way a catalog entry comes in or changes (701.2), or a new rule that makes an entry do something.

**801.2** A commission opens a ticket. Gremlin drafts it with you: what it is, what it makes, how many nights it takes, what it costs to run, and the tasks that make it up. He draws each new entry while you draft it. You can keep any drawing he makes and pick the one the entry shows.

**801.3** A commission that names nothing to make, or that would do something the workshop's limits rule out (802.1), is refused when it's drafted, with the reason.

**801.4** Gremlin sets each commission's price in points when it's drafted, up to 25 points [setting: workshop.price_ceiling], and says why. It's paid in full when the commission passes. If you can't pay it all, it waits as Ready and you pay on the first night you can (803.1). Points you pay no longer count toward winning (402.2).

**801.5** You can reopen a refused or failed commission as a draft and confirm it again (103.1).

### 802 Limits [m]
**802.1** Nothing the workshop builds can share players' private information, weaken the site's security, break the law, or reach outside this game.

### 803 The queue [m]
**803.1** A commission joins the workshop's queue when it is paid for, in the order paid.

### 804 Discussion [m]
**804.1** Anyone in the game can post in a ticket's discussion. Gremlin answers up to 20 of your posts a day [setting: gremlin.thread_replies_per_day].

## 900. Actions

### 901 Grant points [m]
**901.1** You can propose that another player gets a whole number of points, from 1 to 10.

**901.2** This action touches points (401) and winning (402).

**901.3** The points are given when the action is applied (103.8).
