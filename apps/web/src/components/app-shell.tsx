"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Badge } from "./ui/badge";

export type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
  badge?: string;
};

export function AppShell({
  title = "VoiceAI",
  sidebarLabel = "Workspace",
  sidebarValue = "ElevenCreative",
  nav,
  actions,
  children,
}: {
  title?: string;
  sidebarLabel?: string;
  sidebarValue?: string;
  nav: Array<{ section: string; items: NavItem[] }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b0d] via-[#0f1117] to-[#0a0b0d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-200 w-200 -translate-x-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),rgba(11,13,16,0))] blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-150 w-150 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.10),rgba(11,13,16,0))] blur-3xl delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden w-[280px] flex-col gap-6 border-r border-white/5 bg-black/15 px-5 py-6 backdrop-blur-xl md:flex">
          <Link href="/app/home" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-sm font-bold">
              V
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-gray-400">Studio</div>
            </div>
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {sidebarLabel}
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="truncate text-sm font-medium text-gray-100">
                {sidebarValue}
              </div>
              <div className="text-xs text-gray-500">⌘K</div>
            </div>
          </div>

          <nav className="space-y-5">
            {nav.map((section) => (
              <div key={section.section}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {section.section}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    const disabled = Boolean(item.disabled);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        aria-disabled={disabled}
                        className={[
                          "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
                          disabled
                            ? "cursor-not-allowed text-gray-600"
                            : active
                              ? "bg-white/10 text-white"
                              : "text-gray-200 hover:bg-white/5 hover:text-white",
                        ].join(" ")}
                        onClick={(e) => {
                          if (disabled) e.preventDefault();
                        }}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <Badge tone={disabled ? "soon" : "new"}>
                            {disabled ? "Soon" : item.badge}
                          </Badge>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/40 to-gray-950/40 p-4">
            <div className="text-xs font-semibold text-gray-200">Tip</div>
            <div className="mt-1 text-xs leading-relaxed text-gray-400">
              Use punctuation for natural pauses and more realistic prosody.
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0b0d]/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {title}
                </div>
                <div className="truncate text-xs text-gray-400">
                  Build, generate, and ship audio products
                </div>
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
          </header>

          <main className="relative z-10 min-w-0 flex-1 px-5 py-8 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

