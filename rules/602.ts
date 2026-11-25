// Rule 602, Hostile creatures. `night` runs every night (602.3 only on a night when nothing was applied): a hostile creature may appear, then each
// hostile creature that isn't resting steps toward the nearest living player (602.4), then bites every living player next to it and rests (602.5).
// It works on a copy of the board, so a later step sees what an earlier one did.
import { attr, chartedAround, defineRule, effects } from "promptocracy/engine";

/** The attribute this rule defines (703.1): a creature's temper. A creature with none is neutral (602.1). */
export const attributes = [
  { key: "temper", type: "choice", choices: ["hostile", "neutral"], kinds: ["creature"], missing: "Neutral", meaning: "Hostile creatures hunt living players. Neutral ones stay where they are." },
];

type Pos = { x: number; y: number; z: number };
/** @rule 602.2 */
const dist = (a: Pos, b: Pos) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); // steps, diagonals included (602.2)

export default defineRule({
  rule: 602,
  /** @rule 602.3, 602.4, 602.5 */
  night(ctx, { applied }) {
    const out: any[] = [];
    /** @rule 602.1 */
    const hostile = (entry: string) => attr(ctx.catalog.find((e) => e.id === entry), "temper") === "hostile";
    const living = ctx.players.filter((p) => p.state === "living");
    let creatures = ctx.creatures.map((c) => ({ ...c }));
    /** @rule 602.2 */
    const occupied = (t: Pos) => ctx.players.some((p) => p.x === t.x && p.y === t.y && p.z === t.z) || creatures.some((c) => c.x === t.x && c.y === t.y && c.z === t.z);
    // 602.3: one hostile entry, at random, on a random charted unoccupied tile at least appear_steps from every living player
    if (applied.length === 0) {
      const entries = ctx.catalog.filter((e) => e.kind === "creature" && hostile(e.id));
      const far = ctx.settings["creatures.appear_steps"];
      const tiles = ctx.tiles.list().filter((t) => t.z === 0 && !occupied(t) && living.every((p) => p.z !== t.z || dist(p, t) >= far));
      if (entries.length && tiles.length) {
        const entry = entries[Math.floor(ctx.rng() * entries.length)];
        const tile = tiles[Math.floor(ctx.rng() * tiles.length)];
        out.push(effects.appear(entry.id, tile));
        creatures.push({ id: ctx.nextCreatureId, entry: entry.id, x: tile.x, y: tile.y, z: tile.z, hearts: null, resting: false });
      }
    }
    /** @rule 602.4 */
    const mobile = () => creatures.filter((c) => hostile(c.entry) && !c.resting); // already in the order they appeared
    // 602.4: one step closer to the nearest living player, onto an unoccupied charted tile; none if already next to one or boxed in
    for (const c of mobile()) {
      if (!living.length || living.some((p) => p.z === c.z && dist(p, c) <= 1)) continue;
      const here = Math.min(...living.filter((p) => p.z === c.z).map((p) => dist(p, c)));
      if (!Number.isFinite(here)) continue;
      const options = chartedAround(c.x, c.y, 1)
        .map(([tx, ty]) => ({ x: tx, y: ty, z: c.z }))
        .filter((t) => (t.x !== c.x || t.y !== c.y) && ctx.tiles.has(t.x, t.y, t.z) && !occupied(t) && Math.min(...living.filter((p) => p.z === t.z).map((p) => dist(p, t))) < here);
      if (!options.length) continue;
      const best = Math.min(...options.map((t) => Math.min(...living.filter((p) => p.z === t.z).map((p) => dist(p, t)))));
      const ties = options.filter((t) => Math.min(...living.filter((p) => p.z === t.z).map((p) => dist(p, t))) === best);
      const to = ties[Math.floor(ctx.rng() * ties.length)];
      out.push(effects.step(c.id, to));
      c.x = to.x; c.y = to.y; c.z = to.z;
    }
    // 602.5: bite every living player next to it, then rest the next night. Hearts and deaths are tracked as the bites go, so a player an earlier creature
    // just killed is not bitten again, and a creature that bit nobody does not rest.
    const left = new Map(living.map((p) => [p.ref, p.hearts]));
    for (const c of mobile()) {
      const next = living.filter((p) => (left.get(p.ref) ?? 0) > 0 && p.z === c.z && dist(p, c) <= 1);
      if (!next.length) continue;
      for (const p of next) {
        out.push(effects.bite({ player: p.ref }, ctx.settings["creatures.bite"], c.id)); // `c.id` is the biter, for the history (101.2)
        left.set(p.ref, (left.get(p.ref) ?? 0) - ctx.settings["creatures.bite"]);
      }
      out.push(effects.rest(c.id));
    }
    return out;
  },
});
