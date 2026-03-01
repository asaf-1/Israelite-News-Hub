import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RippleEffect from "@/components/RippleEffect";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Israelite News Hub – Israel & The Jewish World",
  description:
    "Your comprehensive source for Israel news, Middle East coverage, and Jewish world affairs. Live updates from Jerusalem Post, Times of Israel, Haaretz, i24 News, and more.",
  keywords: "israel news, jerusalem, idf, middle east, jewish world, haaretz, times of israel",
};

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo" });
const frankRuhl = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], variable: "--font-frank" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${heebo.variable} ${frankRuhl.variable}`}>
      <body className="font-sans">
        <ScrollProgress />
        <RippleEffect />
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
