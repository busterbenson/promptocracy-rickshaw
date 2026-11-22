// Rule 601, Hearts: a creature's hearts are catalog data (601.2); a player's hearts start at hearts.start (601.1, the site sets them at join).
// Reaching 0 is dying (601.3, applied by the engine's night board with rule 603). This module only defines the attribute.
import { defineRule } from "promptocracy/engine";

/** The attribute this rule defines (703.1): a creature's hearts. A creature with none can't lose any (601.2). */
export const attributes = [
  { key: "hearts", type: "number", kinds: ["creature"], missing: "Can't be hurt", meaning: "How many hearts the creature has. At 0 it dies (601.3)." },
];

export default defineRule({ rule: 601 });
