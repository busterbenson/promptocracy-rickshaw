// Rule 401, Points: a player whose proposal passes and is applied gets 10 points when it is applied.
import { defineRule, effects } from "promptocracy/engine";

export default defineRule({
  rule: 401,
  /** @rule 401 */
  onEnacted(_ctx, proposal: any) {
    return [effects.points(proposal.player, 10, `P${proposal.number} was applied`)];
  },
});
