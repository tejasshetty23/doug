import { fmtMoney } from "@/app/lib/leaderboard";
import { Reveal } from "./Bits";

const CLASS = { 1: "p-1", 2: "p-2", 3: "p-3" };

/** `bounce` gives the frames a gentle idle float (home page only). */
export default function Podium({ rows, bounce = false }) {
  return (
    <div className={`podium ${bounce ? "podium-bounce" : ""}`}>
      {rows.slice(0, 3).map((r, i) => (
        <Reveal key={r.rank} className={`p-item ${CLASS[r.rank]}`} delay={i * 90}>
          <div className="medal">{r.rank}</div>
          <div className="p-user">{r.username}</div>
          <div className="p-wager">{fmtMoney(r.wagered)} wagered</div>
          <div className="p-prize gtext">{fmtMoney(r.prize)}</div>
        </Reveal>
      ))}
    </div>
  );
}
