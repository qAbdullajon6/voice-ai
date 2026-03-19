import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Voice AI — Matndan nutq, AI ovoz | Text to Speech O'zbekiston | voiceai.uz",
    template: "%s · Voice AI | voiceai.uz",
  },
  description:
    "Voice AI — matnni tabiiy ovozga aylantiring. Text to Speech, ovoz klonlash, 100+ professional ovozlar. Videolar, podcastlar va reklama uchun AI ovoz. O'zbekistonda #1 AI ovoz platformasi. Bepul sinab ko'ring.",
  keywords: [
    "voice ai",
    "voiceai",
    "voiceai.uz",
    "text to speech",
    "matndan nutq",
    "AI ovoz",
    "ovoz yaratish",
    "text to speech O'zbekiston",
    "TTS",
    "speech synthesis",
    "ovoz klonlash",
    "dublyaj",
    "podcast ovoz",
    "video ovoz",
    "AI voice generator",
  ],
  authors: [{ name: "Voice AI", url: SITE_URL }],
  creator: "Voice AI",
  publisher: "Voice AI",
  applicationName: "Voice AI",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: "Voice AI | voiceai.uz",
    title:
      "Voice AI — Matndan nutq, AI ovoz | Text to Speech | voiceai.uz",
    description:
      "Matnni tabiiy ovozga aylantiring. 100+ ovoz, HD sifat. Videolar, podcastlar va reklama uchun AI ovoz. Bepul sinab ko'ring.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Voice AI — AI ovoz va Text to Speech platformasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice AI — Matndan nutq, AI ovoz | voiceai.uz",
    description:
      "Matnni tabiiy ovozga aylantiring. Text to Speech, 100+ ovoz. Bepul sinab ko'ring.",
  },
  category: "technology",
  other: {
    "geo.region": "UZ",
  },
};

function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Voice AI",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        description:
          "AI asosida ovoz yaratish platformasi — Text to Speech, ovoz klonlash, dublyaj. O'zbekiston va dunyo uchun.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Voice AI | voiceai.uz",
        description:
          "Matnni tabiiy ovozga aylantiring. Text to Speech, 100+ professional ovozlar. Bepul sinab ko'ring.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["uz", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", url: `${SITE_URL}/dashboard` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Voice AI",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Text to Speech, ovoz kutubxonasi, ovoz klonlash va dublyaj uchun AI platforma.",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.remove('dark');else{if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}}catch(e){}})();`;

  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
