// Rule 505, New players: a random unoccupied charted tile at least 2.5 tiles from any uncharted tile,
// i.e. one whose whole chart shape (the tiles a move there would chart) is already charted.
import { SHARED_TILES, chartOffsets, defineRule } from "promptocracy/engine";

export default defineRule({
  rule: 505,
  spawnTile(ctx, candidates) {
    const shape = chartOffsets(ctx.settings["board.chart_radius"]);
    const open = candidates.filter((t) =>
      (SHARED_TILES || !ctx.players.some((p) => p.x === t.x && p.y === t.y && p.z === t.z)) &&
      shape.every(([dx, dy]) => ctx.tiles.has(t.x + dx, t.y + dy, t.z)));
    if (!open.length) return null;
    return open[Math.floor(ctx.rng() * open.length)];
  },
});
