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
  title: "QuizMaster - MCQ Practice Platform | Free Tests & Unlimited Practice",
  description:
    "Practice thousands of MCQ questions across 8+ categories including Science, Math, GK, History, English, Computer Science and more. First 5 tests free, then ₹100 for unlimited access.",
  keywords: [
    "MCQ",
    "quiz",
    "practice test",
    "online test",
    "exam preparation",
    "GK questions",
    "science quiz",
    "math quiz",
    "competitive exam",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
