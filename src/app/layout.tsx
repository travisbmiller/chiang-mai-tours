import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import { ClientBody } from "./ClientBody";
import { dmSerifDisplay, dmSans } from "@/lib/fonts";
import { MantineProvider } from '@mantine/core';

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chiang Mai Tours - Doi Suthep: The Golden Temple",
  description: "Visit Doi Suthep, the Golden Temple, with our private tour from Chiang Mai. Experience the holiest shrine in Northern Thailand, Hmong villages, and Bhubing Palace.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preconnect to image CDN for faster loading */}
        <link rel="preconnect" href="https://ext.same-assets.com" />
        <link rel="dns-prefetch" href="https://ext.same-assets.com" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://media.cnn.com" />

        {/* Preload LCP image for faster initial paint */}
        <link
          rel="preload"
          as="image"
          href="https://media.cnn.com/api/v1/images/stellar/prod/180717130655-03-where-to-go-january-thailand.jpg"
          fetchPriority="high"
        />

        {/* Mobile debugging console - Eruda */}
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script dangerouslySetInnerHTML={{ __html: `eruda.init();` }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${dmSans.variable} antialiased`}>
        <MantineProvider>
          <ClientBody>
            {children}
          </ClientBody>
        </MantineProvider>
      </body>
    </html>
  );
}
