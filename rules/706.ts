// Rule 706, Flowers: once a day a living player can give a Flower (the item W4 made) to another player. The site moves it (the giver loses one, the receiver holds one more,
// and it shows on their card); this rule says who may, and when. Who starts with one, and how more are picked, are other rules' to say.
import { defineRule, entryMadeBy, refuse } from "promptocracy/engine";

export default defineRule({
  rule: 706,
  /** @rule 706.1 */
  giveItem(ctx, giver, target, entry) {
    const flower = entryMadeBy(ctx.catalog, "W4", "item");
    if (!flower || entry !== flower.id) return undefined;          // 703.4: nothing to act on; other items aren't this rule's
    const me = ctx.players.find((p) => p.ref === giver.ref), them = ctx.players.find((p) => p.ref === target);
    if (!me || me.state !== "living") return refuse("Only a living player can give a Flower (706.1).", 403);
    if (!them) return refuse("Say who to give it to.", 400);
    if (them.ref === me.ref) return refuse("Give it to another player (706.1).", 409);
    if (ctx.turn.given.some((g) => g.entry === flower.id)) return refuse("You already gave a Flower today (706.1).", 409);
    return null;
  },
});
