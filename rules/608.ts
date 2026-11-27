// Rule 608, Refuge (commission W6). A living player standing in any tile of a structure with the refuge attribute can't be bitten by a hostile creature. A creature's bite asks
// first (ctx.mayBite, 602.5); this rule is the answer. A structure's tiles stay open to walk on (it blocks nothing), so a player can stand in it.
import { attr, defineRule, refuse, structureAt } from "promptocracy/engine";

/** The attribute this rule defines (703.1): whether a structure is a refuge. A structure without it is not. */
export const attributes = [
  { key: "refuge", type: "yesno", kinds: ["structure"], missing: "No", meaning: "A living player standing in it can't be bitten by hostile creatures (608.1)." },
];

export default defineRule({
  rule: 608,
  /** @rule 608.1 */
  biteAllowed(ctx, creature, player) {
    if (player.state !== "living" || attr(ctx.catalog.find((e) => e.id === creature.entry), "temper") !== "hostile") return null;
    const s = structureAt(ctx, player.x, player.y, player.z);
    return s && attr(ctx.catalog.find((e) => e.id === s.entry), "refuge") === true ? refuse("A living player in a refuge can't be bitten by a hostile creature (608.1).") : null;
  },
});
