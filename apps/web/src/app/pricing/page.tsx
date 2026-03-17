"use client";

import Link from "next/link";
import { LandingPageShell, LandingFooter } from "../../components/marketing/landing-layout";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$5",
    period: "/month",
    desc: "Voice AI ni sinab ko'rish uchun",
    cta: "Start free trial",
    href: "/register",
    features: ["10k belgi/oy", "Standart sifat", "Community support"],
    popular: false,
  },
  {
    name: "Creator",
    price: "$22",
    period: "/month",
    desc: "Kontent yaratuvchilar va kichik jamoalar uchun",
    cta: "Start free trial",
    href: "/register",
    popular: true,
    features: [
      "100k belgi/oy",
      "HD sifat",
      "Prioritet generatsiya",
      "Kommersiya litsenziyasi",
    ],
  },
  {
    name: "Business",
    price: "$330",
    period: "/month",
    desc: "Biznes va katta hajmlar uchun",
    cta: "Contact sales",
    href: "/enterprise",
    features: ["1M belgi/oy", "Ultra HD", "SLA", "Xavfsizlik boshqaruvi"],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <LandingPageShell simpleHeader>
      <main className="relative mx-auto max-w-6xl px-6 pt-28 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Oddiy va shaffof narxlar
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            O&apos;z ehtiyojingizga mos rejani tanlang. Kredit karta kerak emas —
            bepul sinab ko&apos;ring.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((p) => (
            <div
              key={p.name}
              className={[
                "relative rounded-2xl border p-6 transition-all duration-200 hover:border-white/20",
                p.popular
                  ? "border-orange-500/40 bg-orange-500/5"
                  : "border-white/10 bg-white/2",
              ].join(" ")}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-linear-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-semibold text-white">
                    Eng mashhur
                  </span>
                </div>
              )}
              <div className="font-semibold text-white">{p.name}</div>
              <div className="mt-1 text-sm text-gray-500">{p.desc}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-gray-500">{p.period}</span>
              </div>
              <Link
                href={p.href}
                className={[
                  "mt-6 block rounded-xl py-3 text-center text-sm font-semibold transition",
                  p.popular
                    ? "bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-400 hover:to-red-400"
                    : "border border-white/20 text-white hover:bg-white/10",
                ].join(" ")}
              >
                {p.cta}
              </Link>
              <ul className="mt-6 space-y-2 text-sm text-gray-400">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400/80" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <LandingFooter />
      </main>
    </LandingPageShell>
  );
}
