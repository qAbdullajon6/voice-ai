"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { LandingPageShell, LandingFooter } from "../../components/marketing/landing-layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0e11]" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      router.replace("/dashboard");
    }
  }, [router, searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Login failed");
      }

      const data = await res.json();
      if (data?.token) {
        localStorage.setItem("auth_token", data.token);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LandingPageShell simpleHeader>
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 lg:flex-row lg:items-center lg:gap-16">
        <section className="flex flex-1 flex-col justify-center gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-orange-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Xavfsiz kirish
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Voice AI ga qaytishingiz bilan xush kelibsiz
          </h1>
          <p className="max-w-xl text-base text-gray-400">
            Hisobingizga kiring, matndan nutq yarating va barcha ovoz vositalaridan
            foydalaning.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "50M+", value: "Yaratilgan belgilar" },
              { label: "<2s", value: "O'rtacha generatsiya" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/2 p-5"
              >
                <div className="text-2xl font-semibold text-white">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-md shrink-0 rounded-2xl border border-white/10 bg-white/2 p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Tizimga kirish</h2>
            <p className="mt-1 text-sm text-gray-500">
              Email yoki Google orqali davom eting.
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-orange-500/40 hover:bg-orange-500/10"
            onClick={() => {
              const redirect = encodeURIComponent(window.location.origin);
              window.location.href = `${API_URL}/auth/google?redirect=${redirect}`;
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.6 12.227c0-.705-.063-1.382-.182-2.032H12v3.842h5.372a4.59 4.59 0 01-1.99 3.013v2.5h3.217c1.882-1.733 3.001-4.286 3.001-7.323z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.966-.892 6.621-2.45l-3.217-2.5c-.892.6-2.033.955-3.404.955-2.616 0-4.833-1.764-5.624-4.135H2.05v2.61A9.996 9.996 0 0012 22z"
                fill="#34A853"
              />
              <path
                d="M6.376 13.87a5.99 5.99 0 010-3.742V7.517H2.05a10 10 0 000 8.966l4.326-2.612z"
                fill="#FBBC05"
              />
              <path
                d="M12 6.545c1.47 0 2.79.506 3.828 1.5l2.872-2.872C16.96 3.556 14.695 2.5 12 2.5A9.996 9.996 0 002.05 7.517l4.326 2.611C7.167 8.31 9.384 6.545 12 6.545z"
                fill="#EA4335"
              />
            </svg>
            Google orqali davom etish
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            yoki email orqali
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2 text-sm text-gray-400">
              Email
              <input
                type="email"
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-400">
              Parol
              <input
                type="password"
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-linear-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-orange-400 hover:to-red-400 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Kirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <p className="mt-4 text-center text-sm text-gray-500">
            Hisobingiz yo&apos;qmi?{" "}
            <Link
              className="font-medium text-orange-400 transition hover:text-orange-300"
              href="/register"
            >
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </p>
        </section>
      </main>

      <div className="relative mx-auto max-w-6xl px-6 pb-20">
        <LandingFooter />
      </div>
    </LandingPageShell>
  );
}
