import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Warrior's Ledger",
  description: "Chronicles of a warrior turning life's battles into a daily journal.",
  openGraph: {
    title: "The Warrior's Ledger",
    description: "Chronicles of a warrior turning life's battles into a daily journal.",
    url: 'https://ceffblog.com',
    siteName: 'Ceffblog',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
