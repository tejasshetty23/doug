export const Icon = {
  // red + near-black bars, fixed colours so it reads the same on any button
  BarChart: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="2.5" y="13" width="4.2" height="9" rx="1" fill="#12060a" />
      <rect x="9.9" y="7" width="4.2" height="15" rx="1" fill="#e8283f" />
      <rect x="17.3" y="10" width="4.2" height="12" rx="1" fill="#12060a" />
    </svg>
  ),
  Kick: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 2h5.5v6.2L14 2h6.7l-7.4 8.4L21 22h-6.9l-4.4-7-1.2 1.4V22H3V2z" />
    </svg>
  ),
  Twitch: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.3 2 2.5 6.5v14h4.9V24h2.7l2.6-3.5h4L22 16V2H4.3zm15.9 13.2-2.8 3.7h-4.3L10.5 22v-3.1H6.9V4h13.3v11.2z" />
      <path d="M13.2 7.6h1.9v5.6h-1.9zM17.9 7.6h1.9v5.6h-1.9z" />
    </svg>
  ),
  X: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.4 3h6.4l4.4 5.9L17.5 3zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3z" />
    </svg>
  ),
  Discord: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19.3 5.4A16.9 16.9 0 0 0 15.1 4l-.3.6a12.6 12.6 0 0 0-5.6 0L8.9 4a16.9 16.9 0 0 0-4.2 1.4C2 9.5 1.3 13.5 1.6 17.4A17 17 0 0 0 6.8 20l1-1.7a11 11 0 0 1-1.7-.8l.4-.3a12.1 12.1 0 0 0 10.9 0l.4.3a11 11 0 0 1-1.7.8l1 1.7a17 17 0 0 0 5.2-2.6c.4-4.5-.6-8.5-2.7-12zM8.6 15c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1S9.6 15 8.6 15zm6.8 0c-1 0-1.9-.9-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1z" />
    </svg>
  ),
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export function SocialIcon({ name, ...rest }) {
  const C = Icon[name];
  return C ? <C {...rest} /> : null;
}
