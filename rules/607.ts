// Rule 607, Pancake asleep (commission W2). While Pancake is resting (606.1) the board shows the "Pancake asleep" entry's drawing in place of her own. That entry is only a drawing: it
// is never put on the board (701.5), so this rule answers "not placed" for it.
import { defineRule, entryMadeBy } from "promptocracy/engine";

/** The two entries commission W2 made, by name: the awake one and the sleeping drawing. @rule 607.1 */
const pair = (catalog: Parameters<typeof entryMadeBy>[0]) => {
  /** @rule 607.1 */
  const named = (name: string) => { const e = entryMadeBy(catalog, "W2", "creature", name); return e && String(e.name ?? "").toLowerCase() === name ? e : undefined; };
  return { awake: named("pancake"), asleep: named("pancake asleep") };
};

export default defineRule({
  rule: 607,
  /** @rule 607.1 */
  creatureDrawing(ctx, creature) {
    const { awake, asleep } = pair(ctx.catalog);
    return awake && asleep && creature.entry === awake.id && creature.resting ? asleep.id : undefined;
  },
  /** @rule 607.1 */
  placement(ctx, entry) {
    const { asleep } = pair(ctx.catalog);
    return asleep && entry.id === asleep.id ? null : undefined;
  },
});
