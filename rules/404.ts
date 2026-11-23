// Rule 404, How the game ends. After a night in which someone died, once all the night's bites are done: one living player left = Last one standing
// (404.3), none = Everyone dead (404.4). Paradox (404.2) is a moderator's ruling, not decided here. A game with several living players goes on.
import { defineRule, effects } from "promptocracy/engine";

export default defineRule({
  rule: 404,
  /** @rule 404.3, 404.4 */
  ending(ctx) {
    const living = ctx.players.filter((p) => p.state === "living");
    if (living.length === 1) return effects.gameOver("last_standing", living[0].ref, "was the last one living");
    if (living.length === 0) return effects.gameOver("everyone_dead", null, "everyone died");
    return null;
  },
});
