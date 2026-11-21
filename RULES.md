# Rules

These are the rules in effect. This file on the `main` branch of the game's repo is the only place
the rules live: nothing a player or the moderator remembers counts unless it is
written here. Every change to this file is a passed proposal, so `git log` on it
is the history of the game.

## 100. Core rules [unanimous]

### 101 Follow the rules
Every player, and the moderator, must follow the rules
in this file as they stand on `main`.

### 102 Players
**102.1** The players are the people who have joined the game, as shown on the board.

**102.2** The first player to join is the host. The host's only power is to start the game (203.1).

**102.3** Any player can invite people to join while the game isn't full (201), before day 1 and after it.
Each player has their own invite link, and the join page says who invited you. No proposal is needed.
Joining waits while the night is being processed (107.1).

**102.4** If you join after a day has begun, you vote from the next day (104.2).

**102.5** You sign in with a link sent to your email address.

### 103 Proposals
**103.1** To propose, a player writes the change in plain words. The moderator drafts it into exact text, shown as a
change to this file, and the player confirms the draft, changes their words, or cancels. Drafting costs nothing: only a
confirmed proposal counts toward the day's limit.

**103.2** You can confirm up to 3 proposals a day. [setting: proposals.per_day] Each confirmed proposal gets the next
number (P1, P2, ...) and goes on the next day's ballot.

**103.3** The proposer may withdraw a confirmed proposal until it goes on the ballot, unless they have ended their turn
(rule 202.4). A withdrawn proposal doesn't count toward the limit (103.2).

**103.4** A proposal may change any number of rules, and the settings and code that carry them out. It needs the votes
required by its strictest part, and it passes or fails as a whole, never in part.

**103.6** These parts of the game aren't wired yet: sign-in (102.5), the proposal limit (103.2), hidden votes (104.4),
votes counted by code (104.5), the lock (107.1), the deadline (107.6), End turn (202.4), the day (203.1) and this rule. A proposal
that changes one of them, or conflicts with one, is refused when it is drafted, with the reason "not wired yet". Adding a
clause or a rule, or changing only a setting, is not refused.

### 104 Voting
**104.1** A proposal passes if it gets the votes its mark asks for (rule 105). Majority: more than half of all players
vote yes. Unanimous: every player votes yes. Not voting counts as no.

**104.2** The players who may vote on a day, and who count for what a vote needs, are the players when the day starts.
A player who joins during the day votes from the next day.

**104.3** Each day's ballot holds the proposals confirmed the day before. Every player, the proposer included, may vote
yes or no on each one until midnight or until they end their turn (rule 202.4), and may change their vote until then.

**104.4** Until midnight nobody sees how anyone else voted, or any total. During the day everyone can see who has voted
on a proposal, and how many have. After midnight every vote is shown.

**104.5** Votes are counted by code, not by the moderator.

### 105 Votes needed
**105.1** Every block is marked [unanimous] or [majority]; [u] and [m] are short for them. The mark sets the votes
needed to change, add or repeal any rule in the block.

**105.2** A rule can carry its own mark, which overrides its block's.

**105.3** Changing a mark counts as changing that rule or block, so it needs the votes of its current mark.

**105.4** The votes a proposal needs are set when it is confirmed, from the marks in effect then.

**105.5** Rules marked unanimous, by their block or by their own mark, are the core rules.

### 106 The moderator
**106.1** The moderator is Chalant, the AI that runs the game. It drafts each proposal into exact text before anyone
votes (rule 103.1), and each night it applies the proposals that passed (rule 107).

**106.2** The moderator rules on what the rules mean. Every ruling names the rules it relies on and is written to
`rulings/`. Earlier rulings count as precedent.

**106.3** Each night the moderator reads the proposer's own words of each passed proposal again and compares them with
the draft that was voted on. The draft that was voted on is the one applied. If the two differ in a way that matters,
the moderator tells the proposer what differs, so they can propose a fix.

### 107 The night
**107.1** From midnight until the moderator has processed the day that just ended, the game is locked: nobody can
move, vote, propose, post in a ticket's discussion or end their turn, on the site or through an AI client (rule 204).
Play resumes when processing is done.

**107.2** Passed proposals are applied to this file in the order they were proposed. Each one raises the revision of
the rule it changes by one.

**107.3** If two passed proposals change the same rule, the moderator redrafts the later one onto the new text. If it
no longer makes sense, it is not applied (rule 107.7).

**107.4** Every rule has code and tests that check it. A change to a rule is made with its code and tests in the same
step, and all go live together.

**107.5** Each passed proposal has its own budget: the moderator can spend at most 20 minutes
[setting: night.apply_minutes] applying it, at medium effort [setting: night.apply_effort]. The budget is separate from
the deadline in rule 107.6. A proposal that runs over its budget is not applied (rule 107.7).

**107.6** The moderator has until 2:00 am to process the day. When the deadline passes, every passed proposal not yet
applied is not applied (rule 107.7), and play resumes.

**107.7** A passed proposal is not applied if its code and tests can't be made to pass, if it no longer makes sense
(rule 107.3), if it runs over its budget (rule 107.5), if a rule that prevails over it stands in the way (rule 108.4),
or if the deadline passes (rule 107.6). It gives no points. It goes back to its proposer with the moderator's reason
and a suggestion, such as splitting it into smaller proposals or simplifying it. The proposer can propose it again on
a later day.

**107.8** When a day is processed, the moderator tags the game's files with that day's number, so the rules in effect
on any day can be read back.

### 108 When rules conflict
**108.1** Two rules conflict when they can't both be followed. A core rule prevails over a majority rule. Between two
rules of the same kind, the older one prevails: the one added first. Amending or moving a rule doesn't make it newer.
Between rules added at the same time, like the starter rules, the lower number prevails.

**108.2** A rule that says it prevails over another rule, or gives way to one, is followed, but only within its kind: a
majority rule can't prevail over a core rule.

**108.3** A proposal doesn't conflict with the rules it changes. When drafting, the moderator names any other rule the
proposal would conflict with, so the proposer can change that rule too.

**108.4** If a passed proposal conflicts with a rule that prevails over it, it is not applied, and the reason names
that rule (rule 107.7). If the proposal prevails, it is applied, and the rule it overrides gets a note saying where it
gives way.

**108.5** When rules in effect conflict in a case nobody foresaw, the moderator rules by rule 108.1 (rule 106), and the
ruling can be appealed (rule 301).

## 200. Players and turns [majority]

### 201 Game size
A game has at most 8 players. [setting: max_players]

### 202 Your turn [unanimous]
**202.1** The game is played one day at a time (rule 203). Each day, every player gets one turn. Everyone plays the
same day at the same time; there is no order of play.

**202.2** On your turn you may propose one rule change, and you may move
your piece one space in any direction, diagonals included. [setting: turn.move_distance]
You can do both, in either order, and you move at most once a day.

**202.3** Every part of a turn is optional, and skipping one has no penalty.

**202.4** A player may end their turn at any time. Ending is final: after it they can't move, propose or vote until
the next day, and what they hadn't done is skipped.

**202.5** Rules may add more things to do on a turn.

### 203 Days [unanimous]
**203.1** A day runs from midnight to midnight in the game's time zone. [setting: game.timezone]
The game's first day is day 1, and days are numbered from there. Day 1 begins when the host presses Start (102.2) and ends at the
next midnight. Before day 1 the game is being set up, and the starter rules can be edited directly. A day always runs
to midnight, even if every player has ended their turn. If the time zone setting changes, it takes effect at the next
midnight in the old zone.

**203.2** At midnight the day that just ended is processed (rule 107), and then the next day begins.

### 204 AI clients
A player may connect an AI client to this game and take their own turns through it. [setting: mcp_enabled]

## 300. Proposals and rulings [majority]

### 301 Overruling the moderator
Any player may appeal a ruling within 24 hours
of it being written. If more than half of all players vote to overturn it, the
ruling is reversed and the moderator records the reversal.

## 400. Points and winning [majority]

### 401 Points
A player whose proposal passes and is applied gets 10 points when it is applied (rule 107).

### 402 Winning
**402.1** The first player to reach 100 points wins. (This rule is deliberately dull, after Peter Suber's original.
Change it.)

**402.2** Points are given in the order proposals are applied (rule 107.2). If several players pass 100 on the same
night, the first one to be given them wins.

**402.3** When a player wins, the game is over. Nothing more can be played; the board, the rules and the history stay
readable.

### 403 Paradox
If the rules are changed so that further play is impossible,
the first player who is unable to complete a turn wins. This rule takes
precedence over every other rule about winning. (Suber's rule 213.)

## 500. The board [majority]

### 501 The grid
The grid is infinite. A tile is either charted or uncharted, and
charted tiles are visible to everyone.

### 502 Coordinates
Tiles are named row first, like
"3N 2E": rows count north and south, columns count east and west, and there is no
zero row or column (1N sits next to 1S, 1E next to 1W). Levels count the same way: the
ground is 1U, the level above it 2U, the one below 1D.

### 503 The island
The game starts with an 8x8 charted island
centered on the origin. [setting: board.island]

### 504 Moving and charting
**504.2** When you move, every tile within two tiles of you is
charted: a 5x5 square with its four corners cut off. [setting: board.chart_radius]

**504.3** You can only move onto a charted tile that no other piece stands on.

### 505 New players
A new player's piece starts on a random unoccupied charted tile where a move would chart nothing new: every tile
that a move onto it would chart (rule 504.2) is already charted.

## 800. The workshop [majority]

### 801 Commissions
**801.1** To add something new to the game (a creature, a tile, an item, or a feature like a forum), you commission it. A commission is a proposal like any other: it counts toward your proposals for the day (103.2).

**801.2** A commission opens a ticket that says what it is, what it makes, how many nights it will take, what it costs to run, and the tasks that make it up.

**801.3** A commission that names nothing to make is refused, with the reason.

**801.4** A commission has a price in points, paid in full when it passes. If you can't pay it all, it waits as Ready and you pay on the first night you can; it joins the queue then (803.1). Points you pay no longer count toward winning (402).

**801.5** You can reopen a refused or failed commission as a draft; confirming it again counts toward that day's proposals (103.2).

### 803 The queue
**803.1** A commission joins the workshop's queue when it is paid for, in the order paid.

### 804 Discussion
**804.1** Anyone in the game can post in a ticket's discussion.
