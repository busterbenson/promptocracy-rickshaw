// Rule 402, Winning: the first player to reach 100 points wins (402.1). Points are given in the order proposals are
// applied, so on a night when several players pass 100, the first one given them wins (402.2). The engine ends the
// game on a win (402.3).
import { defineRule, effects } from "promptocracy/engine";

export default defineRule({
  rule: 402,
  /** @rule 402.1, 402.2 */
  dayEnd(_ctx, results: any) {
    let score: Record<string, number> = { ...results.before };
    for (const g of results.given) {
      score[g.player] = (score[g.player] ?? 0) + g.delta;
      if (score[g.player] >= 100) return [effects.win(g.player, `reached ${score[g.player]} points`)];
    }
    return [];
  },
});
