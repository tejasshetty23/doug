import Image from "next/image";
import Link from "next/link";
import Shell from "../components/Shell";
import { Reveal, Sparks } from "../components/Bits";
import { SocialIcon } from "../components/Icons";
import { site, socials, liveOn, sponsor } from "../lib/site";
import heroArt from "@/public/bg3.png";

export const metadata = {
  title: "Socials",
  description: "Every dougthegiant channel in one place - Kick, Twitch, X, Discord and Instagram.",
};

export default function Socials() {
  return (
    <Shell theme="theme-gold">
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
            {socials.length} channels &middot; one place
          </span>

          <h1 className="display">
            <span className="main gtext">SOCIALS</span>
            <span className="sub gtext">{site.name}</span>
          </h1>

          <p className="hero-sub">
            Streams, clips, drops and giveaways. Follow everywhere so you never miss a session
            going live or a leaderboard payout.
          </p>

          <div className="hero-actions">
            {liveOn.map((s, i) => (
              <a
                key={s.name}
                className={`btn ${i === 0 ? "btn-primary" : "btn-ghost"}`}
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

      {/* ================= ALL CHANNELS ================= */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">Every channel</span>
            <h2 className="display gtext">Follow {site.name}</h2>
            <p>Five places to keep up. All of it lands here first.</p>
          </div>

          <div className="soc-list">
            {socials.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <a
                  className="card soc-row"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="soc-ic" style={{ color: s.accent }}>
                    <SocialIcon name={s.name} />
                  </span>
                  <span className="soc-meta">
                    <span className="soc-name gtext">{s.name}</span>
                    <span className="soc-handle">{s.handle}</span>
                    <span className="soc-blurb">{s.blurb}</span>
                  </span>
                  <span className="btn btn-ghost btn-sm soc-go">
                    {s.live ? "Watch Live" : s.cta}
                  </span>
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
            <span className="eyebrow">While you are here</span>
            <h2 className="display gtext">Get in the race</h2>
            <p>
              Sign up on {sponsor.name} under code {sponsor.code} and every wager counts toward the
              monthly leaderboard.
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
