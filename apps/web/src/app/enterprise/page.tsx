"use client";

import Link from "next/link";
import { LandingPageShell, LandingFooter } from "../../components/marketing/landing-layout";

export default function EnterprisePage() {
  return (
    <LandingPageShell simpleHeader>
      <main className="relative mx-auto max-w-6xl px-6 pt-28 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Enterprise Voice AI
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              Katta jamoalar uchun xavfsizlik, ishonchlilik va boshqaruv. Text to
              Speech hozir, keyinroq qo‘shimcha ovoz vositalari.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Xavfsizlik",
                  desc: "Shifrlash, kirish boshqaruvi, audit.",
                },
                {
                  title: "Ishonchlilik",
                  desc: "Uptime, monitoring, SLA qo‘llab-quvvatlash.",
                },
                {
                  title: "Boshqaruv",
                  desc: "Guardrails, moderation, provenance.",
                },
                {
                  title: "Workflow",
                  desc: "Integratsiyalar va maxsus pipeline.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/2 p-6"
                >
                  <div className="text-sm font-semibold text-white">
                    {f.title}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/2 p-8">
            <div className="text-sm font-semibold text-white">
              Savdo bilan bog‘lanish
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enterprise taklif uchun quyidagi formani to‘ldiring yoki biz bilan
              bog‘laning.
            </p>
            <div className="mt-6 space-y-3">
              <input
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Ish email"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Kompaniya"
              />
              <textarea
                className="min-h-28 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Nima qurmoqchisiz?"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-orange-400 hover:to-red-400"
              >
                So‘rov yuborish
              </button>
              <p className="text-xs text-gray-500">
                Hozir sinab ko‘rmoqchimisiz?{" "}
                <Link
                  className="text-orange-400 transition hover:text-orange-300"
                  href="/text-to-speech"
                >
                  Text to Speech
                </Link>
              </p>
            </div>
          </div>
        </div>

        <LandingFooter />
      </main>
    </LandingPageShell>
  );
}
