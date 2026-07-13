import type { Metadata } from "next";
import "./globals.css";

// Fonts are loaded via a stylesheet <link> in <head> below rather than
// next/font/google, so `next build` doesn't require network access to
// fonts.googleapis.com (handy for sandboxed/offline build environments
// and CI). The browser fetches them normally at runtime. CSS variables
// match what next/font would have produced, with system-font fallbacks
// so the page still looks intentional if the request is blocked.

export const metadata: Metadata = {
  title: "GrowEasy — CSV Import Manifest",
  description:
    "Drop any CSV. GrowEasy reads the manifest, maps every field to your CRM, and stamps each record approved or rejected.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-paper antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
