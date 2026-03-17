import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  description:
    "Voice AI da hisob yarating. Matndan nutq, 100+ ovoz — bepul sinab ko'ring. Kredit karta kerak emas.",
  alternates: { canonical: `${SITE_URL}/register` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Ro'yxatdan o'tish · Voice AI",
    url: `${SITE_URL}/register`,
  },
};

export default function RegisterLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
