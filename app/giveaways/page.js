import Image from "next/image";
import Shell from "../components/Shell";
import RaceGame from "../components/RaceGame";
import { Reveal, Sparks } from "../components/Bits";
import { sponsor } from "../lib/site";
import heroArt from "@/public/bg1.png";

export const metadata = {
  title: "Giveaways",
  description: "Dungeon crawl giveaway races. Viewers enter from Kick chat with a keyword, one winner takes the prize.",
};

export default function Giveaways() {
  return (
    <Shell theme="theme-blue">
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
            Live giveaways
          </span>

          <h1 className="display">
            <span className="main gtext">GIVEAWAY</span>
            <span className="sub gtext">RACES</span>
          </h1>
        </div>
      </section>

      {/* ================= THE RACE ================= */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">Run a race</span>
            <h2 className="display gtext">Dungeon crawl</h2>
          </div>

          <RaceGame />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="shead">
            <span className="eyebrow">How it works</span>
            <h2 className="display gtext">Three steps</h2>
          </div>

          <div className="steps">
            {[
              {
                t: "Open entries",
                d: "Connect to Kick chat and set the keyword. The first viewers to type it are in, up to the cap, one entry each.",
              },
              {
                t: "Run it live",
                d: "Hit start and let the dungeon crawl play out on stream. Roughly fifteen seconds of racing with the order swapping the whole way.",
              },
              {
                t: "Pay the winner",
                d: "One winner takes the prize. Screenshot the result, then race again for the next giveaway.",
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

      {/* ================= CTA ================= */}
      <section className="section">
        <div className="wrap">
          <Reveal className="card band">
            <span className="eyebrow">Want in?</span>
            <h2 className="display gtext">Enter the next one</h2>
            <p>
              Giveaways get announced on stream and in Discord. Sign up under code {sponsor.code} to
              qualify for the wager-based draws.
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
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}
