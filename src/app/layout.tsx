import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TestWaleChaha - Government Exam Mock Tests | SSC, UPSC, Banking, Railways",
  description: "Free online mock tests for SSC CGL, UPSC CSE, IBPS PO, RRB NTPC and more. Real exam interface with question palette, timer, and detailed solutions.",
  keywords: ["mock test", "SSC CGL", "UPSC", "IBPS PO", "RRB NTPC", "online test", "government exam", "MCQ", "quiz", "testwalechaha"],
  icons: { icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
