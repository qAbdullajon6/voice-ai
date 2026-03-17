"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function LandingHeader({ simple = false }: { simple?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          {!simple && (
            <>
              <a
                href="/#features"
                className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
              >
                Imkoniyatlar
              </a>
              <a
                href="/#pricing"
                className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
              >
                Narxlar
              </a>
              <a
                href="/#testimonials"
                className="hidden text-sm text-gray-400 transition hover:text-white sm:inline-block"
              >
                Fikrlar
              </a>
            </>
          )}
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
  );
}

export function LandingFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 pt-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-lg font-bold text-white">
            Voice AI
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            AI asosida ovoz yaratish — Text to Speech, ovoz klonlash, dublyaj va
            boshqa ovoz vositalari.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Mahsulot</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <Link href="/text-to-speech" className="transition hover:text-white">
                Text to Speech
              </Link>
            </li>
            <li>
              <Link href="/dashboard/voices" className="transition hover:text-white">
                Ovozlar
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition hover:text-white">
                Narxlar
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Kompaniya</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <Link href="/enterprise" className="transition hover:text-white">
                Enterprise
              </Link>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Biz haqimizda
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Bog&apos;lanish
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Huquqiy</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <a href="#" className="transition hover:text-white">
                Maxfiylik
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Foydalanish shartlari
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Voice AI. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
}

export function LandingPageShell({
  children,
  simpleHeader = false,
}: {
  children: React.ReactNode;
  simpleHeader?: boolean;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-b from-[#1a1b1f] via-[#15161a] to-[#0d0e11] text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem]"
        aria-hidden
      />
      <LandingHeader simple={simpleHeader} />
      {children}
    </div>
  );
}
