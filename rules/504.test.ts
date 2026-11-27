import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCtx } from "promptocracy/engine/testing";
import { DIAGONAL_MOVES, SHARED_TILES } from "promptocracy/engine";
import rule from "./504.ts";

const players = [{ ref: "a", x: 0, y: 0 }, { ref: "b", x: 1, y: 0 }];
const ask = (to: any, o: any = {}) => rule.actionAllowed!(makeCtx({ players, ...o }), { ref: "a" }, { kind: "move", to });

test("504: one step, diagonals included, onto a free charted tile", () => {
  assert.equal(ask({ x: 0, y: 1, z: 0 }), null);
  assert.equal(ask({ x: 1, y: 1, z: 0 }), null);
  assert.equal(ask({ x: -1, y: -1, z: 0 }), null);
});
test("504: not the same tile, not two steps away (the default distance is 1)", () => {
  assert.match(ask({ x: 0, y: 0, z: 0 })!.error, /not within 1 step of you/);
  assert.equal(ask({ x: 2, y: 2, z: 0 })!.status, 400);
  assert.equal(ask({ x: 2, y: 2, z: 0 }, { settings: { "turn.move_distance": 2 } }), null);
});
test("504: another level is refused", () => {
  assert.equal(ask({ x: 0, y: 1, z: 1 })!.error, "You can only move on the level you are standing on.");
});
test("504: an uncharted tile is refused; the island's own edge tile is fine (columns run 4W..4E, x -4..3)", () => {
  const edge = { players: [{ ref: "a", x: 3, y: 0 }] };
  assert.equal(ask({ x: 3, y: 1, z: 0 }, edge), null);
  assert.deepEqual(ask({ x: 4, y: 0, z: 0 }, edge), { error: "That tile is not charted yet, so you cannot move there.", status: 400 });
});
test("504: a tile another piece stands on is refused with a 409", () => {
  assert.deepEqual(ask({ x: 1, y: 0, z: 0 }), { error: "Another piece is standing there.", status: 409 });
});
test("504: a question (no destination) and other actions pass", () => {
  assert.equal(rule.actionAllowed!(makeCtx({ players }), { ref: "a" }, { kind: "move" }), null);
  assert.equal(rule.actionAllowed!(makeCtx({ players }), { ref: "a" }, { kind: "propose" }), null);
});
test("504: moving charts the 21-tile shape around where you land, and only that", () => {
  const [e] = rule.afterAction!(makeCtx({ players }), { ref: "a" }, { kind: "move", to: { x: 10, y: 10, z: 0 } });
  assert.equal(e.type, "chart");
  assert.equal((e as any).tiles.length, 21);
  assert.ok((e as any).tiles.some((t: any) => t.x === 10 && t.y === 10 && t.z === 0));
  assert.ok(!(e as any).tiles.some((t: any) => t.x === 12 && t.y === 12), "corners stay uncharted");
});
test("504: a bigger chart radius charts more", () => {
  const [e] = rule.afterAction!(makeCtx({ players, settings: { "board.chart_radius": 3 } }), { ref: "a" }, { kind: "move", to: { x: 0, y: 0, z: 0 } });
  assert.equal((e as any).tiles.length, 37);
});
test("504: nothing is charted for other actions", () => {
  assert.deepEqual(rule.afterAction!(makeCtx({ players }), { ref: "a" }, { kind: "propose" }), []);
});
test("504: a diagonal two tiles away is refused at distance 1 and allowed at distance 2", () => {
  assert.equal(ask({ x: 2, y: 2, z: 0 })!.status, 400);
  assert.equal(ask({ x: 2, y: 2, z: 0 }, { settings: { "turn.move_distance": 2 } }), null);
});
test("504: a mover the board does not know is a 500, not a pass", () => {
  assert.deepEqual(rule.actionAllowed!(makeCtx({ players }), { ref: "ghost" }, { kind: "move", to: { x: 0, y: 1, z: 0 } }), { error: "Could not find your piece.", status: 500 });
});
test("504: a move on another level than the mover's is refused, whatever level the mover stands on", () => {
  const up = [{ ref: "a", x: 0, y: 0, z: 1 }];
  assert.equal(rule.actionAllowed!(makeCtx({ players: up, tiles: [{ x: 0, y: 1, z: 0 }, { x: 0, y: 1, z: 1 }] }), { ref: "a" }, { kind: "move", to: { x: 0, y: 1, z: 0 } })!.error, "You can only move on the level you are standing on.");
  assert.equal(rule.actionAllowed!(makeCtx({ players: up, tiles: [{ x: 0, y: 1, z: 0 }, { x: 0, y: 1, z: 1 }] }), { ref: "a" }, { kind: "move", to: { x: 0, y: 1, z: 1 } }), null);
});
test("504: a piece on another level does not block the tile", () => {
  const two = [{ ref: "a", x: 0, y: 0 }, { ref: "b", x: 1, y: 0, z: 1 }];
  assert.equal(rule.actionAllowed!(makeCtx({ players: two }), { ref: "a" }, { kind: "move", to: { x: 1, y: 0, z: 0 } }), null);
});
test("504: the chart shape is the 5x5 square without its corners, tile by tile", () => {
  const [e] = rule.afterAction!(makeCtx({ players }), { ref: "a" }, { kind: "move", to: { x: 0, y: 0, z: 0 } }) as any[];
  const have = new Set(e.tiles.map((t: any) => `${t.x},${t.y}`));
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
    const corner = Math.abs(dx) === 2 && Math.abs(dy) === 2;
    assert.equal(have.has(`${dx},${dy}`), !corner, `${dx},${dy}`);
  }
});
test("504: the platform constants the text relies on: diagonals count as a step, pieces cannot share a tile", () => {
  assert.equal(DIAGONAL_MOVES, true);
  assert.equal(SHARED_TILES, false);
});

test("504: nobody moves onto a creature, a dead piece or a Ghost", () => {
  const me = { ref: "a", x: 0, y: 0 };
  const players = [me, { ref: "d", x: 1, y: 0, state: "dead", deadDay: 1 }, { ref: "g", x: 0, y: 1, state: "ghost", deadDay: 1 }];
  const ctx = makeCtx({ players, creatures: [{ id: 1, entry: "C1", x: 1, y: 1, z: 0, hearts: 3, resting: false }] });
  for (const [x, y] of [[1, 0], [0, 1], [1, 1]]) assert.equal(rule.actionAllowed!(ctx, { ref: "a" }, { kind: "move", to: { x, y, z: 0 } })?.status, 409, `${x},${y}`);
  assert.equal(rule.actionAllowed!(ctx, { ref: "a" }, { kind: "move", to: { x: -1, y: 0, z: 0 } }), null);
});
test("504: a Ghost's move charts tiles like anyone's (504.1)", () => {
  const ctx = makeCtx({ players: [{ ref: "g", x: 0, y: 0, state: "ghost", deadDay: 1 }] });
  const fx = rule.afterAction!(ctx, { ref: "g" }, { kind: "move", to: { x: 1, y: 0, z: 0 } });
  assert.equal(fx[0].type, "chart");
});

const tileCatalog = (...ids: string[]) => [{ id: "C1", kind: "creature" }, ...ids.map((id) => ({ id, kind: "tile" }))] as any[];
const charted = (o: any = {}) => (rule.afterAction!(makeCtx({ players, ...o }), { ref: "a" }, { kind: "move", to: { x: 10, y: 10, z: 0 } }) as any[])[0].tiles as any[];
test("504.3: no tile entries -> every charted tile is blank", () => {
  const tiles = charted({ catalog: tileCatalog() });
  assert.equal(tiles.length, 21);
  assert.ok(tiles.every((t) => !("entry" in t)));
});
test("504.3: one tile entry -> every newly charted tile is it", () => {
  const tiles = charted({ catalog: tileCatalog("T1") });
  assert.equal(tiles.length, 21);
  assert.ok(tiles.every((t) => t.entry === "T1"));
});
test("504.3: two tile entries -> each new tile is one of them, the same under the same seed", () => {
  const a = charted({ catalog: tileCatalog("T1", "T2"), seed: "test" }), b = charted({ catalog: tileCatalog("T1", "T2"), seed: "test" });
  assert.deepEqual(a, b);
  assert.ok(a.every((t) => t.entry === "T1" || t.entry === "T2"));
  assert.ok(new Set(a.map((t) => t.entry)).size === 2, "21 draws from a fixed seed use both");
});
test("504.3: an already charted tile gets no entry", () => {
  const tiles = (rule.afterAction!(makeCtx({ players, catalog: tileCatalog("T1") }), { ref: "a" }, { kind: "move", to: { x: 3, y: 3, z: 0 } }) as any[])[0].tiles as any[];
  const island = tiles.filter((t) => t.x <= 3 && t.y <= 3);
  assert.ok(island.length > 0 && island.every((t) => !("entry" in t)));
  assert.ok(tiles.filter((t) => t.x > 3 || t.y > 3).every((t) => t.entry === "T1"));
});
test("504.3: a creature entry is never picked", () => {
  assert.ok(charted({ catalog: tileCatalog("T1") }).every((t) => t.entry !== "C1"));
});
