import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://test-wale-chacha.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TestWaleChacha - Free Government Exam Mock Tests | SSC, UPSC, Banking, Railways",
    template: "%s | TestWaleChacha",
  },
  description: "Practice free online mock tests for SSC CGL, UPSC CSE, IBPS PO, RRB NTPC, State PSC and more. Real exam interface with question palette, timer, detailed solutions. 100+ questions updated daily.",
  keywords: [
    "mock test", "SSC CGL mock test", "SSC CHSL mock test", "UPSC mock test", "UPSC CSE",
    "IBPS PO mock test", "SBI PO mock test", "RRB NTPC mock test", "Railway exam",
    "State PSC mock test", "online test series", "free mock test", "government exam preparation",
    "MCQ questions", "GK questions", "current affairs", "aptitude questions",
    "reasoning questions", "quantitative aptitude", "English grammar",
    "testwalechacha", "free online test", "India exam preparation",
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
    title: "TestWaleChacha - Free Government Exam Mock Tests | SSC, UPSC, Banking",
    description: "Practice 100+ free mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC. Real exam interface with timer, question palette & detailed solutions. Start now!",
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
    title: "TestWaleChacha - Free Government Exam Mock Tests",
    description: "Practice 100+ free mock tests for SSC, UPSC, IBPS, RRB. Real exam interface with timer & solutions.",
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
        {children}
        <ServiceWorkerRegister />
        <JsonLd />
      </body>
    </html>
  );
}
