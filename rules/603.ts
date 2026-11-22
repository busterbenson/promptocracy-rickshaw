// Rule 603, Death. Dying itself (a player or creature at 0 hearts, 601.3) and a creature leaving the board (603.2) are the engine's night board; the
// player's piece stays where they died (603.1). Here: the dead rise as Ghosts at the end of the third day after they died (603.3), and the checks for giving a
// dead player a heart before then (603.4).
import { defineRule, effects, refuse } from "promptocracy/engine";

/** @rule 603.4 */
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

export default defineRule({
  rule: 603,
  /** The checks for giving a heart (603.4); the site does the giving. @rule 603.4 */
  actionAllowed(ctx, actor, action) {
    if (action.kind !== "give_heart") return null;
    const me = ctx.players.find((p) => p.ref === actor.ref);
    const them = ctx.players.find((p) => p.ref === action.target);
    if (!me || me.state !== "living") return refuse("Only a living player can give a heart (603.4).", 403);
    if (!them) return refuse("Say whose piece.", 400);
    if (them.state === "ghost") return refuse("They have risen as a Ghost (603.3).", 409);
    if (them.state !== "dead") return refuse("They aren't dead (603.1).", 409);
    if (me.z !== them.z || dist(me, them) > 1) return refuse("You aren't next to their piece (603.4).", 409);
    if (me.hearts < 2) return refuse("You need at least 2 hearts to give one (603.4).", 409);
    if (ctx.turn.gave) return refuse("You already gave a heart today (603.4).", 409);
    return null;
  },
  /** @rule 603.3 */
  night(ctx) {
    const days = ctx.settings["death.ghost_days"];
    return ctx.players.filter((p) => p.state === "dead" && p.deadDay !== null && ctx.day !== null && p.deadDay + days <= ctx.day).map((p) => effects.rise(p.ref));
  },
});
