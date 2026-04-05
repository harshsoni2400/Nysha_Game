import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SessionProvider } from "@/context/SessionContext";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BrainSpark - Learn Something New Every Day!",
  description: "A fun daily learning app for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-screen font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
