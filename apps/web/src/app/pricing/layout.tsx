import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  title: "Narxlar — Voice AI | Text to Speech rejalar",
  description:
    "Voice AI narxlari: Starter $5, Creator $22, Business $330. Matndan nutq, HD ovozlar, kommersiya litsenziyasi. Bepul sinab ko'ring. Kredit karta kerak emas.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Narxlar · Voice AI | voiceai.uz",
    description:
      "Voice AI rejalari — Text to Speech uchun narxlar. Bepul trial.",
    url: `${SITE_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
