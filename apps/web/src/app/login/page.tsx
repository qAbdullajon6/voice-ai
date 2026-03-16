"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

export default function LoginPage() {
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
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-[#0a0b0d] via-[#0f1117] to-[#0a0b0d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-200 w-200 -translate-x-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),rgba(11,13,16,0))] blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-150 w-150 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),rgba(11,13,16,0))] blur-3xl delay-1000" />
        <div className="absolute left-[10%] bottom-[-20%] h-[700px] w-[700px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1),rgba(11,13,16,0))] blur-3xl delay-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-[#0a0b0d]/80 backdrop-blur-xl">
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

          <div className="flex items-center gap-3">
            <Link
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/5"
              href="/register"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:gap-16">
        <section className="flex flex-1 flex-col justify-center gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-violet-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
            </span>
            Secure Dashboard Access
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back to your VoiceAI workspace.
          </h1>
          <p className="max-w-xl text-base text-gray-400">
            Sign in to manage projects, generate audio, and access your API
            keys. Your studio is ready when you are.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "50M+", value: "Characters generated" },
              { label: "<2s", value: "Average generation" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-5"
              >
                <div className="text-2xl font-semibold text-white">
                  {item.label}
                </div>
                <div className="text-xs text-gray-400">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-linear-to-br from-gray-900/70 to-gray-950/70 p-6 shadow-2xl backdrop-blur">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-gray-400">
              Use your email or Google to continue.
            </p>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-100 transition hover:border-white/20 hover:bg-white/10"
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
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            or continue with email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2 text-sm">
              Email
              <input
                type="email"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Password
              <input
                type="password"
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-500 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                placeholder="????????"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-purple-500 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-4 text-xs text-gray-400">
            No account?{" "}
            <Link className="text-violet-300 hover:text-violet-200" href="/register">
              Create one
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
