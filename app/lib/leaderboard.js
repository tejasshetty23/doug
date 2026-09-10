// ============================================================
//  LEADERBOARD DATA
//  Prize pool: $500/month, paid down to 10th place.
// ============================================================

export const PRIZE_POOL = 500;
export const PRIZES = [150, 100, 75, 50, 40, 30, 20, 15, 12, 8]; // === $500

// ---- Placeholder standings ---------------------------------
// Swap for the live API when you have the key (see getLeaderboard below).
const PLACEHOLDER = [
  { username: "ra***de",  wagered: 184920 },
  { username: "sl***ng",  wagered: 152340 },
  { username: "bi***tt",  wagered: 141075 },
  { username: "gi***nt",  wagered: 118600 },
  { username: "mo***rd",  wagered: 96450 },
  { username: "tu***ax",  wagered: 84210 },
  { username: "dr***on",  wagered: 71880 },
  { username: "no***mi",  wagered: 60340 },
  { username: "ka***99",  wagered: 52170 },
  { username: "ze***ro",  wagered: 45900 },
  { username: "lu***ky",  wagered: 38240 },
  { username: "ph***nx",  wagered: 31005 },
];

/**
 * Returns the current standings, ranked and prize-assigned.
 *
 * TO GO LIVE: set STAKE_API_KEY in .env.local, then replace the
 * PLACEHOLDER line below with your fetch, e.g.
 *
 *   const res  = await fetch(process.env.STAKE_API_URL, {
 *     headers: { "x-api-key": process.env.STAKE_API_KEY },
 *     next: { revalidate: 300 },
 *   });
 *   const rows = (await res.json()).map((r) => ({
 *     username: r.name, wagered: r.wagered,
 *   }));
 *
 * Everything below this line keeps working unchanged.
 */
export async function getLeaderboard() {
  const rows = PLACEHOLDER;

  return rows
    .slice()
    .sort((a, b) => b.wagered - a.wagered)
    .map((row, i) => ({
      ...row,
      rank: i + 1,
      prize: PRIZES[i] ?? 0,
    }));
}

// ---- Monthly race window -----------------------------------
// Race resets at 00:00 UTC on the 1st of each month.
export function raceEndsAt() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0);
}

export function raceLabel() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export const fmtMoney = (n) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
