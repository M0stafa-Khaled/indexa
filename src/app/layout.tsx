import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
} from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://indexa-dev.vercel.app",
  ),

  title: {
    default: "Indexa — Organize Your Digital World",
    template: "%s | Indexa",
  },

  description:
    "A hierarchical, authenticated information indexing platform. Store, organize, and retrieve structured bookmarks in a deeply nested tree. Boost your productivity with intelligent organization.",

  keywords: [
    "Indexa",
    "bookmarks",
    "organizer",
    "productivity",
    "hierarchical",
    "information management",
    "bookmark manager",
    "digital organization",
    "nested bookmarks",
    "productivity tool",
    "knowledge management",
  ],

  authors: [{ name: "Mostafa Khaled", url: "https://mostafa-khaled.me" }],
  creator: "Mostafa Khaled",
  publisher: "Mostafa Khaled",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Indexa",
    title: "Indexa — Organize Your Digital World",
    description:
      "A hierarchical, authenticated information indexing platform. Store, organize, and retrieve structured bookmarks in a deeply nested tree.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Indexa - Organize Your Digital World",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Indexa — Organize Your Digital World",
    description:
      "A hierarchical, authenticated information indexing platform. Store, organize, and retrieve structured bookmarks.",
    images: ["/twitter-image"],
    creator: "@indexa",
    site: "@indexa",
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

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },

  manifest: "/manifest.webmanifest",

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    // Add your verification codes here
  },

  alternates: {
    canonical: "/",
  },

  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const websiteSchema = generateWebsiteSchema(baseUrl);
  const organizationSchema = generateOrganizationSchema(baseUrl);
  const webApplicationSchema = generateWebApplicationSchema(baseUrl);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Analytics />

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
