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
  metadataBase: new URL('https://viewer-3d.vercel.app'),
  title: {
    default: "3D Image Viewer | Dream Design Architects Tools",
    template: "%s | Dream Design Architects Tools"
  },
  description: "Create and share immersive 360° panoramic views. Perfect for architects, real estate professionals, and virtual tour creators.",
  keywords: ["360 viewer", "panorama viewer", "virtual tour", "3D image", "architectural visualization", "real estate", "immersive view"],
  authors: [{ name: "Dream Design Architects" }],
  creator: "Dream Design Architects",
  publisher: "Dream Design Architects",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "3D Viewer | Dream Design Architects Tools",
    description: "Create and share immersive 360° panoramic views",
    url: 'https://viewer-3d.vercel.app',
    siteName: 'Dream Design Architects Tools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '3D Image Viewer Preview'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "3D Viewer | Dream Design Architects Tools",
    description: "Create and share immersive 360° panoramic views",
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
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
        <link rel="canonical" href="https://3d-view.vercel.app" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "3D Image Viewer",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Dream Design Architects"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}