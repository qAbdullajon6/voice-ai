"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PLATFORM_FEATURES = [
  {
    title: "Text to Speech",
    description: "Matnni tabiiy ovozga aylantiring. 100+ ovoz, HD sifat.",
    href: "/text-to-speech",
    status: "Live",
  },
  {
    title: "Voice Library",
    description: "Professional ovozlar kutubxonasi — videolar, reklama, kontent uchun.",
    href: "/dashboard/voices",
    status: "Live",
  },
  {
    title: "Studio",
    description: "Ovoz va audio loyihalarni bitta joyda boshqarish.",
    href: "/studio",
    status: "New",
  },
  {
    title: "Audiobooks",
    description: "Uzun matnlarni audiokitob sifatida yaratish.",
    href: "/dashboard/audiobooks",
    status: "New",
  },
  {
    title: "Flows",
    description: "Avtomatlashtirilgan ovoz va agent workflowlar.",
    href: "/dashboard/flows",
    status: "New",
  },
  {
    title: "Dubbing",
    description: "Kontentni boshqa tillarga dublyaj qilish.",
    href: "/dashboard/dubbing",
    status: "Soon",
  },
  {
    title: "Speech to Text",
    description: "Ovozni matnga aylantirish — transkripsiya va subtitrlar.",
    href: "/dashboard/speech-to-text",
    status: "Soon",
  },
  {
    title: "Voice Changer",
    description: "Ovozni real vaqtda o'zgartirish va klonlash.",
    href: "/dashboard/voice-changer",
    status: "Soon",
  },
  {
    title: "Voice Isolator",
    description: "Ovozni shovqindan ajratib olish va tozalash.",
    href: "/dashboard/voice-isolator",
    status: "Soon",
  },
  {
    title: "Sound Effects",
    description: "AI yordamida sound effectlar yaratish.",
    href: "/dashboard/sound-effects",
    status: "Soon",
  },
  {
    title: "Music",
    description: "Musiqa va fon kompozitsiyalari yaratish.",
    href: "/dashboard/music",
    status: "Soon",
  },
  {
    title: "Image & Video",
    description: "Rasmlar va videolar uchun skript va ovoz.",
    href: "/dashboard/image-video",
    status: "Soon",
  },
  {
    title: "Templates",
    description: "Tayyor shablonlar orqali tez boshlash.",
    href: "/dashboard/templates",
    status: "Soon",
  },
  {
    title: "Files",
    description: "Barcha audio va loyihalaringizni boshqarish.",
    href: "/dashboard/files",
    status: "Live",
  },
];

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

const TESTIMONIALS = [
  {
    quote: "Videolarim uchun ovozlarni daqiqalar ichida yarataman. Sifat ajoyib.",
    author: "Sarah M.",
    role: "YouTuber",
    avatar: "SM",
  },
  {
    quote: "Podcast va reklama uchun bitta platforma — vaqt va pul tejaymiz.",
    author: "James K.",
    role: "Content Studio",
    avatar: "JK",
  },
  {
    quote: "API orqali ilovamizga integratsiya qildik. Juda qulay va tez.",
    author: "Alex P.",
    role: "Developer",
    avatar: "AP",
  },
];

const STATS = [
  { value: "50M+", label: "Yaratilgan belgilar" },
  { value: "150+", label: "Ovozlar" },
  { value: "99.9%", label: "Uptime" },
  { value: "<2s", label: "O'rtacha generatsiya" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-b from-[#1a1b1f] via-[#15161a] to-[#0d0e11] text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem]"
        aria-hidden
      />

      {/* Header */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-[#0d0e11]/80 backdrop-blur-md" : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            Voice AI
          </Link>
          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
            >
              Imkoniyatlar
            </a>
            <a
              href="#pricing"
              className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
            >
              Narxlar
            </a>
            <a
              href="#testimonials"
              className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
            >
              Fikrlar
            </a>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Hero */}
        <section className="text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-white">Create</span>{" "}
            <span className="text-gray-400">AI voiceovers in seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Transform your content with AI-powered voiceovers. Perfect for
            videos, podcasts, and more.
          </p>
        </section>

        {/* Hero illustration */}
        <section className="relative mx-auto mt-16 flex justify-center">
          <div className="relative h-[320px] w-full max-w-2xl sm:h-[380px]">
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <svg
                className="absolute h-64 w-64 sm:h-80 sm:w-80"
                viewBox="0 0 320 320"
                fill="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                {[1, 2, 3, 4, 5].map((i) => {
                  const r = i * 24;
                  return (
                    <path
                      key={i}
                      d={`M ${160 - r} 160 A ${r} ${r} 0 0 1 160 ${160 - r} A ${r} ${r} 0 0 1 ${160 + r} 160`}
                      stroke="url(#waveGrad)"
                      strokeWidth="2"
                      strokeOpacity={0.9 - i * 0.15}
                      fill="none"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  );
                })}
              </svg>
              <svg
                className="relative z-10 h-24 w-12 sm:h-28 sm:w-14"
                viewBox="0 0 56 112"
                fill="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="micGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6b7280" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>
                </defs>
                <ellipse cx="28" cy="24" rx="14" ry="18" fill="url(#micGrad)" className="drop-shadow-lg" />
                <rect x="24" y="42" width="8" height="50" rx="4" fill="#374151" />
                <rect x="18" y="92" width="20" height="6" rx="2" fill="#4b5563" />
              </svg>
            </div>
            <div className="absolute right-[12%] top-[35%] sm:right-[15%]">
              <svg viewBox="0 0 80 100" className="h-20 w-16 text-gray-500 sm:h-24 sm:w-20" aria-hidden>
                <circle cx="40" cy="28" r="18" fill="#374151" />
                <path d="M 20 48 Q 40 52 60 48 L 60 70 Q 40 78 20 70 Z" fill="#4b5563" />
                <path d="M 25 48 L 25 42 Q 40 38 55 42 L 55 48" stroke="#6b7280" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="32" cy="26" r="2" fill="#9ca3af" />
                <circle cx="48" cy="26" r="2" fill="#9ca3af" />
              </svg>
            </div>
            <div className="absolute left-[15%] top-[25%] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-lg transition hover:scale-110 hover:border-orange-400/50 hover:bg-orange-500/20 sm:left-[18%]">
              <svg className="ml-1 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <div className="absolute right-[20%] top-[18%] flex gap-0.5 rounded-lg border border-white/20 bg-white/5 px-2 py-2 shadow-lg sm:right-[22%]">
              {[4, 8, 12, 8, 6, 10, 14, 10, 6].map((h, i) => (
                <div key={i} className="w-0.5 rounded-full bg-orange-400/80" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="absolute bottom-[28%] left-[18%] rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              AI
            </div>
            <div className="absolute bottom-[22%] right-[25%] flex gap-1 text-amber-300/90">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Stats / Trust */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/2 py-8">
          <div className="grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 3 feature cards */}
        <section className="mt-20 grid gap-6 sm:grid-cols-3">
          <h2 className="sr-only">Asosiy imkoniyatlar</h2>
          {[
            {
              title: "Voice Cloning",
              description: "O'zingiz yoki boshqalar ovozida maxsus ovozlar yarating.",
              icon: (
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998-0.151A15.75 15.75 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15h7.5" />
                </svg>
              ),
            },
            {
              title: "Text to Speech",
              description: "Matnni sekundlar ichida tabiiy nutqga aylantiring.",
              icon: (
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              ),
            },
            {
              title: "Voice Library",
              description: "100+ professional ovozlar orasidan tanlang.",
              icon: (
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative rounded-2xl border border-white/10 bg-white/2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.15)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
                {card.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{card.description}</p>
            </div>
          ))}
        </section>

        {/* Platform capabilities - full list */}
        <section id="features" className="mt-24">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Platforma nima qila oladi
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
            Matndan nutq, ovoz klonlash, dublyaj, sound effects va boshqa barcha ovoz vositalari bitta joyda.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PLATFORM_FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.status === "Soon" ? "#" : f.href}
                className={[
                  "group rounded-xl border p-5 transition-all duration-200",
                  f.status === "Soon"
                    ? "cursor-not-allowed border-white/10 bg-white/2 opacity-80"
                    : "border-white/10 bg-white/2 hover:-translate-y-0.5 hover:border-orange-500/30 hover:bg-white/5",
                ].join(" ")}
                onClick={(e) => f.status === "Soon" && e.preventDefault()}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      f.status === "Live" || f.status === "New"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-gray-500",
                    ].join(" ")}
                  >
                    {f.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{f.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-24">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Oddiy va shaffof narxlar
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
            O'z ehtiyojingizga mos rejani tanlang. Kredit karta kerak emas — bepul sinab ko'ring.
          </p>
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
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mt-24">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Foydalanuvchilar nima deyadi
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
            Creatorlar va kompaniyalar Voice AI dan qanday foydalanishini o'qing.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border border-white/10 bg-white/2 p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/5"
              >
                <p className="text-gray-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-red-500/30 text-sm font-semibold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-white">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 rounded-2xl border border-orange-500/20 bg-orange-500/5 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Hozir boshlang — bepul
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Kredit karta kiritish shart emas. Bir necha soniyada hisob oching va AI ovozlardan foydalaning.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-10 py-4 text-base font-semibold text-white shadow-lg transition hover:from-orange-400 hover:to-red-400 hover:shadow-orange-500/25"
            >
              Bepul boshlash
            </Link>
            <Link
              href="/dashboard"
              className="inline-block rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Dashboard
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">Kredit karta talab qilinmaydi</p>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-white/10 pt-12">
          <h2 className="sr-only">Footer</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-lg font-bold text-white">
                Voice AI
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                AI asosida ovoz yaratish — Text to Speech, ovoz klonlash, dublyaj va boshqa ovoz vositalari.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Mahsulot</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><Link href="/text-to-speech" className="transition hover:text-white">Text to Speech</Link></li>
                <li><Link href="/dashboard/voices" className="transition hover:text-white">Ovozlar</Link></li>
                <li><Link href="/pricing" className="transition hover:text-white">Narxlar</Link></li>
                <li><Link href="/dashboard" className="transition hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Kompaniya</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><Link href="/enterprise" className="transition hover:text-white">Enterprise</Link></li>
                <li><a href="#" className="transition hover:text-white">Biz haqimizda</a></li>
                <li><a href="#" className="transition hover:text-white">Bog&apos;lanish</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Huquqiy</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><a href="#" className="transition hover:text-white">Maxfiylik</a></li>
                <li><a href="#" className="transition hover:text-white">Foydalanish shartlari</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Voice AI. Barcha huquqlar himoyalangan.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
