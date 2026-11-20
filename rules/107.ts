// Rule 107, The night: passed proposals are applied in the order they were proposed (107.2), so the lowest P-number
// goes first. The site runs the rest of the night (the lock 107.1, the deadline 107.6); this module decides the order.
import { defineRule } from "promptocracy/engine";

export default defineRule({
  rule: 107,
  /** @rule 107.2 */
  applyOrder(_ctx, passed) {
    return [...passed].sort((a: any, b: any) => a.number - b.number);
  },
});
