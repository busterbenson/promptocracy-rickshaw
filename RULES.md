# Rules

These are the rules in effect. This file on the `main` branch of the game's repo is the only place
the rules live: nothing a player or the moderator remembers counts unless it is
written here. Every change to this file is a passed proposal, so `git log` on it
is the history of the game.

Core rules (1xx) are harder to change than ordinary rules (2xx). See 104.

## Core rules

**101. Follow the rules.** Every player, and the moderator, must follow the rules
in this file as they stand on `main`.

**102. Players.** The players are the people who have taken a seat, as shown on the board. Adding or
removing a player takes a passed proposal.

**103. Turns.** Players take turns in the order of their seats on the board. On your
turn you write one prompt. The moderator reads it and either:
- drafts it as a **proposal** to change the rules or the site, or
- carries it out as an **action**, if a rule allows that action.

**104. Voting.** A proposal passes if more than half of all players vote yes
within 48 hours of the moderator publishing its final text. A proposal that
changes a core rule (1xx) passes only if every player votes yes. Votes are
counted by code, not by the moderator.

**105. The moderator.** The moderator is Chalant, the AI that runs the game. It drafts each prompt into
exact text before anyone votes, and it rules on what the rules mean. Every
ruling names the rules it relies on and is written to `rulings/`. Earlier
rulings count as precedent.

## Rules

**201. Overruling the moderator.** Any player may appeal a ruling within 24 hours
of it being written. If more than half of all players vote to overturn it, the
ruling is reversed and the moderator records the reversal.

**202. Points.** A player whose proposal passes gets 10 points.

**203. Winning.** The first player to reach 100 points wins. (This rule is
deliberately dull, after Peter Suber's original. Change it.)

**204. The board is part of the game.** A proposal may change the website's
code as well as this file. If it passes, both changes go live together.

**205. Time.** A player who has not taken their turn within 24 hours of it
starting is skipped for that round.

**206. Paradox.** If the rules are changed so that further play is impossible,
the first player who is unable to complete a turn wins. This rule takes
precedence over every other rule about winning. (Suber's rule 213.)

**207. The Board.** The grid is infinite. A tile is either charted or uncharted, and
charted tiles are visible to everyone. The game starts with an 8x8 charted island
centered on the origin. [setting: board.island] Tiles are named row first, like
"3N 2E": rows count north and south, columns count east and west, and there is no
zero row or column (1N sits next to 1S, 1E next to 1W). Levels count the same way: the
ground is 1U, the level above it 2U, the one below 1D. New players start on a random
unoccupied charted tile at least 2.5 tiles from any uncharted tile. When you move, every tile within two tiles of you is
charted: a 5x5 square with its four corners cut off. [setting: board.chart_radius]

**208. The Turn.** On your turn you may propose one rule change, and you may move
your piece one space in any direction, diagonals included. [setting: turn.move_distance]
You can do both, in either order, and you move at most once per turn. You can only
move onto a charted tile that no other piece stands on. Rules may add more things to do on a turn.

**209. Players.** A game seats at most 8 players. [setting: max_players]

**210. AI clients.** A player may connect an AI client to this game and take their own turns through it. [setting: mcp_enabled]
