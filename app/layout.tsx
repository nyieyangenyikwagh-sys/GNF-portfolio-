import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./casebook.css";
import { portfolio } from "@/data/portfolio";
import { webUrl } from "@/lib/seo";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const images = webUrl(portfolio.seo.ogImage)
  ? [portfolio.seo.ogImage]
  : undefined;
export const metadata: Metadata = {
  title: portfolio.seo.title,
  description: portfolio.seo.description,
  openGraph: {
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    type: "website",
    ...(images ? { images } : {}),
  },
  twitter: {
    card: images ? "summary_large_image" : "summary",
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    ...(images ? { images } : {}),
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
