// Rule 901, Grant points: an action type (rule 103.5). You propose that another player gets 1 to 10 points; it touches points (401)
// and winning (402), so it needs the votes of the strictest of them and of rule 901 itself (103.6). The details are checked again when
// the action is applied (a rule changed tonight may have narrowed them), and an action the rules no longer allow is not applied.
import { defineRule, effects, refuse } from "promptocracy/engine";

const MAX_POINTS = 10;

export default defineRule({
  rule: 901,
  /** @rule 901.1, 901.2 */
  actionType() {
    return {
      type: "grant",
      name: "Grant points",
      touches: [401, 402],
      params: [
        { key: "to", label: "To", kind: "player", other: true },
        { key: "amount", label: "Points", kind: "int", min: 1, max: MAX_POINTS },
      ],
    };
  },
  /** @rule 901.1, 901.3 */
  applyAction(ctx, action: any) {
    const { to, amount } = action.params;
    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_POINTS) return refuse(`the points are not a whole number from 1 to ${MAX_POINTS} (901.1)`);
    if (to === action.player) return refuse("it names the player who proposed it, and 901.1 says another player");
    if (!ctx.players.some((p) => p.ref === to)) return refuse("it names a player who is not in the game (901.1)");
    return [effects.points(to, amount, `P${action.number} granted points`)];
  },
});
