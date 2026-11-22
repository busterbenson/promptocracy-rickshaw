// Rule 504, Moving and charting.
//   actionAllowed: you move only on your own level, within the move distance, onto a charted tile no other
//                  piece stands on (rule 202). A move with no destination is a question, and answers null.
//   afterAction:   when you move, every tile within the chart radius of where you land is charted.
import { SHARED_TILES, chartedAround, defineRule, effects, refuse, withinSteps } from "promptocracy/engine";

export default defineRule({
  rule: 504,
  /** @rule 504.2, 202.2 */
  actionAllowed(ctx, actor, action) {
    if (action.kind !== "move" || !action.to) return null;
    const to = action.to;
    const me = ctx.players.find((p) => p.ref === actor.ref);
    if (!me) return refuse("Could not find your piece.", 500);
    if (to.z !== me.z) return refuse("You can only move on the level you are standing on.", 400);
    const distance = ctx.settings["turn.move_distance"];
    if (!withinSteps(me.x, me.y, to.x, to.y, distance)) {
      return refuse(`That is not within ${distance} step${distance === 1 ? "" : "s"} of you.`, 400);
    }
    if (!ctx.tiles.has(to.x, to.y, to.z)) return refuse("That tile is not charted yet, so you cannot move there.", 400);
    if (!SHARED_TILES && ctx.players.some((o) => o.ref !== actor.ref && o.x === to.x && o.y === to.y && o.z === to.z)) {
      return refuse("Another piece is standing there.", 409);
    }
    return null;
  },
  /** @rule 504.1 */
  afterAction(ctx, _actor, action) {
    if (action.kind !== "move" || !action.to) return [];
    const { x, y, z } = action.to;
    return [effects.chart(chartedAround(x, y, ctx.settings["board.chart_radius"]).map(([tx, ty]) => ({ x: tx, y: ty, z })))];
  },
});
