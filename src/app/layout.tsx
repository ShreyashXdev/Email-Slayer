import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inbox Slayer ⚔️ — Gamified Email Productivity",
  description: "Clean out your email inbox by playing a 2D catch-and-shoot falling-object game. Kill or capture email monsters!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scanlines antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
