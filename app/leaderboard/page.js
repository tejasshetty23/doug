import Image from "next/image";
import Shell from "../components/Shell";
import Podium from "../components/Podium";
import { Reveal, Sparks, Countdown, CopyCode } from "../components/Bits";
import { sponsor, liveOn } from "../lib/site";
import { SocialIcon } from "../components/Icons";
import {
  getLeaderboard,
  PRIZE_POOL,
  PRIZES,
  fmtMoney,
  raceEndsAt,
  raceLabel,
  raceEndLabel,
} from "../lib/leaderboard";
import bg4 from "@/public/bg4.png";

export const metadata = {
  title: "Leaderboard",
  description: "The $500 monthly Stake.com wager race. Top 10 paid every month under code ratmode.",
};

export default async function Leaderboard() {
  const rows = await getLeaderboard();
  const paid = rows.filter((r) => r.prize > 0);
  const rest = paid.slice(3);
  const totalWagered = rows.reduce((sum, r) => sum + r.wagered, 0);

  return (
    <Shell theme="theme-green">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-media">
          <Image src={bg4} alt="" priority placeholder="blur" quality={90} />
        </div>
        <div className="hero-veil" />
        <div className="hero-tint" />
        <Sparks />

        <div className="hero-in wrap">
          <span className="livepill">
            <span className="dot" />
            {raceLabel()}
          </span>

          <h1 className="display">
            <span className="kicker">Monthly wager race</span>
            <span className="main gtext">LEADERBOARD</span>
          </h1>

          <Countdown endsAt={raceEndsAt()} />

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={sponsor.comUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the race
            </a>
            {liveOn.map((s) => (
              <a
                key={s.name}
                className="btn btn-ghost"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={s.name} className="btn-ic" />
                Watch on {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="stats">
            {[
              [fmtMoney(PRIZE_POOL), "Prize pool"],
              [`${PRIZES.length}`, "Paid places"],
              [fmtMoney(totalWagered), "Total wagered"],
            ].map(([n, l], i) => (
              <Reveal key={l} className="card stat" delay={i * 90}>
                <div className="n gtext">{n}</div>
                <div className="l">{l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PODIUM ================= */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">Top of the board</span>
            <h2 className="display gtext">Leading the pack</h2>
          </div>
          <Podium rows={rows} />
        </div>
      </section>

      {/* ================= FULL TABLE ================= */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="card board">
            <div className="trow thead">
              <span>Rank</span>
              <span>Player</span>
              <span className="t-hide">Wagered</span>
              <span className="t-head-r">Prize</span>
            </div>
            <div className="tbody">
              {rest.map((r) => (
                <div className="trow" key={r.rank}>
                  <span className="rank">{r.rank}</span>
                  <span className="t-user">{r.username}</span>
                  <span className="t-wager t-hide">{fmtMoney(r.wagered)}</span>
                  <span className="t-prize gtext">{fmtMoney(r.prize)}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="shead" delay={140} style={{ marginTop: 34 }}>
            <p style={{ fontSize: 14 }}>
              Not on the board yet? Sign up on {sponsor.lbSite} under code{" "}
              <strong>{sponsor.code}</strong> and your wagers start counting immediately.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= RULES ================= */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">The rules</span>
            <h2 className="display gtext">Good to know</h2>
          </div>

          <div className="steps">
            {[
              {
                t: "Code required",
                d: `Your ${sponsor.lbSite} account has to be signed up under code ${sponsor.code} for wagers to track. The code also works on Stake.us, but only ${sponsor.lbSite} play counts toward the board.`,
              },
              {
                t: `Race ends ${raceEndLabel()}`,
                d: `The board closes at 00:00 UTC on ${raceEndLabel()}. The next race starts fresh, with everyone back at zero.`,
              },
              {
                t: "Paid through Discord",
                d: "Winners are contacted through Discord within 48 hours of the race closing.",
              },
            ].map((s, i) => (
              <Reveal key={s.t} className="card step" delay={i * 100}>
                <div className="step-n">{i + 1}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="section">
        <div className="wrap">
          <Reveal className="card band">
            <span className="eyebrow">Still time</span>
            <h2 className="display gtext">Climb the board</h2>
            <p>
              {fmtMoney(PRIZE_POOL)} on the line this month. Sign up, play, get paid.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={sponsor.comUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play on {sponsor.name}
              </a>
              <CopyCode code={sponsor.code} className="btn btn-ghost" />
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}
