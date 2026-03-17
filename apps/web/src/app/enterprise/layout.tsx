import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  title: "Enterprise — Voice AI | Biznes uchun",
  description:
    "Voice AI Enterprise: xavfsizlik, SLA, katta hajm. Biznes va korxonalar uchun AI ovoz yechimlari.",
  alternates: { canonical: `${SITE_URL}/enterprise` },
  openGraph: {
    title: "Enterprise · Voice AI",
    url: `${SITE_URL}/enterprise`,
  },
};

export default function EnterpriseLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
