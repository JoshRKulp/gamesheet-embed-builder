import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "embed-gamesheet.dev — Gamesheet embed builder",
  description: "Build and preview a Gamesheet stats iframe without writing URL parameters by hand.",
  metadataBase: new URL("https://www.embed-gamesheet.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.embed-gamesheet.dev/",
    siteName: "embed-gamesheet.dev",
    title: "Gamesheet Embed Builder — Generate Stats, Schedule & Standings iFrames",
    description: "Create custom Gamesheet embeds without hand-writing URL parameters.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "embed-gamesheet.dev builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamesheet Embed Builder",
    description: "Create custom Gamesheet embeds without hand-writing URL parameters.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
