// Rule 606, Pancake (commission W2). Each night Pancake takes 1 to 3 steps toward her owner, then sleeps the next night. Her owner is the player whose commission made her
// (the ruling in rulings/ says so, 106.5): ctx.catalog gives each entry's requester. She follows the owner's piece wherever it is, living, dead or a Ghost (603.1, 604.2).
// Her sleep is the engine's rest (the same one a biting creature takes, 602.5): the next night she is `resting` and does nothing.
import { chartedAround, defineRule, effects, entryMadeBy } from "promptocracy/engine";

type Pos = { x: number; y: number; z: number };
/** Steps, diagonals included (602.2). @rule 606.1 */
const dist = (a: Pos, b: Pos) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

export default defineRule({
  rule: 606,
  /** @rule 606.1 */
  night(ctx) {
    const entry = entryMadeBy(ctx.catalog, "W2", "creature", "Pancake");
    if (!entry || String(entry.name ?? "").toLowerCase() !== "pancake") return [];
    const cat = ctx.creatures.find((c) => c.entry === entry.id);
    if (!cat || cat.resting) return [];
    const owner = entry.requester ? ctx.players.find((p) => p.ref === entry.requester) : undefined;
    if (!owner || owner.z !== cat.z) return [];
    /** Players (any state: a piece stays where it fell) and the other creatures. @rule 606.1 */
    const occupied = (t: Pos) => ctx.players.some((p) => p.x === t.x && p.y === t.y && p.z === t.z) || ctx.creatures.some((c) => c.id !== cat.id && c.x === t.x && c.y === t.y && c.z === t.z);
    const out: any[] = [];
    let at: Pos = { x: cat.x, y: cat.y, z: cat.z };
    const steps = 1 + Math.floor(ctx.rng() * 3);
    for (let i = 0; i < steps; i++) {
      const here = dist(at, owner);
      if (here <= 1) break; // next to her owner
      const options = chartedAround(at.x, at.y, 1).map(([x, y]) => ({ x, y, z: at.z })).filter((t) => (t.x !== at.x || t.y !== at.y) && ctx.tiles.has(t.x, t.y, t.z) && !occupied(t) && dist(t, owner) < here);
      if (!options.length) break; // boxed in
      const best = Math.min(...options.map((t) => dist(t, owner)));
      const ties = options.filter((t) => dist(t, owner) === best);
      at = ties[Math.floor(ctx.rng() * ties.length)];
      out.push(effects.step(cat.id, at));
    }
    if (out.length) out.push(effects.rest(cat.id)); // she sleeps the next night after a night of walking
    return out;
  },
});
