// Rule 402, Eras: the first player to reach the setting eras.points_to_win wins the Era (402.2). Points are given in the order
// proposals are applied, so on a night when several players pass it, the first one given them wins (402.2). The engine ends the Era
// on that win: it resets everyone's points, keeps the final scores and crowns the winner Champion (402.3). The Champion's
// own change (402.4) and the naming (402.3) are allowed here: the site lets the Champion use them only while some rule carries
// them, so repealing this module's handler repeals both, whichever number the rule has by then. The count itself is the site's.
import { defineRule, effects } from "promptocracy/engine";

export default defineRule({
  rule: 402,
  /** @rule 402.2, 402.3 */
  dayEnd(ctx, results: any) {
    const toWin = ctx.settings["eras.points_to_win"];
    let score: Record<string, number> = { ...results.before };
    for (const g of results.given) {
      score[g.player] = (score[g.player] ?? 0) + g.delta;
      if (score[g.player] >= toWin) return [effects.champion(g.player, `reached ${score[g.player]} points`)];
    }
    return [];
  },
  /** @rule 402.3, 402.4 */
  championChange() {
    return null; // the Champion may name the Era (402.3) and make the one change (402.4); the site counts and limits them
  },
});
