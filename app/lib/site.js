// ============================================================
//  EDIT EVERYTHING HERE. Nothing else needs touching.
// ============================================================

import { raceEndLabel } from "./leaderboard";

export const site = {
  name: "dougthegiant",
  // two-tier hero stack: huge brand word / medium second line
  heroHeadline: {
    main: "DOUGS",
    sub: "REWARDS",
  },
  heroSub:
    "Wager under the code, climb the board, get paid. A $500 monthly race, exclusive sign-up bonuses, and every stream in one place.",
};

// ---- Sponsor -------------------------------------------------
// One code, two sites. The code works on both Stake.us and Stake.com; the
// monthly leaderboard tracks Stake.com wagers only.
export const sponsor = {
  name: "Stake",
  tagline: "The platform behind the big wins",
  code: "ratmode",
  sites: "Stake.us & Stake.com",
  lbSite: "Stake.com",
  url: "https://stake.us/?offer=ratmode&c=Z6hGNufM",   // Stake.us
  comUrl: "https://stake.com/?c=6G8H0fdY",               // Stake.com (leaderboard counts these)
};

export const bonuses = [
  {
    casino: "Stake.us",
    badge: "OFFICIAL SPONSOR",
    headline: "25 SC + 250,000 GC",
    blurb: "No deposit required. Sign up under the code and the welcome package lands instantly.",
    perks: ["No deposit required", "Daily rakeback + reload bonuses", "Same code works on Stake.com"],
    code: "ratmode",
    url: "https://stake.us/?offer=ratmode&c=Z6hGNufM",
    cta: "Claim on Stake.us",
  },
  {
    casino: "Stake.com",
    badge: "WAGER RACE",
    headline: "$500 Monthly Race",
    blurb: "Every Stake.com wager under code ratmode counts automatically. Top 10 get paid every month.",
    perks: ["Auto-tracked, no sign-up form", `Race ends ${raceEndLabel()}`, "Prizes down to 10th place"],
    code: "ratmode",
    url: "https://stake.com/?c=6G8H0fdY",
    cta: "Claim on Stake.com",
  },
];

// ---- Socials -- PASTE YOUR REAL URLS HERE --------------------
// `live: true` puts a platform in the hero's watch-live buttons.
export const socials = [
  { name: "Kick",      handle: "@dougthegiant", url: "https://kick.com/dougthegiant",      cta: "Watch Live", accent: "#53fc18", live: true,
    blurb: "Main stream. Slots, bonus buys and every big win happens here first." },
  { name: "Twitch",    handle: "@doug",         url: "https://www.twitch.tv/doug",         cta: "Watch Live", accent: "#9146ff", live: true,
    blurb: "Second stream and reruns. Follow so you never miss a session going live." },
  { name: "X",         handle: "@dougthegiant", url: "https://x.com/dougthegiant",         cta: "Follow",     accent: "#ffffff",
    blurb: "Go-live alerts, clips and giveaway announcements." },
  { name: "Discord",   handle: "discord.gg/Bawzgby86", url: "https://discord.gg/Bawzgby86", cta: "Join",       accent: "#5865f2",
    blurb: "The community. Leaderboard payouts get announced and claimed in here." },
  { name: "Instagram", handle: "@dougthegiant", url: "https://instagram.com/dougthegiant", cta: "Follow",     accent: "#e1306c",
    blurb: "Behind the scenes, wins of the week and everything off-stream." },
];

// platforms shown as the hero watch-live buttons, in order
export const liveOn = socials.filter((s) => s.live);
export const liveUrl = liveOn[0].url;

// ---- Kick chat entry collection ------------------------------
// The channel never changes, so it is set here rather than on the page.
//
// chatroomId is REQUIRED: Kick's channel lookup sits behind Cloudflare and
// sends no CORS headers, so the browser cannot resolve the slug itself. Open
//   https://kick.com/api/v2/channels/dougthegiant
// in a normal browser tab, find "chatroom":{"id":NNNNNN,...} and paste that
// number below. It only has to be done once.
export const kick = {
  slug: "dougthegiant",
  chatroomId: "",          // <-- paste the numeric chatroom id here
  keyword: "!enter",
  maxEntrants: 15,
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Giveaways", href: "/giveaways" },
  { label: "Socials", href: "/socials" },
];
