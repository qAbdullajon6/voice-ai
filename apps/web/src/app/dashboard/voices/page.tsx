"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMiniPlayer } from "../../../components/app/mini-player-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type LibraryVoice = {
  id: string;
  title: string;
  subtitle: string;
  audio_url: string;
  hue: number;
  rotate: number;
};

function hashToNumber(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fallbackHueRotate(id: string) {
  const n = hashToNumber(id);
  return { hue: n % 360, rotate: n % 360 };
}

const TABS = ["Explore", "My Voices", "Default Voices"] as const;
const CATEGORY_PILLS = [
  "Conversational",
  "Narration",
  "Characters",
  "Social Media",
  "Educational",
  "Advertisement",
] as const;

const CURATED_LANGUAGES = [
  { name: "Arabic", sample: "العربية" },
  { name: "Bulgarian", sample: "Български" },
  { name: "Chinese", sample: "中文" },
  { name: "English", sample: "English" },
];

const HANDPICKED = [
  { title: "Best voices for Eleven v3", id: "handpick-1" },
  { title: "Popular Tiktok voices", id: "handpick-2" },
];

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M8.38 3.69C7.05 2.87 5.33 3.82 5.33 5.39v9.22c0 1.57 1.72 2.52 3.05 1.7l7.47-4.61c1.27-.78 1.27-2.62 0-3.4L8.38 3.69z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function VoiceOrb({
  voice,
  size = "md",
}: {
  voice: LibraryVoice;
  size?: "sm" | "md" | "lg";
}) {
  const vib = fallbackHueRotate(voice.id);
  const hue = Number.isFinite(voice.hue) ? voice.hue : vib.hue;
  const rotate = Number.isFinite(voice.rotate) ? voice.rotate : vib.rotate;
  const sizeClass =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700 ${sizeClass}`}
    >
      <div
        className="h-full w-full rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-orange-400"
        style={{
          filter: `hue-rotate(${hue}deg) saturate(120%)`,
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </div>
  );
}

export default function VoicesPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [accentFilter, setAccentFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [items, setItems] = useState<LibraryVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { open: openMiniPlayer, item: currentItem, isPlaying, toggle } = useMiniPlayer();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setAuthReady(true);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        router.replace("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!authReady) return;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/voices/library/latest?limit=20`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const list = Array.isArray(data?.items) ? (data.items as LibraryVoice[]) : [];
        setItems(list);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load voices"))
      .finally(() => setLoading(false));
  }, [authReady]);

  const filteredItems = useMemo(() => {
    let list = items;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) || v.subtitle.toLowerCase().includes(q),
      );
    }
    if (languageFilter) {
      list = list.filter(() => true); // demo: no language field in API
    }
    if (categoryFilter) {
      list = list.filter(() => true); // demo: UI only
    }
    return list;
  }, [items, searchQuery, languageFilter, categoryFilter]);

  const openPlay = useCallback(
    (v: LibraryVoice) => {
      const vib = fallbackHueRotate(v.id);
      const hue = Number.isFinite(v.hue) ? v.hue : vib.hue;
      const rotate = Number.isFinite(v.rotate) ? v.rotate : vib.rotate;
      const next = {
        id: v.id,
        title: v.title,
        hue,
        rotate,
        audioSrc: v.audio_url,
        languageLabel: "English",
      };
      if (currentItem?.id === v.id) {
        toggle();
        return;
      }
      openMiniPlayer(next);
    },
    [currentItem?.id, openMiniPlayer, toggle],
  );

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        Checking access...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        Voices &gt; Explore
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-neutral-900 text-neutral-950 dark:border-neutral-100 dark:text-neutral-50"
                : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Explore" && (
        <>
          {/* Search + Filters + Create */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library voices..."
                className="min-w-[200px] flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-violet-500 dark:focus:ring-violet-900/50"
              />
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <option value="">Language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <select
                value={accentFilter}
                onChange={(e) => setAccentFilter(e.target.value)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <option value="">Accent</option>
                <option value="american">American</option>
                <option value="british">British</option>
              </select>
              <button
                type="button"
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                + Create Voice
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PILLS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setCategoryFilter(categoryFilter === label ? null : label)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  categoryFilter === label
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {/* Handpicked for your use case (optional carousel) */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
              Handpicked for your use case
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {HANDPICKED.map((card) => (
                <div
                  key={card.id}
                  className="flex h-32 min-w-[280px] flex-1 flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {card.title}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    aria-label="View"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Trending voices (grid) */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
              Trending voices
            </h2>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                No voices found. Try adjusting your search or filters.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((v) => {
                  const isCurrent = currentItem?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:shadow-neutral-900/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <VoiceOrb voice={v} size="lg" />
                          <button
                            type="button"
                            aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPlay(v);
                            }}
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                              {isCurrent && isPlaying ? (
                                <PauseIcon className="h-5 w-5" />
                              ) : (
                                <PlayIcon className="h-5 w-5 ml-0.5" />
                              )}
                            </span>
                          </button>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-100">
                            {v.title}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Narration
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <span aria-hidden>🇺🇸</span> English +12
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Weekly spotlight - Character Voices (list) */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
              Weekly spotlight – Character Voices
            </h2>
            {loading ? (
              <div className="space-y-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b border-neutral-100 py-4 dark:border-neutral-800"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? null : (
              <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
                {filteredItems.map((v) => {
                  const isCurrent = currentItem?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      className="flex flex-wrap items-center gap-4 px-4 py-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <div className="relative shrink-0">
                        <VoiceOrb voice={v} size="md" />
                        <button
                          type="button"
                          aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity hover:opacity-100"
                          onClick={() => openPlay(v)}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                            {isCurrent && isPlaying ? (
                              <PauseIcon className="h-4 w-4" />
                            ) : (
                              <PlayIcon className="h-4 w-4 ml-0.5" />
                            )}
                          </span>
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-neutral-950 dark:text-neutral-100">
                          {v.title}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {v.subtitle}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <span aria-hidden>🇺🇸</span> English · American
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                            Characters
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                          aria-label="Add to library"
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                          aria-label="More options"
                        >
                          <span className="text-lg leading-none">⋯</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Curated language collections */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
              Curated language collections
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {CURATED_LANGUAGES.map((lang) => (
                <div
                  key={lang.name}
                  className="flex min-w-[200px] flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="flex flex-1 items-center justify-center bg-neutral-100 px-4 py-8 dark:bg-neutral-800">
                    <span className="text-2xl font-medium text-neutral-600 dark:text-neutral-400">
                      {lang.sample}
                    </span>
                  </div>
                  <div className="flex items-end justify-between p-3">
                    <div>
                      <p className="font-medium text-neutral-950 dark:text-neutral-100">
                        {lang.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Top picks
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      aria-label={`View ${lang.name} voices`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "My Voices" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            My Voices – coming soon. Add voices from Explore to your library.
          </p>
        </div>
      )}

      {activeTab === "Default Voices" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Default Voices – coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
