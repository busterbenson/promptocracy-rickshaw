// Rule 605, Defeating creatures. A creature can be defeated only while two living players flank it: each next to it (602.2), on the same level,
// on opposite sides in a straight line through it (one at the creature's position plus a step, the other at the creature's position minus that
// same step; the step can be any of the 8 directions, diagonals included). A creature has no facing, so "in front" and "behind" are just the two
// ends of that line. No rule takes a creature's hearts yet (601.2, 601.3), so this module has no hook: `canBeDefeated` is the check, and the rule
// that defeats a creature uses it.
import { defineRule } from "promptocracy/engine";

type Pos = { x: number; y: number; z: number };
type Ctx = { players: { x: number; y: number; z: number; state: string }[] };

/** The 4 straight lines through a tile: each step d and its opposite -d cover 2 of the 8 tiles next to it (602.2). @rule 605.1 */
const STEPS = [[1, 0], [0, 1], [1, 1], [1, -1]] as const;

/** Whether the creature is flanked by two living players right now, so it can be defeated. @rule 605.1 */
export function canBeDefeated(ctx: Ctx, creature: Pos): boolean {
  const living = ctx.players.filter((p) => p.state === "living" && p.z === creature.z);
  /** @rule 605.1 */
  const at = (x: number, y: number) => living.some((p) => p.x === x && p.y === y);
  return STEPS.some(([dx, dy]) => at(creature.x + dx, creature.y + dy) && at(creature.x - dx, creature.y - dy));
}

export default defineRule({ rule: 605 });
