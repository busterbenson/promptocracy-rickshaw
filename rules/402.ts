// Rule 402, Eras: the first player to reach 100 points wins the Era (402.1). Points are given in the order proposals are
// applied, so on a night when several players pass 100, the first one given them wins (402.2). The engine ends the Era
// on that win: it resets everyone's points, keeps the final scores and crowns the winner Champion (402.3). The Champion's
// own change (402.4) is allowed here: the site lets the Champion draft it only while some rule carries it, so repealing this
// module's handler repeals the capability, whichever number the rule has by then. The count itself is the site's.
import { defineRule, effects } from "promptocracy/engine";

export default defineRule({
  rule: 402,
  /** @rule 402.1, 402.2 */
  dayEnd(_ctx, results: any) {
    let score: Record<string, number> = { ...results.before };
    for (const g of results.given) {
      score[g.player] = (score[g.player] ?? 0) + g.delta;
      if (score[g.player] >= 100) return [effects.champion(g.player, `reached ${score[g.player]} points`)];
    }
    return [];
  },
  /** @rule 402.4 */
  championChange() {
    return null;
  },
});
