"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

type HeaderLink = {
  label: string;
  href: string;
  soon?: boolean;
};

const links: HeaderLink[] = [
  { label: "ElevenCreative", href: "/" },
  { label: "ElevenAgents", href: "/agents", soon: true },
  { label: "ElevenAPI", href: "/api", soon: true },
  { label: "Resources", href: "/resources", soon: true },
  { label: "Enterprise", href: "/enterprise", soon: true },
  { label: "Pricing", href: "/pricing" },
];

export function SiteHeader({
  scrolled = false,
}: {
  scrolled?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0b0d]/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4">
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

        <div className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                aria-disabled={l.soon}
                className={[
                  "relative flex items-center gap-2 text-gray-300 transition hover:text-white",
                  l.soon ? "cursor-not-allowed opacity-70 hover:text-gray-300" : "",
                  active ? "text-white" : "",
                ].join(" ")}
                onClick={(e) => {
                  if (l.soon) e.preventDefault();
                }}
              >
                <span>{l.label}</span>
                {l.soon ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Soon
                  </span>
                ) : null}
                {active ? (
                  <span className="absolute -bottom-3 left-0 right-0 h-px bg-linear-to-r from-violet-500/0 via-violet-500/70 to-violet-500/0" />
                ) : null}
              </Link>
            );
          })}
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
  );
}

