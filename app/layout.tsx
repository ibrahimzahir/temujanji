import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingHeaderWrapper, LandingFooterWrapper } from "@/components/landing-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Temu Janji — Studio Undangan Pernikahan Digital",
    template: "%s · Temu Janji"
  },
  description:
    "Studio undangan pernikahan digital premium di Indonesia. Desain bernilai seni tinggi, dikerjakan langsung oleh kurator studio untuk merayakan hari bahagia kalian."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
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
