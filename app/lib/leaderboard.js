// ============================================================
//  LEADERBOARD DATA
//  Prize pool: $500, paid down to 10th place.
//
//  Live standings come from Doug's affiliate Google Sheet, published as CSV
//  (File -> Share -> Publish to web -> that tab -> CSV). Put the link in
//  LEADERBOARD_CSV_URL in .env.local and in Vercel's environment variables.
//  Keep it server-only: never prefix it with NEXT_PUBLIC_.
//  With no link set, the site falls back to the placeholder rows below.
// ============================================================

export const PRIZE_POOL = 500;
export const PRIZES = [150, 100, 75, 50, 40, 30, 20, 15, 12, 8]; // === $500

// how often the sheet is re-read, in seconds
const REFRESH_SECONDS = 300;

// ---- Placeholder standings (only used when no sheet link is set) ----
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

/** Small RFC 4180 CSV parser: quoted fields, "" escapes, CRLF line endings. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** "$1,234.56" -> 1234.56 */
const toNumber = (s) => Number(String(s).replace(/[^0-9.-]/g, "")) || 0;

/** Show only the edges of each player's name: "iamverybadgirl" -> "ia***rl". */
function maskName(name) {
  const n = String(name).trim();
  return n.length <= 4 ? n.slice(0, 1) + "***" : n.slice(0, 2) + "***" + n.slice(-2);
}

async function fetchSheetRows(url) {
  const res = await fetch(url, { next: { revalidate: REFRESH_SECONDS } });
  if (!res.ok) throw new Error(`Leaderboard sheet returned HTTP ${res.status}`);

  const [header = [], ...body] = parseCsv(await res.text());
  // "User Name", "user_name" and "USERNAME" all count - only the letters matter
  const norm = (h) => String(h).toLowerCase().replace(/[^a-z]/g, "");
  const col = (...names) => header.findIndex((h) => names.includes(norm(h)));
  const iUser = col("username", "user");
  const iWager = col("wagered", "wager");
  // a private sheet answers with a login page, which has none of these columns
  if (iUser < 0 || iWager < 0) {
    throw new Error(
      `Leaderboard sheet has no "User Name"/"Wagered" columns - is it published as CSV? Got: ${header.join(", ").slice(0, 120)}`
    );
  }

  return body
    .filter((r) => r[iUser]?.trim())
    .map((r) => ({ username: maskName(r[iUser]), wagered: toNumber(r[iWager]) }));
}

/**
 * Returns the current standings, ranked and prize-assigned.
 *
 * A failed sheet fetch throws on purpose. During a background refresh Next
 * then keeps serving the last good page, rather than swapping the board for an
 * empty or fake one; on a fresh deploy the build fails loudly instead of
 * shipping wrong numbers.
 */
export async function getLeaderboard() {
  const url = process.env.LEADERBOARD_CSV_URL;
  const rows = url ? await fetchSheetRows(url) : PLACEHOLDER;

  return rows
    .slice()
    .sort((a, b) => b.wagered - a.wagered)
    .map((row, i) => ({
      ...row,
      rank: i + 1,
      prize: PRIZES[i] ?? 0,
    }));
}

// ---- Race window -------------------------------------------
// Taken from the sheet's tab name ("2026-09-06 to 2026-10-08"). Each race gets
// its own tab, so when a new one starts: update these two dates AND point
// LEADERBOARD_CSV_URL at the new tab's published link.
export const RACE = {
  start: "2026-09-06T00:00:00Z",
  end: "2026-10-08T00:00:00Z",
};

export function raceEndsAt() {
  return Date.parse(RACE.end);
}

const day = (d) =>
  new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** "Sep 6 – Oct 8" */
export const raceLabel = () => `${day(RACE.start)} – ${day(RACE.end)}`;

/** "Oct 8" */
export const raceEndLabel = () => day(RACE.end);

// whole dollars stay clean ("$150"); real wagers keep their cents ("$548.38")
export const fmtMoney = (n) =>
  "$" +
  n.toLocaleString(
    "en-US",
    Number.isInteger(n)
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
