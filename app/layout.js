import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const display = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "dougthegiant — Rewards",
    template: "%s | dougthegiant",
  },
  description:
    "Bonuses, a $500 monthly wager race and every stream in one place. Sign up on Stake.us under code ratmode.",
};

export const viewport = { themeColor: "#05070f" };

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the inline script below adds `js` to this
    // element before React hydrates, which is an intentional mismatch.
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* marks the document as script-capable before first paint, so the
            scroll-reveal styles only ever hide content that JS can reveal */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
