import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/src/providers/QueryProvider";
import { UserProvider } from "@/src/providers/UserProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className="light">
      <head />
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <UserProvider>{children}</UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
