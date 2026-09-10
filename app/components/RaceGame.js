"use client";

import { useEffect, useRef, useState } from "react";
import { DISTANCE, randomSeed, runRace } from "@/app/lib/race";
import KickEntries from "./KickEntries";
import { kick } from "@/app/lib/site";

const TICK_MS = 75;

// track runs between these two x-percentages; the rest is scenery + finish line
const START_X = 3;
const FINISH_X = 86;

// each racer gets a character from the pool, by position
const CHARS = ["🧙", "⚔️", "🐉", "🏹", "🛡️", "💀", "🦇", "🔮", "🐺", "👹", "🗡️", "🦉", "🔥", "🕯️", "🗿"];

const STORE = "doug.kick.settings";

function clock(ms) {
  const m = String(Math.floor(ms / 60000)).padStart(2, "0");
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  const c = String(Math.floor(ms / 10) % 100).padStart(2, "0");
  return `${m}:${s}:${c}`;
}

export default function RaceGame() {
  const [entrants, setEntrants] = useState([]);
  const [keyword, setKeyword] = useState(kick.keyword);
  const [max, setMax] = useState(kick.maxEntrants);
  const [phase, setPhase] = useState("setup"); // setup | running | done
  const [result, setResult] = useState(null);
  const [frame, setFrame] = useState(0);
  const [error, setError] = useState("");
  const [showWin, setShowWin] = useState(false);

  const timer = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  // remember keyword / cap between streams
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (saved?.keyword) setKeyword(saved.keyword);
      if (saved?.max) setMax(saved.max);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ keyword, max }));
    } catch {
      /* storage may be unavailable */
    }
  }, [keyword, max]);

  // while the winner modal is up: trap scroll, close on Escape, move focus to it
  useEffect(() => {
    if (!showWin) return;
    const onKey = (e) => e.key === "Escape" && setShowWin(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    modalRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [showWin]);

  async function start() {
    setError("");
    setShowWin(false);
    if (entrants.length < 2) {
      setError("Need at least two entrants — connect to chat and let people enter.");
      return;
    }

    // fresh random seed every race - nothing carries over from the last one
    const r = await runRace(randomSeed(), entrants);
    setResult({ ...r, racers: entrants });
    setFrame(0);
    setPhase("running");

    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setFrame((f) => {
        if (f >= r.frames.length - 1) {
          clearInterval(timer.current);
          setPhase("done");
          setShowWin(true);
          return f;
        }
        return f + 1;
      });
    }, TICK_MS);
  }

  function reset() {
    clearInterval(timer.current);
    setShowWin(false);
    setResult(null);
    setFrame(0);
    setPhase("setup");
  }

  const positions = result ? result.frames[Math.min(frame, result.frames.length - 1)] : null;

  return (
    <div className="race">
      {/* ---------------- setup ---------------- */}
      {phase === "setup" && (
        <div className="card race-setup">
            <div className="race-grid">
              <label className="fld">
                <span className="fld-l">Keyword</span>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="!enter"
                  spellCheck={false}
                />
                <span className="fld-h">
                  Chatters type this exactly to enter — nothing else counts.
                </span>
              </label>

              <label className="fld">
                <span className="fld-l">Max entrants</span>
                <input
                  type="number"
                  min={2}
                  max={100}
                  value={max}
                  onChange={(e) => setMax(Math.max(2, Math.min(100, +e.target.value || 2)))}
                />
              </label>

            </div>

            <KickEntries keyword={keyword} max={max} onChange={setEntrants} />

            {error && <p className="race-err">{error}</p>}

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={start} disabled={entrants.length < 2}>
                Start the race
              </button>
            </div>
        </div>
      )}

      {/* ---------------- the arena ---------------- */}
      {phase !== "setup" && result && (
        <div className="card arena-card">
          <div className="arena-bar">
            <div className="arena-btns">
              <button className="arena-btn" onClick={start}>
                {phase === "running" ? "Restart" : "Start"}
              </button>
              <button className="arena-btn" onClick={reset}>
                Clear
              </button>
            </div>
            <span className="arena-clock">{clock(frame * TICK_MS)}</span>
          </div>

          <div
            className="arena"
            style={{ "--lanes": result.racers.length }}
            aria-label="Race track"
          >
            <div className="arena-sky" />
            <div className="arena-ground" />
            <div className="finish" />

            {result.racers.map((name, i) => {
              const pct = Math.min(100, (positions[i] / DISTANCE) * 100);
              const x = START_X + (pct / 100) * (FINISH_X - START_X);
              const place = result.order.indexOf(i);
              const won = phase === "done" && place === 0;
              return (
                <div
                  className={`racer ${won ? "racer-win" : ""}`}
                  key={name}
                  style={{
                    left: `${x}%`,
                    top: `calc(${(i + 0.5)} * (100% / var(--lanes)))`,
                    transitionDuration: `${TICK_MS}ms`,
                    zIndex: won ? 30 : 10 + (place > -1 ? result.racers.length - place : 0),
                  }}
                >
                  <span className="racer-tag">
                    {phase === "done" && place > -1 && (
                      <span className="racer-place">{place + 1}</span>
                    )}
                    {name}
                  </span>
                  <span className="racer-char" aria-hidden="true">
                    {CHARS[i % CHARS.length]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- result actions ---------------- */}
      {phase === "done" && result && (
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={start}>
            Race again
          </button>
          <button className="btn btn-ghost" onClick={() => setShowWin(true)}>
            Show winner
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            Edit entrants
          </button>
        </div>
      )}

      {/* ---------------- winner popup ---------------- */}
      {showWin && result && (
        <div className="modal-back" onClick={() => setShowWin(false)} role="presentation">
          <div
            className="card win win-solo modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Winner: ${result.ranking[0]}`}
            tabIndex={-1}
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-x" onClick={() => setShowWin(false)} aria-label="Close">
              &times;
            </button>

            <span className="win-place">Winner</span>
            <span className="win-name gtext">{result.ranking[0]}</span>

            <div className="hero-actions modal-actions">
              <button className="btn btn-primary" onClick={start}>
                Race again
              </button>
              <button className="btn btn-ghost" onClick={() => setShowWin(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
