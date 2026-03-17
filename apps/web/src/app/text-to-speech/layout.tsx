import type { Metadata } from "next";
import { AppLayout } from "../../components/app/app-layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  title: "Text to Speech — Matndan nutq | Voice AI",
  description:
    "Matnni tabiiy ovozga aylantiring. 100+ professional ovoz, HD sifat. Videolar, podcastlar va reklama uchun. Bepul sinab ko'ring.",
  alternates: { canonical: `${SITE_URL}/text-to-speech` },
  openGraph: {
    title: "Text to Speech · Voice AI | voiceai.uz",
    description: "Matnni tabiiy ovozga aylantiring. 100+ ovoz.",
    url: `${SITE_URL}/text-to-speech`,
  },
};

export default function TextToSpeechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}