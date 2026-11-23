// Rule 202, Your turn: one turn a day each (202.1), and "you move at most once a day" (202.2).
// ctx.turn.moved is whether the acting player has moved in today's turn. (One prompt a day is kept by the database
// today; this module owns the move half. Ending a turn and the midnight lock are the engine's own gates, 202.4 and 107.1.)
import { defineRule, refuse } from "promptocracy/engine";

export default defineRule({
  rule: 202,
  /** @rule 202.1, 202.2, 202.5, 603.1 */
  actionAllowed(ctx, _actor, action) {
    // The dead have no turn (202.1) and can't move (202.5). A Ghost has a turn and can move (604.1, 202.5), so only a dead player who hasn't risen
    // is refused here; a Ghost's proposal is refused in module 604.
    const me = ctx.players.find((p) => p.ref === _actor.ref);
    if (me?.state === "dead") return refuse("You're dead (603.1).", 403);
    if (action.kind === "move" && ctx.turn.moved) return refuse("You already moved today.", 409);
    return null;
  },
});
