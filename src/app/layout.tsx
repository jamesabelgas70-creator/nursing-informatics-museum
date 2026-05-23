import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evolution of Nursing Informatics | BSN2A",
  description:
    "A cinematic 3D timeline exhibit tracing nursing informatics from early computer use to AI-assisted healthcare.",
  keywords: [
    "Nursing Informatics",
    "Healthcare Technology",
    "BSN2A",
    "NCM 110",
    "Nursing Timeline",
    "Digital Health"
  ],
  openGraph: {
    title: "Evolution of Nursing Informatics",
    description: "From Traditional Care to Smart Healthcare.",
    type: "website"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0800"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
