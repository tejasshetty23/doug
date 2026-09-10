"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { kick } from "@/app/lib/site";

// Kick's own frontend talks to chat over Pusher. These are the public
// parameters its web client uses, so the browser can subscribe directly and no
// server is needed anywhere in the loop.
const WS_URL =
  "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false";
const CHAT_EVENT = "App\\Events\\ChatMessageEvent";

const LABEL = {
  idle: "Not connected",
  resolving: "Finding channel…",
  connecting: "Connecting…",
  live: "Listening to chat",
  full: "Entries full",
  closed: "Disconnected",
  error: "Connection lost",
};

/** Accepts a chatroom ID, a slug, or a full kick.com URL. */
async function resolveChatroom(input) {
  const v = String(input)
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?kick\.com\//i, "")
    .replace(/\/.*$/, "");

  if (!v) return { error: "No Kick channel configured." };
  if (/^\d+$/.test(v)) return { id: v };

  // Kick's channel endpoint sits behind Cloudflare and sends no CORS headers,
  // so this usually fails from a browser. Worth trying, with a clear fallback.
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(v)}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const j = await res.json();
    const id = j?.chatroom?.id;
    if (!id) throw new Error("no chatroom id in response");
    return { id: String(id) };
  } catch {
    return {
      error: `Can't resolve the channel from the browser — Kick's lookup endpoint is behind Cloudflare and sends no CORS headers. Open kick.com/api/v2/channels/${v} in a normal browser tab, find "chatroom":{"id":…} and paste that number into kick.chatroomId in app/lib/site.js. It only needs doing once.`,
    };
  }
}

export default function KickEntries({ keyword, max, onChange }) {
  const [status, setStatus] = useState("idle");
  const [entries, setEntries] = useState([]);
  const [seen, setSeen] = useState(0);
  const [note, setNote] = useState("");

  const ws = useRef(null);
  const retry = useRef(null);

  // refs so the long-lived socket handler always sees current settings
  const cfg = useRef({ keyword, max });
  cfg.current = { keyword, max };
  const report = useRef(onChange);
  report.current = onChange;

  // hand the entrant list up to the race whenever it changes
  useEffect(() => {
    report.current(entries.map((e) => e.user));
  }, [entries]);

  const close = useCallback(() => {
    clearTimeout(retry.current);
    if (ws.current) {
      ws.current.onclose = null;
      ws.current.close();
      ws.current = null;
    }
  }, []);

  useEffect(() => close, [close]);

  const openSocket = useCallback(
    (chatroomId) => {
      close();
      setStatus("connecting");

      const sock = new WebSocket(WS_URL);
      ws.current = sock;

      sock.onopen = () =>
        sock.send(
          JSON.stringify({
            event: "pusher:subscribe",
            data: { auth: "", channel: `chatrooms.${chatroomId}.v2` },
          })
        );

      sock.onmessage = (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.data);
        } catch {
          return;
        }

        if (msg.event === "pusher:ping") {
          sock.send(JSON.stringify({ event: "pusher:pong", data: {} }));
          return;
        }
        if (msg.event === "pusher_internal:subscription_succeeded") {
          setStatus("live");
          return;
        }
        if (msg.event !== CHAT_EVENT) return;

        let body;
        try {
          body = typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;
        } catch {
          return;
        }

        const user = body?.sender?.username;
        const text = String(body?.content ?? "").trim();
        if (!user || !text) return;

        setSeen((n) => n + 1);

        const kw = String(cfg.current.keyword || "").trim().toLowerCase();
        if (!kw || text.toLowerCase() !== kw) return;

        setEntries((prev) => {
          if (prev.length >= cfg.current.max) return prev;
          if (prev.some((e) => e.user.toLowerCase() === user.toLowerCase())) return prev;
          const next = [...prev, { user }];
          if (next.length >= cfg.current.max) {
            setStatus("full");
            close();
          }
          return next;
        });
      };

      sock.onclose = () =>
        setStatus((s) => {
          if (s === "full" || s === "closed") return s;
          retry.current = setTimeout(() => openSocket(chatroomId), 2500);
          return "error";
        });

      sock.onerror = () => sock.close();
    },
    [close]
  );

  async function connect() {
    setNote("");
    setStatus("resolving");

    // the channel never changes, so it lives in config rather than on screen
    const r = await resolveChatroom(kick.chatroomId || kick.slug);
    if (r.error) {
      setNote(r.error);
      setStatus("idle");
      return;
    }
    openSocket(r.id);
  }

  function disconnect() {
    close();
    setStatus("closed");
  }

  function clear() {
    setEntries([]);
    setSeen(0);
    if (status === "full") setStatus("closed");
  }

  const busy = status === "resolving" || status === "connecting";
  const connected = busy || status === "live";
  const pct = Math.min(100, (entries.length / Math.max(1, max)) * 100);

  return (
    <div className="kick">
      <div className="kick-head">
        <span className={`kick-dot k-${status}`} />
        <span className="eyebrow">Kick chat entries</span>
        <span className="kick-status">{LABEL[status]}</span>
        <span className="kick-count">
          {entries.length}/{max}
        </span>
      </div>

      <div className="kick-bar">
        <div className="kick-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="kick-list">
        {entries.length === 0 && (
          <li className="kick-empty">
            {status === "live"
              ? `Waiting for chat to type ${keyword}…`
              : "Connect to chat to start collecting entries."}
          </li>
        )}
        {entries.map((e, i) => (
          <li key={e.user}>
            <span className="kick-n">{i + 1}</span>
            {e.user}
          </li>
        ))}
      </ul>

      <div className="hero-actions kick-actions">
        {connected ? (
          <button className="btn btn-ghost btn-sm" onClick={disconnect}>
            Disconnect
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={connect} disabled={busy}>
            {status === "closed" || status === "full" ? "Reconnect" : "Connect to chat"}
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={clear} disabled={!entries.length}>
          Clear entries
        </button>
        {seen > 0 && (
          <span className="kick-seen">
            {seen} chat message{seen === 1 ? "" : "s"} seen
          </span>
        )}
      </div>

      {note && <p className="kick-note">{note}</p>}
    </div>
  );
}
