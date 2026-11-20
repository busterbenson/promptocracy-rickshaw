import { test } from "node:test";
import assert from "node:assert/strict";
import { island, makeCtx } from "promptocracy/engine/testing";
import rule from "./505.ts";

const tiles = island(8);
const spawn = (o: any = {}) => rule.spawnTile!(makeCtx({ tiles, ...o }), (o.tiles ?? tiles).filter((t: any) => t.z === 0));

test("505: on the 8x8 island the piece lands on one of the 16 inner tiles (x -2..1, y -2..1)", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const t = spawn({ seed: `s${i}` })!;
    assert.ok(t.x >= -2 && t.x <= 1 && t.y >= -2 && t.y <= 1, `${t.x},${t.y}`);
    seen.add(`${t.x},${t.y}`);
  }
  assert.equal(seen.size, 16, "every inner tile comes up");
});
test("505: never a tile another piece stands on", () => {
  const players = [] as any[];
  for (let x = -2; x <= 1; x++) for (let y = -2; y <= 1; y++) if (!(x === 1 && y === 1)) players.push({ ref: `p${x}${y}`, x, y });
  assert.equal(players.length, 15);
  for (let i = 0; i < 20; i++) assert.deepEqual(spawn({ players, seed: `q${i}` }), { x: 1, y: 1, z: 0 });
});
test("505: with every inner tile taken there is no room", () => {
  const players = [] as any[];
  for (let x = -2; x <= 1; x++) for (let y = -2; y <= 1; y++) players.push({ ref: `p${x}${y}`, x, y });
  assert.equal(spawn({ players }), null);
});
test("505: a 4x4 island has no spot, a 6x6 island has 4", () => {
  assert.equal(spawn({ tiles: island(4) }), null);
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) { const t = spawn({ tiles: island(6), seed: `t${i}` })!; seen.add(`${t.x},${t.y}`); }
  assert.equal(seen.size, 4);
});
test("505: the chart radius sets how far from the edge a piece starts", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) { const t = spawn({ settings: { "board.chart_radius": 3 }, seed: `u${i}` })!; seen.add(`${t.x},${t.y}`); }
  assert.equal(seen.size, 4);
});
test("505: the same seed gives the same tile", () => {
  assert.deepEqual(spawn({ seed: "x" }), spawn({ seed: "x" }));
});
