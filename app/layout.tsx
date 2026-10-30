import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/src/providers/QueryProvider";

// UI and headings. Only these three weights are used.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// PO, SKU and delivery note codes only (font-mono).
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
