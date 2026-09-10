import Nav from "./Nav";
import Footer from "./Footer";

/**
 * Wraps a page in its colour theme.
 * theme: "theme-red" (home / bg2) or "theme-green" (leaderboard / bg4)
 */
export default function Shell({ theme, children }) {
  return (
    <div className={`shell ${theme}`}>
      {/* topographic texture behind everything the hero art doesn't cover */}
      <div className="topo" aria-hidden="true" />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
