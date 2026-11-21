// Rule 901, Grant points: an action type (rule 103.5). You propose that another player gets 1 to 10 points; it touches points (401)
// and winning (402), so it needs the votes of the strictest of them and of rule 901 itself (103.6).
import { defineRule, effects } from "promptocracy/engine";

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
        { key: "amount", label: "Points", kind: "int", min: 1, max: 10 },
      ],
    };
  },
  /** @rule 901.3 */
  applyAction(_ctx, action: any) {
    return [effects.points(action.params.to, action.params.amount, `P${action.number} granted points`)];
  },
});
