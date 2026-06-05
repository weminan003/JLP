import type { Metadata } from "next";
import { Outfit, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: {
    default: "Jesus Love and Power Ministries",
    template: "%s | JLP Ministries",
  },
  description:
    "Jesus Love and Power Ministries — gathering and equipping a generation of teenagers who know His love, walk in His power, and carry revival into their schools, homes, and nations.",
  keywords: [
    "JLP",
    "Jesus Love and Power",
    "JLP Ministries",
    "youth ministry",
    "teens church",
    "revival",
    "Supernatural Teens Recharge",
    "Christian teenagers",
    "Nigeria ministry",
  ],
  metadataBase: new URL("https://jlpministries.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://jlpministries.com",
    siteName: "Jesus Love and Power Ministries",
    title: "Jesus Love and Power Ministries",
    description:
      "A generation on fire for Jesus. Monthly worship, prayer and encounter for teenagers across Nigeria.",
    images: [
      {
        url: "/hero/jlp-hero.png",
        width: 1200,
        height: 630,
        alt: "Jesus Love and Power Ministries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Love and Power Ministries",
    description:
      "A generation on fire for Jesus. Monthly worship, prayer and encounter for teenagers across Nigeria.",
    images: ["/hero/jlp-hero.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${robotoCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
