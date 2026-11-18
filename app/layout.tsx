import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingHeaderWrapper, LandingFooterWrapper } from "@/components/landing-chrome";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temujanji.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Temu Janji — Studio Undangan Pernikahan Digital Indonesia",
    template: "%s · Temu Janji",
  },
  description:
    "Studio undangan pernikahan digital premium di Indonesia. Desain botani bernilai seni tinggi, tautan nama tamu tak terbatas, RSVP real-time, dan kurasi done-for-you.",
  keywords: [
    "undangan pernikahan digital",
    "undangan digital indonesia",
    "website undangan pernikahan",
    "temu janji studio",
    "rsvp undangan online",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Temu Janji Studio",
    title: "Temu Janji — Studio Undangan Pernikahan Digital Indonesia",
    description:
      "Undangan pernikahan digital bernuansa hangat dan intim dengan kurasi done-for-you dan tautan nama tamu personal.",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Temu Janji Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Temu Janji — Studio Undangan Pernikahan Digital",
    description:
      "Undangan pernikahan digital premium dengan RSVP real-time dan kurasi studio.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Temu Janji Studio",
    url: SITE_URL,
    description:
      "Studio undangan pernikahan digital premium di Indonesia dengan layanan kurasi done-for-you.",
    areaServed: "ID",
  };

  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <TooltipProvider>
          <LandingHeaderWrapper />

          <main>{children}</main>

          <LandingFooterWrapper />
        </TooltipProvider>
      </body>
    </html>
  );
}
