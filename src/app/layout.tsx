import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DingyChat - Real-time Chat Application",
  description:
    "Connect and chat with friends in real-time. Create custom rooms, share messages, and stay connected.",
  keywords: ["chat", "real-time", "messaging", "communication"],
  authors: [{ name: "DingyChat Team aka Dungy" }],
  openGraph: {
    title: "DingyChat - Real-time Chat",
    description: "Connect and chat with friends in real-time",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
        suppressHydrationWarning
      >
        <div className="h-full">{children}</div>
      </body>
    </html>
  );
}
