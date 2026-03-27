"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type CatalogVoice = {
  id: string;
  provider: string;
  providerVoiceId: string;
  name: string;
  shortName: string;
  displayName: string;
  localName: string | null;
  gender: string | null;
  locale: string;
  localeName: string | null;
  language: string | null;
  accent: string | null;
  voiceType: string | null;
  category: string | null;
  sampleRateHertz: string | null;
  wordsPerMinute: string | null;
  styles: string[];
};

type VoiceFacets = {
  locales: string[];
  languages: string[];
  accents: string[];
  genders: string[];
  voiceTypes: string[];
  categories: string[];
  providers: string[];
  styles: string[];
};

const EMPTY_FACETS: VoiceFacets = {
  locales: [],
  languages: [],
  accents: [],
  genders: [],
  voiceTypes: [],
  categories: [],
  providers: [],
  styles: [],
};

export default function TextToSpeechPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
            Loading...
          </div>
        </div>
      }
    >
      <TextToSpeechInner />
    </Suspense>
  );
}

function TextToSpeechInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preferredVoiceId = searchParams.get("voice") ?? "";

  const [authReady, setAuthReady] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [text, setText] = useState(
    "Assalomu alaykum. Bu VoiceAI platformasidagi yangi text-to-speech sahifasi. Matningizni kiriting va tabiiy ovozga aylantiring.",
  );
  const [voiceId, setVoiceId] = useState(preferredVoiceId);
  const [voices, setVoices] = useState<CatalogVoice[]>([]);
  const [facets, setFacets] = useState<VoiceFacets>(EMPTY_FACETS);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [voicesError, setVoicesError] = useState("");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [accent, setAccent] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [provider, setProvider] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const selectedVoice =
    voices.find((voice) => voice.id === voiceId) ??
    voices.find((voice) => voice.shortName === voiceId) ??
    voices[0] ??
    null;

  const isGenerating =
    loading || (!!status && status !== "done" && status !== "failed");
  const outputFormat = "audio-24khz-96kbitrate-mono-mp3";

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthToken(token);

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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

    const controller = new AbortController();
    const url = new URL(`${API_URL}/voices`);
    if (query.trim()) url.searchParams.set("q", query.trim());
    if (language) url.searchParams.set("language", language);
    if (accent) url.searchParams.set("accent", accent);
    if (gender) url.searchParams.set("gender", gender);
    if (category) url.searchParams.set("category", category);
    if (style) url.searchParams.set("style", style);
    if (provider) url.searchParams.set("provider", provider);

    setVoicesLoading(true);
    setVoicesError("");

    fetch(url.toString(), {
      headers: { Authorization: `Bearer ${authToken}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setVoices(Array.isArray(data?.items) ? data.items : []);
        setFacets(data?.facets ?? EMPTY_FACETS);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        setVoicesError(
          err instanceof Error ? err.message : "Voices could not be loaded",
        );
      })
      .finally(() => setVoicesLoading(false));

    return () => controller.abort();
  }, [
    accent,
    authReady,
    authToken,
    category,
    gender,
    language,
    provider,
    query,
    style,
  ]);

  useEffect(() => {
    if (!voices.length) return;
    const preferredMatch = voices.find(
      (voice) =>
        voice.id === preferredVoiceId ||
        voice.shortName === preferredVoiceId ||
        voice.providerVoiceId === preferredVoiceId,
    );
    const currentMatch = voices.find((voice) => voice.id === voiceId);
    if (currentMatch) return;
    setVoiceId(preferredMatch?.id ?? voices[0].id);
  }, [preferredVoiceId, voiceId, voices]);

  async function onGenerate() {
    if (!selectedVoice) return;

    setLoading(true);
    setError("");
    setJobId("");
    setStatus("");
    setPlayerOpen(true);
    setShouldAutoplay(false);

    try {
      const res = await fetch(`${API_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice.shortName,
          output_format: outputFormat,
          settings: {
            speed: 0.5,
            stability: 0.5,
            similarity: 0.7,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (!data?.id) throw new Error("No job id returned");
      setJobId(String(data.id));
      setStatus("queued");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const pollJob = useCallback(
    async (id: string) => {
      const res = await fetch(`${API_URL}/tts/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setStatus(data.status || "");
      if (data.status === "done" && data.url) {
        setAudioUrl(String(data.url));
        setShouldAutoplay(true);
        return true;
      }
      if (data.status === "failed") throw new Error(data.error || "Job failed");
      return false;
    },
    [authToken],
  );

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    let timer: NodeJS.Timeout | null = null;

    const tick = async () => {
      try {
        const done = await pollJob(jobId);
        if (!done && !cancelled) timer = setTimeout(tick, 1500);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Polling failed");
        }
      }
    };

    timer = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId, pollJob]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
          Checking access...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col pb-28">
      <div className="grid min-h-0 flex-1 gap-6 overflow-hidden xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 flex min-h-0 flex-col">
          <div className="h-[min(56dvh,520px)] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_16px_40px_-28px_rgba(67,56,202,0.45)]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-full w-full resize-none rounded-3xl bg-white p-6 text-sm leading-6 text-neutral-900 outline-none placeholder:text-neutral-400"
              placeholder="Matn kiriting yoki paste qiling..."
            />
          </div>

          <div className="mt-4 flex justify-between gap-4 overflow-x-auto px-1">
            <div className="inline-flex min-w-max items-center gap-2">
              {[
                {
                  label: "Reklama matni",
                  value: "Yangi mahsulotimizni bugunoq sinab ko'ring.",
                },
                {
                  label: "Yangilik ovozi",
                  value: "Bugungi asosiy yangiliklar bilan tanishing.",
                },
                {
                  label: "Podkast intro",
                  value:
                    "Assalomu alaykum, podkastimizning yangi soniga xush kelibsiz.",
                },
                {
                  label: "Ta'lim",
                  value:
                    "Bugungi darsimizda sun'iy intellekt asoslarini ko'rib chiqamiz.",
                },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-neutral-100"
                  onClick={() => setText(chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-[46px] min-w-[190px] items-center justify-center rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
              disabled={isGenerating || !text.trim() || !selectedVoice}
              onClick={onGenerate}
            >
              {isGenerating ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <span>Generate speech</span>
              )}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <aside className="min-h-0 overflow-auto pr-1">
          <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Voices
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {voices.length} ta ovoz topildi
                </div>
              </div>
              {selectedVoice ? (
                <div className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
                  {selectedVoice.provider}
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Voice, accent, style qidirish..."
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <Select
                  value={language}
                  onChange={setLanguage}
                  label="Language"
                  options={facets.languages}
                />
                <Select
                  value={accent}
                  onChange={setAccent}
                  label="Accent"
                  options={facets.accents}
                />
                <Select
                  value={gender}
                  onChange={setGender}
                  label="Gender"
                  options={facets.genders}
                />
                <Select
                  value={category}
                  onChange={setCategory}
                  label="Category"
                  options={facets.categories}
                />
                <Select
                  value={style}
                  onChange={setStyle}
                  label="Style"
                  options={facets.styles}
                />
                <Select
                  value={provider}
                  onChange={setProvider}
                  label="Provider"
                  options={facets.providers}
                />
              </div>

              <button
                type="button"
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                onClick={() => {
                  setQuery("");
                  setLanguage("");
                  setAccent("");
                  setGender("");
                  setCategory("");
                  setStyle("");
                  setProvider("");
                }}
              >
                Filterlarni tozalash
              </button>
            </div>

            {voicesError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {voicesError}
              </div>
            ) : null}

            <div className="mt-4 space-y-2">
              {voicesLoading ? (
                <div className="py-8 text-center text-sm text-neutral-500">
                  Ovozlar yuklanmoqda...
                </div>
              ) : voices.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-500">
                  Hozircha bu filterlar bo&apos;yicha ovoz topilmadi.
                </div>
              ) : (
                voices.slice(0, 120).map((voice) => {
                  const active = voice.id === selectedVoice?.id;
                  return (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => setVoiceId(voice.id)}
                      className={[
                        "w-full rounded-2xl border px-3 py-3 text-left transition",
                        active
                          ? "border-black bg-neutral-100"
                          : "border-neutral-200 bg-white hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-black">
                            {voice.displayName}
                          </div>
                          <div className="mt-0.5 truncate text-xs text-neutral-500">
                            {voice.language ?? voice.localeName ?? voice.locale}
                            {voice.accent ? ` • ${voice.accent}` : ""}
                            {voice.gender ? ` • ${voice.gender}` : ""}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-500">
                          {voice.category ?? "General"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip>{voice.locale}</Chip>
                        {voice.voiceType ? (
                          <Chip>{voice.voiceType}</Chip>
                        ) : null}
                        {voice.styles.slice(0, 2).map((item) => (
                          <Chip key={item}>{item}</Chip>
                        ))}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

      <MiniPlayer
        text={text}
        audioUrl={audioUrl}
        status={status}
        playerOpen={playerOpen}
        generating={isGenerating}
        onClosePlayer={() => setPlayerOpen(false)}
        onExpandPlayer={() => setPlayerOpen(true)}
        voiceLabel={
          selectedVoice?.displayName ?? selectedVoice?.shortName ?? "Voice"
        }
        voiceSubLabel={[
          selectedVoice?.language,
          selectedVoice?.accent,
          selectedVoice?.voiceType,
        ]
          .filter(Boolean)
          .join(" • ")}
        onDownload={() => {
          if (!audioUrl) return;
          window.open(audioUrl, "_blank");
        }}
        onShare={() => {
          if (!audioUrl) return;
          navigator.clipboard?.writeText(audioUrl).catch(() => null);
          setShareCopied(true);
          window.setTimeout(() => setShareCopied(false), 1400);
        }}
        shareCopied={shareCopied}
        shouldAutoplay={shouldAutoplay}
        onAutoplayHandled={() => setShouldAutoplay(false)}
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400"
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
      {children}
    </span>
  );
}

function MiniPlayer({
  text,
  audioUrl,
  status,
  playerOpen,
  generating,
  onClosePlayer,
  onExpandPlayer,
  voiceLabel,
  voiceSubLabel,
  onDownload,
  onShare,
  shareCopied,
  shouldAutoplay,
  onAutoplayHandled,
}: {
  text: string;
  audioUrl: string;
  status: string;
  playerOpen: boolean;
  generating: boolean;
  onClosePlayer: () => void;
  onExpandPlayer: () => void;
  voiceLabel: string;
  voiceSubLabel: string;
  onDownload: () => void;
  onShare: () => void;
  shareCopied: boolean;
  shouldAutoplay: boolean;
  onAutoplayHandled: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // ignore
    }
  }, [audioUrl]);

  useEffect(() => {
    if (!audioUrl || !shouldAutoplay) return;
    const el = audioRef.current;
    if (!el) return;
    el.play().catch(() => null);
    onAutoplayHandled();
  }, [audioUrl, onAutoplayHandled, shouldAutoplay]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () =>
      setTime({ current: el.currentTime || 0, duration: el.duration || 0 });
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onTime);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onTime);
    };
  }, [audioUrl]);

  const fmt = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const title =
    text.trim().replace(/\s+/g, " ") || "Start typing to generate speech";
  const canOpenPeek =
    !playerOpen && (Boolean(audioUrl) || Boolean(status) || generating);
  const progressPercent =
    time.duration > 0
      ? Math.max(0, Math.min(100, (time.current / time.duration) * 100))
      : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 md:left-(--eleven-sidebar-width)">
      {canOpenPeek ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <button
            type="button"
            onClick={onExpandPlayer}
            className="pointer-events-auto flex h-3 w-[320px] cursor-pointer items-center px-2"
            aria-label="Open player"
          >
            <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-300">
              {generating && !audioUrl ? (
                <span className="absolute left-[35%] top-0 h-full w-[30%] animate-pulse rounded-full bg-black" />
              ) : (
                <span
                  className="absolute left-0 top-0 h-full rounded-full bg-black transition-[width] duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              )}
            </span>
          </button>
        </div>
      ) : null}

      {shareCopied ? (
        <div className="pointer-events-none absolute inset-x-0 -top-10 flex justify-center">
          <div className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
            Copied link
          </div>
        </div>
      ) : null}

      <div
        className={[
          "w-full",
          playerOpen ? "" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "border-t border-neutral-200 bg-white/95 shadow-[0_-12px_30px_-20px_rgba(0,0,0,0.3)] backdrop-blur transition-all duration-500 ease-in-out",
            playerOpen ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
        >
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[320px_1fr_320px] lg:gap-8">
              <div className="min-w-0">
                <div className="max-w-[320px] truncate text-[14px] font-semibold tracking-tight text-neutral-900">
                  {title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <span className="truncate">
                    {voiceLabel}
                    {voiceSubLabel ? ` - ${voiceSubLabel}` : ""}
                  </span>
                  <span className="mx-0.5 opacity-40">•</span>
                  <span className="shrink-0 opacity-80">
                    {generating ? "Jarayonda" : "Tayyorlandi"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="group relative flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                    onClick={() => {
                      const el = audioRef.current;
                      if (!el) return;
                      el.currentTime = Math.max(0, (el.currentTime || 0) - 10);
                    }}
                    disabled={!audioUrl}
                  >
                    <SkipBackIcon />
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-white transition hover:scale-105 active:scale-95 disabled:opacity-40"
                    onClick={() => {
                      const el = audioRef.current;
                      if (!el) return;
                      if (el.paused) el.play().catch(() => null);
                      else el.pause();
                    }}
                    disabled={!audioUrl}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  <button
                    type="button"
                    className="group relative flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:text-neutral-900"
                    onClick={() => {
                      const el = audioRef.current;
                      if (!el) return;
                      el.currentTime = Math.min(
                        el.duration || 0,
                        (el.currentTime || 0) + 10,
                      );
                    }}
                    disabled={!audioUrl}
                  >
                    <SkipForwardIcon />
                  </button>
                </div>

                <div className="flex w-full max-w-lg items-center gap-3">
                  <span className="min-w-[32px] text-left text-[11px] font-medium tabular-nums text-neutral-400">
                    {fmt(time.current)}
                  </span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-black transition-[width] duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="min-w-[32px] text-right text-[11px] font-medium tabular-nums text-neutral-400">
                    {fmt(time.duration || 0)}
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 items-center justify-end gap-3">
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-semibold text-neutral-900 transition hover:bg-neutral-50"
                  onClick={onShare}
                  disabled={!audioUrl}
                >
                  <ShareIcon />
                  Ulashish
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    onClick={onDownload}
                    disabled={!audioUrl}
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    onClick={onClosePlayer}
                  >
                    <CollapseIcon />
                  </button>
                </div>
              </div>
            </div>

            {audioUrl ? (
              <audio ref={audioRef} className="hidden" src={audioUrl} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkipBackIcon() {
  return (
    <svg
      height="1.1rem"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.33386 10C4.34525 10.0003 4.35662 10.0003 4.36795 10H8.25C8.66421 10 9 9.66421 9 9.25C9 8.83579 8.66421 8.5 8.25 8.5H5.43993C6.58986 6.11553 9.20412 4.5 12.0053 4.5C15.1589 4.5 17.8842 6.55843 18.9892 9.51275C19.1343 9.90072 19.5665 10.0976 19.9544 9.95247C20.3424 9.80735 20.5393 9.37521 20.3941 8.98725C19.0902 5.50112 15.8407 3 12.0053 3C8.96442 3 6.05937 4.59129 4.5 7.09919V4.75C4.5 4.33579 4.16421 4 3.75 4C3.33579 4 3 4.33579 3 4.75V9.25C3 9.66421 3.33579 10 3.75 10H4.33386Z"
        fill="currentColor"
      />
      <path
        d="M7.66406 20.1558V13.9858H7.62598L6.75635 14.6016C6.4834 14.7793 6.32471 14.8364 6.14062 14.8364C5.7915 14.8364 5.53125 14.5762 5.53125 14.2271C5.53125 13.9604 5.69629 13.7256 6.02002 13.5098L7.15625 12.7163C7.61328 12.4053 7.9751 12.2783 8.33057 12.2783C8.94629 12.2783 9.35889 12.7036 9.35889 13.3447V20.1558C9.35889 20.7397 9.04785 21.0762 8.5083 21.0762C7.9751 21.0762 7.66406 20.7334 7.66406 20.1558Z"
        fill="currentColor"
      />
      <path
        d="M10.8569 16.8804V16.4741C10.8569 13.8716 12.1011 12.1704 14.1641 12.1704C16.2334 12.1704 17.4522 13.8525 17.4522 16.4741V16.8804C17.4522 19.4766 16.1953 21.1841 14.1387 21.1841C12.0821 21.1841 10.8569 19.4956 10.8569 16.8804ZM12.5708 16.4805V16.8677C12.5708 18.6958 13.1675 19.7876 14.1514 19.7876C15.1353 19.7876 15.7319 18.6958 15.7319 16.8677V16.4805C15.7319 14.6587 15.1353 13.5669 14.1514 13.5669C13.1675 13.5669 12.5708 14.6523 12.5708 16.4805Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg
      height="1.1rem"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.60615 8.98725C4.91012 5.50112 8.15961 3 11.995 3C15.0359 3 17.9409 4.59129 19.5003 7.09919V4.75C19.5003 4.33579 19.8361 4 20.2503 4C20.6645 4 21.0003 4.33579 21.0003 4.75V9.25C21.0003 9.66421 20.6645 10 20.2503 10H15.7503C15.3361 10 15.0003 9.66421 15.0003 9.25C15.0003 8.83579 15.3361 8.5 15.7503 8.5H18.5604C17.4104 6.11553 14.7962 4.5 11.995 4.5C8.84135 4.5 6.11613 6.55843 5.01108 9.51275C4.86597 9.90072 4.43382 10.0976 4.04586 9.95247C3.6579 9.80735 3.46103 9.37521 3.60615 8.98725Z"
        fill="currentColor"
      />
      <path
        d="M8.16408 20.1558V13.9858H8.126L7.25637 14.6016C6.98342 14.7793 6.82473 14.8364 6.64065 14.8364C6.29152 14.8364 6.03127 14.5762 6.03127 14.2271C6.03127 13.9604 6.19631 13.7256 6.52004 13.5098L7.65627 12.7163C8.1133 12.4053 8.47512 12.2783 8.83059 12.2783C9.44631 12.2783 9.85891 12.7036 9.85891 13.3447V20.1558C9.85891 20.7397 9.54787 21.0762 9.00832 21.0762C8.47512 21.0762 8.16408 20.7334 8.16408 20.1558Z"
        fill="currentColor"
      />
      <path
        d="M11.357 16.8804V16.4741C11.357 13.8716 12.6011 12.1704 14.6641 12.1704C16.7334 12.1704 17.9522 13.8525 17.9522 16.4741V16.8804C17.9522 19.4766 16.6953 21.1841 14.6387 21.1841C12.5821 21.1841 11.357 19.4956 11.357 16.8804ZM13.0708 16.4805V16.8677C13.0708 18.6958 13.6675 19.7876 14.6514 19.7876C15.6353 19.7876 16.232 18.6958 16.232 16.8677V16.4805C16.232 14.6587 15.6353 13.5669 14.6514 13.5669C13.6675 13.5669 13.0708 14.6523 13.0708 16.4805Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 translate-x-px"
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}
