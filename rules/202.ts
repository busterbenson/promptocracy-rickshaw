// Rule 202, Your turn: "you move at most once per turn".
// (Proposing once per turn is kept by the database today; this module owns the move half.)
import { defineRule, refuse } from "promptocracy/engine";

export default defineRule({
  rule: 202,
  /** @rule 202 */
  actionAllowed(ctx, _actor, action) {
    if (action.kind === "move" && ctx.turn.moved) return refuse("You already moved this turn.", 409);
    return null;
  },
});
