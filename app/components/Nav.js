"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, sponsor, nav } from "@/app/lib/site";

export default function Nav() {
  const path = usePathname();

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="brand">
          {site.name}
        </Link>

        <nav className="nav-links">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? "active" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <a
            className="btn btn-primary btn-sm"
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Claim Bonus
          </a>
        </div>
      </div>
    </header>
  );
}
