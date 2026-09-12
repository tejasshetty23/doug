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
              <strong>{sponsor.code}</strong> on {sponsor.name} to enter the monthly race, or just
              chill with the gaming streams when there&apos;s no gambling going on.
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
            Gamble responsibly. Heads up: we&apos;re a {sponsor.name} affiliate, so we get a cut
            when you sign up through our links. None of this is financial advice, and prizes come
            out of our pocket and get paid out at our call. If it stops being fun, take a break
            and reach out to{" "}
            <a href="https://www.gamblingtherapy.org/" target="_blank" rel="noopener noreferrer">
              GamblingTherapy.org
            </a>
            . &copy; {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
