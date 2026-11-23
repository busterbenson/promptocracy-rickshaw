// Rule 604, Ghosts: a Ghost has a turn like anyone's (604.1). Only the living vote or propose (202.5), and a Ghost is still dead (603.3), so this
// module refuses a Ghost's proposal. Voting is refused by the vote route (the electorate is the living, 104.2). A dead player who hasn't risen is
// refused everything in module 202.
import { defineRule, refuse } from "promptocracy/engine";

export default defineRule({
  rule: 604,
  /** @rule 202.5 */
  actionAllowed(ctx, actor, action) {
    const me = ctx.players.find((p) => p.ref === actor.ref);
    if (me?.state === "ghost" && action.kind === "propose") return refuse("A Ghost can't propose (202.5).", 403);
    return null;
  },
});
