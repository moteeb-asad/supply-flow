import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import QueryProvider from "@/src/providers/QueryProvider";

// Fonts are self-hosted (src/assets/fonts, latin subset, SIL OFL) so builds
// never depend on fetching from Google Fonts.

// UI and headings. Only these three weights are used.
const plexSans = localFont({
  variable: "--font-plex-sans",
  src: [
    {
      path: "../src/assets/fonts/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/assets/fonts/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../src/assets/fonts/ibm-plex-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

// PO, SKU and delivery note codes only (font-mono).
const plexMono = localFont({
  variable: "--font-plex-mono",
  src: [
    {
      path: "../src/assets/fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/assets/fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "SupplyFlow - Warehouse Management",
  description:
    "Optimize your warehouse operations with SupplyFlow, the ultimate management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables go on <html> so the theme tokens in globals.css
    // (--font-sans, --font-mono) can resolve them at :root.
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} light`}
    >
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
