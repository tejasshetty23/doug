# dougthegiant — Rewards

Four-page Next.js site for the stream. Each page has its own colour theme,
derived from the background art it uses.

## Run it

```bash
npm install
npm run dev -- -p 3001
```

Then open <http://localhost:3001>.

> Port 3000 is taken by another app on this machine, so use 3001.
>
> If 3001 reports `EADDRINUSE` from an earlier run, free it with:
> ```powershell
> Get-NetTCPConnection -LocalPort 3001 -State Listen | %{ Stop-Process -Id $_.OwningProcess -Force }
> ```
> Stop the dev server before `npm run build` — they clash over `.next`.

## Pages

| Page | Route | Background | Theme |
|---|---|---|---|
| Home | `/` | `public/bg2.png` (blood moon) | white → crimson |
| Leaderboard | `/leaderboard` | `public/bg4.png` (sunlit valley) | white → green |
| Giveaways | `/giveaways` | `public/bg1.png` (moonlit ruins) | white → blue |
| Socials | `/socials` | `public/bg3.png` (candlelit hall) | white → gold |

The theme is a class (`.theme-red`, `.theme-green`, `.theme-blue`, `.theme-gold`)
applied by [`app/components/Shell.js`](app/components/Shell.js). Every colour is a
CSS custom property defined once per theme at the top of
[`app/globals.css`](app/globals.css) — retheming a page means editing that one
block, nothing else.

## Editing content

Almost everything you'll want to change lives in
**[`app/lib/site.js`](app/lib/site.js)**: sponsor links and code, socials, nav,
and the Kick chat settings.

### Still to fill in

- `LEADERBOARD_CSV_URL` — **required** for real standings. See
  [Leaderboard](#leaderboard) below; until it's set the board shows placeholder
  rows.
- `kick.chatroomId` — **required** for the giveaway chat integration. Kick's
  channel lookup is behind Cloudflare and sends no CORS headers, so neither the
  browser nor a script can resolve it. Open
  `https://kick.com/api/v2/channels/dougthegiant` in a normal browser tab, find
  `"chatroom":{"id":…}` and paste that number in. One time only.
- `socials[0].url` — the Kick URL is still a guess (`kick.com/dougthegiant`).

## Leaderboard

Standings come from Doug's affiliate Google Sheet ("Affiliate Wager Race
Exclusive"), read as CSV by [`app/lib/leaderboard.js`](app/lib/leaderboard.js).

The leaderboard tab is **published to web as CSV** (*File → Share → Publish to
web* → that tab → **CSV**). That lets the server read it without logging in,
while the sheet itself stays private. Put the published link in
`LEADERBOARD_CSV_URL`:

- locally: `.env.local` (gitignored)
- live: Vercel → Project → Settings → Environment Variables, then redeploy

Keep it server-only — never prefix it with `NEXT_PUBLIC_`.

How it behaves:

- Columns are matched by header name, ignoring case, spaces and underscores
  (`User Name`, `user_name` and `USERNAME` all work), so column order doesn't
  matter. `$1,234.56`-style amounts are parsed and blank rows skipped.
- The sheet is re-read at most every 5 minutes. The home podium and the
  leaderboard page both update from it.
- Names are masked on the server (`iamverybadgirl` → `ia***rl`), so full
  usernames never reach the browser.
- If the sheet can't be read, the fetch throws on purpose: Next keeps serving the
  last good page instead of an empty or fake board, and a fresh deploy fails
  loudly instead of shipping wrong numbers.
- With no URL set, it falls back to placeholder rows.

Prize pool is `$500`, split down to 10th place:

| 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th | 10th |
|---|---|---|---|---|---|---|---|---|---|
| $150 | $100 | $75 | $50 | $40 | $30 | $20 | $15 | $12 | $8 |

**Race dates** live in `RACE` in [`app/lib/leaderboard.js`](app/lib/leaderboard.js),
currently Sep 6 → Oct 8 2026, taken from the sheet's tab name. The countdown
targets `RACE.end` (00:00 UTC). Each race gets its own tab, and a published link
points at one tab only, so when a new race starts:

1. Publish the new tab (*File → Share → Publish to web* → that tab → **CSV**)
2. Swap `LEADERBOARD_CSV_URL` in `.env.local` and in Vercel, then redeploy
3. Update the two dates in `RACE`

## Giveaways

`/giveaways` runs a dungeon-crawl race for a single winner.

Entrants come from **Kick chat**: hit *Connect to chat*, and the first N unique
users to type the keyword exactly are entered. The browser subscribes directly to
the Pusher socket Kick's own frontend uses
(`chatrooms.{id}.v2` / `App\Events\ChatMessageEvent`), so there is no backend
anywhere in the loop. It's an unofficial transport — if entries ever stop
arriving, check whether the app key or channel format has moved.

The race itself ([`app/lib/race.js`](app/lib/race.js)) is deterministic: finish
order is derived from `SHA-256(seed + entrant list)` fed into a xoshiro128\*\*
PRNG. A fresh random seed is drawn per race and never surfaced in the UI.

Finish order uses a sub-tick crossing time rather than array index. That matters:
ranking same-tick finishers by index gave whoever was listed first a measurable
edge (12.8% vs 9.6% win rate over 6,000 races, χ² = 45.2). With the fix, 30,000
races gave χ² = 8.02 against a p=0.05 threshold of 15.51 — statistically
indistinguishable from uniform.

## Assets

Source art (`bg*.png`, `pattern*`) sits at the repo root. `public/` holds only
what the site actually serves — the four backgrounds, the two podium frame
sheets, and the topo texture.

Frame sheets are 3-up sprites picked with `background-position`, so each podium
loads one image rather than three. `frames-red.webp` was recovered from a
black-matte original by deriving alpha from the brightest channel and
un-premultiplying, which is why the interiors are transparent rather than black.

## Build

```bash
npm run build && npm start
```
