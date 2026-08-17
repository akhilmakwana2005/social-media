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
  title: {
    default: "Antigravity | AI Social Media Manager",
    template: "%s | Antigravity",
  },
  description: "Automate your social media growth with AI-powered content generation, scheduling, and analytics.",
  keywords: ["Social Media Manager", "AI Marketing", "Auto-Pilot Publishing", "Content Strategy"],
  authors: [{ name: "Antigravity Team" }],
  creator: "Antigravity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://antigravity-app.com",
    title: "Antigravity | AI Social Media Manager",
    description: "Automate your social media growth with AI-powered content generation, scheduling, and analytics.",
    siteName: "Antigravity",
    images: [
      {
        url: "https://antigravity-app.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Antigravity Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antigravity | AI Social Media Manager",
    description: "Automate your social media growth with AI-powered content generation, scheduling, and analytics.",
    images: ["https://antigravity-app.com/twitter-image.png"],
    creator: "@antigravity_app",
  },
  metadataBase: new URL("https://antigravity-app.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
