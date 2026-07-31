import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import JsonLd from "@/components/JsonLd";
import SeoContent from "@/components/SeoContent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://test-wale-chacha.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Mock Tests for SSC, UPSC, IBPS, RRB NTPC Online | TestWaleChacha",
    template: "%s | TestWaleChacha",
  },
  description: "Practice free online mock tests for SSC CGL, UPSC CSE, IBPS PO, RRB NTPC, CTET, CDS, NDA and more government exams. Real exam interface with question palette, timer, detailed solutions & performance analytics. 5 free tests on signup.",
  keywords: [
    "mock test", "free mock test online", "SSC CGL mock test", "SSC CHSL mock test", "SSC MTS mock test",
    "UPSC mock test", "UPSC CSE Prelims mock test", "UPSC CSAT mock test",
    "IBPS PO mock test", "IBPS Clerk mock test", "SBI PO mock test",
    "RRB NTPC mock test", "RRB Group D mock test", "Railway exam mock test",
    "State PSC mock test", "CTET mock test", "TET mock test",
    "CDS mock test", "NDA mock test", "online test series",
    "government exam preparation", "free online test",
    "MCQ questions", "GK questions", "current affairs",
    "aptitude questions", "reasoning questions", "quantitative aptitude",
    "English grammar", "testwalechacha", "India exam preparation",
    "free mock test with answers", "mock test online free",
    "government exam mock test free", "SSC CGL free mock test online",
    "IBPS PO free mock test", "UPSC free mock test online",
  ],
  authors: [{ name: "TestWaleChacha", url: SITE_URL }],
  creator: "TestWaleChacha",
  publisher: "TestWaleChacha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TestWaleChacha",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo.png", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "TestWaleChacha",
    title: "Free Mock Tests for SSC, UPSC, IBPS, RRB NTPC | TestWaleChacha",
    description: "Practice free mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC, CTET, CDS. Real exam interface with timer, question palette & detailed solutions. Start now!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestWaleChacha - Free Government Exam Mock Tests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mock Tests for SSC, UPSC, IBPS, RRB | TestWaleChacha",
    description: "Free mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC, CTET, CDS. Real exam interface with timer & solutions.",
    images: ["/og-image.png"],
    creator: "@testwalechacha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleabb88179bbb562dd",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1061914422695539"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <SeoContent />
        {children}
        <ServiceWorkerRegister />
        <JsonLd />
      </body>
    </html>
  );
}
