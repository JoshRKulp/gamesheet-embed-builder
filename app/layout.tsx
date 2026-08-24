import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmbedKit — Gamesheet embed builder",
  description: "Build and preview a Gamesheet stats iframe without writing URL parameters by hand.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
