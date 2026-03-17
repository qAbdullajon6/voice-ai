import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceai.uz";

export const metadata: Metadata = {
  title: "Tizimga kirish",
  description:
    "Voice AI hisobingizga kiring. Matndan nutq va AI ovoz vositalaridan foydalaning.",
  alternates: { canonical: `${SITE_URL}/login` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Tizimga kirish · Voice AI",
    url: `${SITE_URL}/login`,
  },
};

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
