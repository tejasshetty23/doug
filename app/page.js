import Image from "next/image";
import Link from "next/link";
import Shell from "./components/Shell";
import Podium from "./components/Podium";
import { Reveal, Sparks, CopyCode } from "./components/Bits";
import { SocialIcon, Icon } from "./components/Icons";
import { site, sponsor, bonuses, socials, liveOn } from "./lib/site";
import { getLeaderboard, PRIZE_POOL, fmtMoney, raceLabel } from "./lib/leaderboard";
import heroArt from "@/public/bg2.png";

export default async function Home() {
  const rows = await getLeaderboard();

  return (
    <Shell theme="theme-red">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-media">
          <Image src={heroArt} alt="" priority placeholder="blur" quality={90} />
        </div>
        <div className="hero-veil" />
        <div className="hero-tint" />
        <Sparks />

        <div className="hero-in wrap">
          <span className="livepill">
            <span className="dot" />
            {sponsor.name} &middot; code {sponsor.code}
          </span>

          <h1 className="display">
            <span className="main gtext">{site.heroHeadline.main}</span>
            <span className="sub gtext">{site.heroHeadline.sub}</span>
          </h1>

          <div className="hero-actions">
            {liveOn.map((s) => (
              <a
                key={s.name}
                className="btn btn-primary"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={s.name} className="btn-ic" />
                Watch on {s.name}
              </a>
            ))}
            <Link className="btn btn-primary" href="/leaderboard">
              <Icon.BarChart className="btn-ic" aria-hidden="true" />
              Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SPONSOR STRIP ================= */}
      <section className="section">
        <div className="wrap">
          <Reveal className="card sponsor">
            <div>
              <span className="eyebrow">Official sponsor</span>
              <h3 className="display gtext" style={{ marginTop: 10 }}>
                {sponsor.name}
              </h3>
              <p>
                Code <strong>{sponsor.code}</strong> works on {sponsor.sites}. The monthly
                leaderboard tracks {sponsor.lbSite} wagers.
              </p>
            </div>
            <div className="codebox">
              <span className="code">
                <span className="gtext">{sponsor.code}</span>
              </span>
              <a
                className="btn btn-primary"
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play on {sponsor.name}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= BONUSES ================= */}
      <section className="section section-alt" id="bonuses">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">Bonuses</span>
            <h2 className="display gtext">Claim your bonus</h2>
            <p>
              Sign up under code <strong>{sponsor.code}</strong> on {sponsor.sites}. Every{" "}
              {sponsor.lbSite} wager counts toward the monthly race automatically.
            </p>
          </div>

          <div className="grid-2">
            {bonuses.map((b, i) => (
              <Reveal key={b.headline} className="card bonus" delay={i * 100}>
                <span className="badge">{b.badge}</span>
                <div>
                  <div className="casino">{b.casino}</div>
                  <h3 className="display gtext" style={{ marginTop: 6 }}>
                    {b.headline}
                  </h3>
                </div>
                <p>{b.blurb}</p>
                <ul className="perks">
                  {b.perks.map((p) => (
                    <li key={p}>
                      <span className="tick" aria-hidden="true">
                        &#10003;
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="bonus-foot">
                  <a
                    className="btn btn-primary"
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {b.cta}
                  </a>
                  <CopyCode code={b.code} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD TEASER ================= */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">{raceLabel()} race</span>
            <h2 className="display gtext">{fmtMoney(PRIZE_POOL)} monthly leaderboard</h2>
            <p>Top 10 get paid every month. Here is who is running the board right now.</p>
          </div>

          <Podium rows={rows} bounce />

          <Reveal className="hero-actions" delay={220}>
            <Link className="btn btn-primary" href="/leaderboard" style={{ margin: "34px auto 0" }}>
              View full leaderboard
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= SOCIALS ================= */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">Keep up</span>
            <h2 className="display gtext">Follow {site.name}</h2>
            <p>Streams, clips, drops and giveaways. All of it lands here first.</p>
          </div>

          <div className="socials">
            {socials.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <a
                  className="card soc"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "grid" }}
                >
                  <span className="soc-ic" style={{ color: s.accent }}>
                    <SocialIcon name={s.name} />
                  </span>
                  <span className="soc-name gtext">{s.name}</span>
                  <span className="soc-handle">{s.handle}</span>
                  <span className="btn btn-ghost btn-sm">{s.cta}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="section">
        <div className="wrap">
          <Reveal className="card band">
            <span className="eyebrow">Ready?</span>
            <h2 className="display gtext">Get in the race</h2>
            <p>
              {fmtMoney(PRIZE_POOL)} on the line every month. Sign up under code {sponsor.code} and
              start climbing today.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Claim bonus on {sponsor.name}
              </a>
              <Link className="btn btn-ghost" href="/leaderboard">
                See the board
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}
