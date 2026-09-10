import Link from "next/link";
import { site, socials, sponsor, nav } from "@/app/lib/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-brand">{site.name}</div>
            <p>
              Leaderboards, bonuses and every stream in one place. Sign up under code{" "}
              <strong>{sponsor.code}</strong> on {sponsor.name} to enter the monthly race.
            </p>
          </div>

          <div>
            <h5>Site</h5>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                  {sponsor.name}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5>Socials</h5>
            <ul>
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-bot">
          <span className="age">18+</span>
          <p>
            Gamble responsibly. This site is an affiliate of {sponsor.name} and may earn a
            commission on sign-ups made through its links. Nothing here is financial advice, and
            prizes are funded and paid at the streamer&apos;s discretion. If gambling stops being
            fun, get support at{" "}
            <a href="https://www.gamblingtherapy.org/" target="_blank" rel="noopener noreferrer">
              GamblingTherapy.org
            </a>
            . &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
