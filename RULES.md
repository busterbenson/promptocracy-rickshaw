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
The players are the people who have joined the game, as shown on the board. Adding or
removing a player takes a passed proposal.

### 103 Proposals
**103.1** To propose, a player writes the change in plain words. The moderator drafts it into exact text, shown as a
change to this file, and the player confirms the draft, changes their words, or cancels. Drafting costs nothing: only a
confirmed proposal is the player's one proposal for the day.

**103.2** A player may confirm one proposal a day. Each confirmed proposal gets the next number (P1, P2, ...) and goes
on the next day's ballot.

**103.3** The proposer may withdraw a confirmed proposal until it goes on the ballot, unless they have ended their turn
(rule 202.4). A withdrawn proposal doesn't use up the day's proposal.

**103.4** A proposal may change any number of rules, and the settings and code that carry them out. It needs the votes
required by its strictest part, and it passes or fails as a whole, never in part.

### 104 Voting
A proposal passes if more than half of all players vote yes
within 48 hours of the moderator publishing its final text. A proposal that
changes a core rule (1xx) passes only if every player votes yes. Votes are
counted by code, not by the moderator.

### 105 Votes needed
**105.1** Every block is marked [unanimous] or [majority]; [u] and [m] are short for them. The mark sets the votes
needed to change, add or repeal any rule in the block.

**105.2** A rule can carry its own mark, which overrides its block's.

**105.3** Changing a mark counts as changing that rule or block, so it needs the votes of its current mark.

**105.4** The votes a proposal needs are set when it is confirmed, from the marks in effect then.

**105.5** Rules marked unanimous, by their block or by their own mark, are the core rules.

### 106 The moderator
The moderator is Chalant, the AI that runs the game. It drafts each prompt into
exact text before anyone votes, and it rules on what the rules mean. Every
ruling names the rules it relies on and is written to `rulings/`. Earlier
rulings count as precedent.

### 107 The night
**107.1** From midnight until the moderator has processed the day that just ended, the game is locked: nobody can
move, vote, propose or end their turn, on the site or through an AI client (rule 204). Play resumes when processing
is done.

### 108 When rules conflict
**108.3** A proposal doesn't conflict with the rules it changes. When drafting, the moderator names any other rule the
proposal would conflict with, so the proposer can change that rule too.

### 110 What no proposal can change
**110.1** Some parts of the game are run by the site itself, the same in every game, and no proposal can change them,
this rule included: signing in, days running midnight to midnight (rule 203.1), one proposal a day (rule 103.2), ending a
turn (rule 202.4) and the lock (rule 107.1). Their settings can still be changed. A proposal that would change them is
refused when it is drafted.

## 200. Players and turns [majority]

### 201 Game size
A game has at most 8 players. [setting: max_players]

### 202 Your turn
**202.1** The game is played one day at a time (rule 203). Each day, every player gets one turn. Everyone plays the
same day at the same time; there is no order of play.

**202.2** On your turn you may propose one rule change, and you may move
your piece one space in any direction, diagonals included. [setting: turn.move_distance]
You can do both, in either order, and you move at most once a day.

**202.3** Every part of a turn is optional, and skipping one has no penalty.

**202.4** A player may end their turn at any time. Ending is final: after it they can't move, propose or vote until
the next day, and what they hadn't done is skipped.

**202.5** Rules may add more things to do on a turn.

### 203 Days
**203.1** A day runs from midnight to midnight in the game's time zone. [setting: game.timezone]
The game's first day is day 1, and days are numbered from there. Day 1 begins when the game starts and ends at the
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

### 302 The board is part of the game
A proposal may change the website's
code as well as this file. If it passes, both changes go live together.

## 400. Points and winning [majority]

### 401 Points
A player whose proposal passes gets 10 points.

### 402 Winning
The first player to reach 100 points wins. (This rule is
deliberately dull, after Peter Suber's original. Change it.)

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
