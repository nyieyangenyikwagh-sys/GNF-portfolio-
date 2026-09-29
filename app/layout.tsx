import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./casebook.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = { title: "Ayo Ola — Digital Product Designer", description: "Independent design partner for clear, useful digital products." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={inter.variable}>{children}</body></html>; }
