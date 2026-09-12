// ============================================================
//  DUNGEON CRAWL RACE
//
//  Finish order comes from SHA-256(seed + "|" + entrants) fed into a PRNG, so
//  the same inputs always give the same result. A fresh random seed is drawn
//  for every race and is never surfaced in the UI.
//
//  That determinism is what lets the whole race be computed up front: the
//  frames are generated once and then played back, and any past result can be
//  reproduced exactly from its seed and entrant list if it is ever disputed.
// ============================================================

export const DISTANCE = 1000;     // track length in arbitrary units
export const MAX_TICKS = 900;     // hard stop so a race can never hang

/** 32 hex chars of cryptographic randomness. */
export function randomSeed() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** The exact string that gets hashed. Kept in one place so verifying matches. */
export function raceInput(seed, entrants) {
  return `${seed}|${entrants.join("\n")}`;
}

/** xoshiro128** - small, fast, and far better distributed than a 32-bit LCG. */
function makeRng(hex) {
  let a = parseInt(hex.slice(0, 8), 16) >>> 0;
  let b = parseInt(hex.slice(8, 16), 16) >>> 0;
  let c = parseInt(hex.slice(16, 24), 16) >>> 0;
  let d = parseInt(hex.slice(24, 32), 16) >>> 0;
  if (!(a | b | c | d)) a = 1; // never allow the all-zero state
  return function next() {
    const t = (b << 9) >>> 0;
    let r = Math.imul(a, 5);
    r = (Math.imul((r << 7) | (r >>> 25), 9)) >>> 0;
    c ^= a; d ^= b; b ^= c; a ^= d; c ^= t;
    d = ((d << 11) | (d >>> 21)) >>> 0;
    return r / 4294967296;
  };
}

/**
 * Deterministically run the whole race up front, then hand back every frame
 * for playback. Nothing about the outcome depends on timing or the browser --
 * same hash in, same finish order out, on any machine.
 */
export function simulateRace(hashHex, entrants) {
  const rng = makeRng(hashHex);
  const n = entrants.length;
  const pos = new Array(n).fill(0);
  const done = new Array(n).fill(false);
  const finishAt = new Array(n).fill(Infinity);
  const frames = [];
  const events = [];
  let finished = 0;

  for (let tick = 0; tick < MAX_TICKS && finished < n; tick++) {
    const tickEvents = [];
    for (let i = 0; i < n; i++) {
      if (done[i]) continue;

      let step = 3 + rng() * 5;              // baseline pace
      const roll = rng();
      if (roll < 0.05) {                     // sprint down a corridor
        step *= 2.7;
        tickEvents.push({ i, kind: "surge" });
      } else if (roll > 0.96) {              // tripped in the dark
        step *= 0.12;
        tickEvents.push({ i, kind: "stumble" });
      }

      const prev = pos[i];
      const next = prev + step;
      if (next >= DISTANCE) {
        // Record WHERE IN THE TICK the line was crossed. Without this, everyone
        // crossing on the same tick would be ranked by array index, which hands
        // a real edge to whoever was pasted first.
        done[i] = true;
        finished++;
        finishAt[i] = tick + (step > 0 ? (DISTANCE - prev) / step : 0);
        pos[i] = DISTANCE;
      } else {
        pos[i] = next;
      }
    }
    frames.push(pos.slice());
    events.push(tickEvents);
  }

  // finishers by crossing time; anyone still running is ranked by ground covered
  const order = Array.from({ length: n }, (_, i) => i).sort((x, y) => {
    if (finishAt[x] !== finishAt[y]) return finishAt[x] - finishAt[y];
    if (pos[x] !== pos[y]) return pos[y] - pos[x];
    return x - y;
  });

  return { frames, events, order, ranking: order.map((i) => entrants[i]) };
}

/** Full pipeline: seed + names -> hash + result. Used to run AND to verify. */
export async function runRace(seed, entrants) {
  const hash = await sha256Hex(raceInput(seed, entrants));
  return { hash, ...simulateRace(hash, entrants) };
}
