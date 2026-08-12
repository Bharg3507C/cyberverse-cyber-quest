import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00f0ff",
};

export const metadata: Metadata = {
  title: "CYBERVERSE | Explore The Digital World",
  description: "An interactive 3D cybersecurity learning experience. Explore the digital world. Understand the threats. Defend the future.",
  keywords: ["cybersecurity", "interactive", "3D", "learning", "education", "cyber", "security", "phishing", "privacy", "IoT"],
  authors: [{ name: "CYBERVERSE" }],
  openGraph: {
    title: "CYBERVERSE — Interactive 3D Cybersecurity Experience",
    description: "Explore a futuristic digital city and learn cybersecurity through immersive 3D simulations.",
    type: "website",
    locale: "en_US",
    siteName: "CYBERVERSE",
  },
  twitter: {
    card: "summary_large_image",
    title: "CYBERVERSE — Interactive 3D Cybersecurity Experience",
    description: "Explore a futuristic digital city and learn cybersecurity through immersive 3D simulations.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
