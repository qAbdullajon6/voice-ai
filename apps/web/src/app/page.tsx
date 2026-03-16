"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-[#0a0b0d] via-[#0f1117] to-[#0a0b0d] text-white">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-200 w-200 -translate-x-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),rgba(11,13,16,0))] blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-150 w-150 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),rgba(11,13,16,0))] blur-3xl delay-1000" />
        <div className="absolute left-[10%] bottom-[-20%] h-[700px] w-[700px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1),rgba(11,13,16,0))] blur-3xl delay-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0b0d]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
              VoiceAI
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a
              className="text-gray-400 transition hover:text-white"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-gray-400 transition hover:text-white"
              href="#voices"
            >
              Voices
            </a>
            <a
              className="text-gray-400 transition hover:text-white"
              href="#pricing"
            >
              Pricing
            </a>
            <Link
              className="text-gray-400 transition hover:text-white"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/5"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:from-violet-500 hover:to-purple-500"
              href="/register"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-32 px-6 py-24 pt-32">
        {/* Hero Section */}
        <section className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
              </span>
              AI-Powered Voice Generation
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Create{" "}
              <span className="bg-linear-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                lifelike
              </span>{" "}
              voices in seconds
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-400">
              Transform text into natural-sounding speech with our advanced AI.
              Perfect for content creators, developers, and businesses looking
              for studio-quality voice generation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                className="group relative overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white transition hover:from-violet-500 hover:to-purple-500"
                href="/dashboard"
              >
                <span className="relative z-10">Try Dashboard for free</span>
                <div className="absolute inset-0 -z-0 bg-linear-to-r from-violet-400 to-purple-400 opacity-0 transition group-hover:opacity-100" />
              </Link>
              <a
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-base font-semibold text-gray-200 transition hover:border-white/20 hover:bg-white/5"
                href="#demo"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch demo
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">Free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-violet-600/20 to-purple-600/20 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-linear-to-br from-gray-900/90 to-gray-950/90 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  Live Preview
                </span>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-6">
                  <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-gray-400">
                    Text Input
                  </label>
                  <p className="text-sm leading-relaxed text-gray-300">
                    "Welcome to the future of voice generation. Create
                    professional audio content with just a few clicks."
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Voice
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600" />
                      <span className="text-sm font-medium text-white">
                        Aria Neural
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Quality
                    </div>
                    <div className="text-sm font-medium text-white">
                      HD • 24kHz
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/30 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Audio Output
                    </span>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                      Ready
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full w-3/4 bg-linear-to-r from-violet-600 to-purple-600" />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0:08</span>
                        <span>0:12</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[24, 18, 30, 12, 28, 16, 22, 34, 14, 26, 20, 32, 10, 27, 19, 31, 15, 29, 21, 33, 13, 25, 17, 30, 12, 28, 16, 22, 34, 14, 26, 20, 32, 10, 27, 19, 31, 15, 29, 21].map((h, i) => (
                      <div
                        key={i}
                        className="h-8 rounded bg-gradient-to-t from-violet-600/50 to-purple-600/50"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                <button className="w-full rounded-xl bg-linear-to-r from-violet-600 to-purple-600 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-purple-500">
                  Generate Voice
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "50M+", label: "Characters generated" },
            { value: "99.9%", label: "Uptime guarantee" },
            { value: "150+", label: "Voice options" },
            { value: "<2s", label: "Average generation" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-8 text-center backdrop-blur-sm"
            >
              <div className="mb-2 text-4xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need to create{" "}
              <span className="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                amazing voices
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Powerful features designed for creators, developers, and
              businesses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
                title: "Lightning Fast",
                desc: "Generate high-quality audio in under 2 seconds with our optimized processing pipeline.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                ),
                title: "150+ Voices",
                desc: "Choose from a diverse library of natural-sounding voices in multiple languages.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
                title: "Enterprise Security",
                desc: "Your data is encrypted and secure. SOC 2 compliant with enterprise-grade protection.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                ),
                title: "Developer API",
                desc: "Integrate voice generation into your apps with our simple REST API and SDKs.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                ),
                title: "Fine Control",
                desc: "Adjust speed, pitch, emphasis, and more to get exactly the voice you want.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                ),
                title: "Cloud Storage",
                desc: "All your generated audio is stored securely in the cloud with instant access.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-8 backdrop-blur-sm transition hover:border-violet-500/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-purple-600 transition group-hover:scale-110">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Voice Library Section */}
        <section id="voices" className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Explore our{" "}
              <span className="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                voice library
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Natural, expressive voices for every use case
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Aria",
                lang: "English (US)",
                gender: "Female",
                color: "from-pink-500 to-rose-500",
              },
              {
                name: "Guy",
                lang: "English (US)",
                gender: "Male",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Jenny",
                lang: "English (US)",
                gender: "Female",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Davis",
                lang: "English (US)",
                gender: "Male",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Amelia",
                lang: "English (UK)",
                gender: "Female",
                color: "from-violet-500 to-purple-500",
              },
              {
                name: "Ryan",
                lang: "English (UK)",
                gender: "Male",
                color: "from-orange-500 to-red-500",
              },
            ].map((voice, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm transition hover:border-violet-500/50"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={`h-14 w-14 rounded-full bg-linear-to-br ${voice.color}`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {voice.name}
                    </h3>
                    <p className="text-sm text-gray-400">{voice.lang}</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                    {voice.gender}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                    Neural
                  </span>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-sm font-medium text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Preview
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-violet-400 transition hover:text-violet-300"
            >
              View all 150+ voices
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Simple,{" "}
              <span className="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                transparent pricing
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$5",
                period: "/month",
                desc: "Perfect for trying out VoiceAI",
                features: [
                  "10,000 characters/month",
                  "50+ voices",
                  "Standard quality",
                  "API access",
                  "Email support",
                ],
                cta: "Start free trial",
                popular: false,
              },
              {
                name: "Creator",
                price: "$22",
                period: "/month",
                desc: "For content creators and small teams",
                features: [
                  "100,000 characters/month",
                  "150+ voices",
                  "HD quality",
                  "Priority API",
                  "Priority support",
                  "Commercial license",
                ],
                cta: "Start free trial",
                popular: true,
              },
              {
                name: "Business",
                price: "$330",
                period: "/month",
                desc: "For businesses and enterprises",
                features: [
                  "1,000,000 characters/month",
                  "All voices",
                  "Ultra HD quality",
                  "Dedicated API",
                  "24/7 support",
                  "Custom voices",
                  "SLA guarantee",
                ],
                cta: "Contact sales",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl border p-8 ${
                  plan.popular
                    ? "border-violet-500/50 bg-linear-to-br from-violet-900/20 to-purple-900/20"
                    : "border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50"
                } backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-linear-to-r from-violet-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-400">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <Link
                  href="/register"
                  className={`mb-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500"
                      : "border border-white/10 text-gray-200 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-violet-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-linear-to-br from-violet-900/30 to-purple-900/30 p-12 text-center backdrop-blur-sm">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-purple-600/30 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to create amazing voices?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Join thousands of creators and businesses using VoiceAI to bring
              their content to life
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Start free trial
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Try Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-12">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">VoiceAI</span>
              </div>
              <p className="text-sm text-gray-400">
                Create lifelike voices with AI-powered text-to-speech technology
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#voices" className="hover:text-white">
                    Voices
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 VoiceAI. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
