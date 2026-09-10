"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- scroll reveal ---------- */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div", style, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- ambient floating sparks (fixed seed = no hydration drift) ---------- */
const SPARKS = [
  [6, 12, 9, 0], [14, 62, 11, 1.4], [23, 28, 8, 2.9], [31, 78, 12, 0.7],
  [39, 44, 10, 3.6], [47, 18, 13, 2.1], [55, 70, 9, 4.3], [63, 34, 11, 1.1],
  [71, 84, 8, 3.2], [79, 22, 12, 0.4], [87, 58, 10, 2.5], [94, 40, 9, 4.8],
];

export function Sparks() {
  return (
    <div className="sparks" aria-hidden="true">
      {SPARKS.map(([left, top, dur, delay], i) => (
        <span
          key={i}
          className="spark"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
            transform: `scale(${i % 3 === 0 ? 1.4 : 1})`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- click-to-copy code chip ---------- */
export function CopyCode({ code, className = "codemini" }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked - still show feedback */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }

  return (
    <button type="button" className={className} onClick={copy} title="Copy code">
      {done ? "COPIED" : `CODE: ${code}`}
    </button>
  );
}

/* ---------- monthly countdown ---------- */
function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ endsAt }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const tick = () => setLeft(parts(endsAt - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const cells = [
    ["Days", left?.d],
    ["Hours", left?.h],
    ["Mins", left?.m],
    ["Secs", left?.s],
  ];

  return (
    <div className="count">
      {cells.map(([label, v]) => (
        <div key={label} className="cbox">
          {/* dashes until mounted so server and client markup agree */}
          <div className="cnum gtext">{v === undefined ? "--" : String(v).padStart(2, "0")}</div>
          <div className="clab">{label}</div>
        </div>
      ))}
    </div>
  );
}
