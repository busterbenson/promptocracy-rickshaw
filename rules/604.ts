// Rule 604, Ghosts: a Ghost has a turn like anyone's and can move and end it (604.1), but can't propose or vote. Voting is refused by the vote route
// (the electorate leaves the dead out, 104.2). Everything a Ghost can't do is in this one module, so changing what a Ghost can do changes only this.
import { defineRule, refuse } from "promptocracy/engine";

export default defineRule({
  rule: 604,
  /** @rule 604.1 */
  actionAllowed(ctx, actor, action) {
    const me = ctx.players.find((p) => p.ref === actor.ref);
    if (me?.state === "ghost" && action.kind === "propose") return refuse("A Ghost can't propose (604.1).", 403);
    return null;
  },
});
