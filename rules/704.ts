// Rule 704, What each kind needs: each kind's required attributes, as data (704.1). The platform reads this list when it
// bundles the game and holds each entry against it. No rule defines hearts, how an item is acquired or what a size does yet,
// so these three show "No rule yet" on a card (704.2); a rule that defines one later adds it to the registry (703.1).
import { defineRule } from "promptocracy/engine";

/** What each kind needs (704.1): the attribute's key and the type of its value (number, yesno, choice, text, size or rule). */
export const required = {
  creature: [{ key: "hearts", type: "number" }],
  item: [{ key: "acquired", type: "rule" }],
  structure: [{ key: "size", type: "size" }],
};

export default defineRule({ rule: 704 });
