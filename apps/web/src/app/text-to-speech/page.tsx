"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VoicePicker } from "../../components/tts/voice-picker";
import {
  HistoryList,
  type HistoryItem,
} from "../../components/tts/history-list";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type Voice = {
  id: string;
  name: string;
  style: string;
};

type Model = {
  id: string;
  name: string;
  desc: string;
  badge?: string;
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
  const [authReady, setAuthReady] = useState(false);
  const [authToken, setAuthToken] = useState("");

  const voices: Voice[] = useMemo(
    () => [
      {
        id: "en-US-AriaNeural",
        name: "Aria",
        style: "Bright, Clear, Friendly",
      },
      { id: "en-US-GuyNeural", name: "Guy", style: "Confident, Warm, Natural" },
      { id: "en-US-JennyNeural", name: "Jenny", style: "Crisp, Professional" },
      { id: "en-US-DavisNeural", name: "Davis", style: "Newsreader, Educator" },
      { id: "en-GB-SoniaNeural", name: "Sonia", style: "British, Smooth" },
      { id: "uz-UZ-MadinaNeural", name: "Madina", style: "Uzbek, Expressive" },
    ],
    [],
  );

  const models: Model[] = useMemo(
    () => [
      {
        id: "eleven_multilingual_v2",
        name: "Eleven Multilingual v2",
        desc: "Balanced quality and speed for most workflows.",
      },
      {
        id: "eleven_flash_v2_5",
        name: "Eleven Flash v2.5",
        desc: "Lower latency for conversational use cases.",
        badge: "Fast",
      },
      {
        id: "eleven_v3",
        name: "Eleven v3",
        desc: "Highest expressiveness and control (coming soon).",
        badge: "Soon",
      },
    ],
    [],
  );

  const initialVoice =
    searchParams.get("voice") ||
    (voices.find((v) => v.id === "en-US-AriaNeural")?.id ??
      voices[0]?.id ??
      "");

  const [text, setText] = useState(
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  );
  const [voiceId, setVoiceId] = useState(initialVoice);
  const [modelId, setModelId] = useState(models[0]?.id ?? "");
  const [tab, setTab] = useState<"settings" | "history">("settings");

  const [speed, setSpeed] = useState(0.5);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.7);
  const [styleExaggeration, setStyleExaggeration] = useState(0.2);
  const [speakerBoost, setSpeakerBoost] = useState(true);

  const [outputFormat, setOutputFormat] = useState(
    "audio-24khz-96kbitrate-mono-mp3",
  );
  const [audioUrl, setAudioUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyCursor, setHistoryCursor] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const selectedVoice = voices.find((v) => v.id === voiceId) ?? voices[0];

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

  const loadHistory = useCallback(
    async (opts?: { reset?: boolean }) => {
      if (!authToken) return;
      setHistoryLoading(true);
      setHistoryError("");
      try {
        const url = new URL(`${API_URL}/tts/history`);
        url.searchParams.set("limit", "20");
        if (!opts?.reset && historyCursor)
          url.searchParams.set("cursor", historyCursor);
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const items: HistoryItem[] = Array.isArray(data?.items)
          ? data.items
          : [];
        const nextCursor: string | null = data?.nextCursor ?? null;
        setHistoryCursor(nextCursor);
        setHistoryItems((prev) => (opts?.reset ? items : [...prev, ...items]));
      } catch (e) {
        setHistoryError(
          e instanceof Error ? e.message : "Failed to load history",
        );
      } finally {
        setHistoryLoading(false);
      }
    },
    [authToken, historyCursor],
  );

  async function onGenerate() {
    setLoading(true);
    setError("");
    setAudioUrl("");
    setJobId("");
    setStatus("");
    setPlayerOpen(true);

    try {
      const res = await fetch(`${API_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text,
          voice: voiceId,
          output_format: outputFormat,
          model_id: modelId,
          settings: {
            speed,
            stability,
            similarity,
            style_exaggeration: styleExaggeration,
            speaker_boost: speakerBoost,
          },
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();
      if (!data?.id) {
        throw new Error("No job id returned");
      }
      setJobId(data.id);
      setStatus("queued");
      // refresh history so the new generation appears quickly
      loadHistory({ reset: true }).catch(() => null);
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
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();
      setStatus(data.status || "");
      if (data.status === "done" && data.url) {
        setAudioUrl(data.url);
        return true;
      }
      if (data.status === "failed") {
        throw new Error(data.error || "Job failed");
      }
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
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Polling failed");
      }
    };

    timer = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId, pollJob]);

  useEffect(() => {
    const v = searchParams.get("voice");
    if (v) setVoiceId(v);
  }, [searchParams]);

  useEffect(() => {
    if (!authReady) return;
    loadHistory({ reset: true }).catch(() => null);
  }, [authReady, loadHistory]);

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
    <div className="relative flex h-full min-h-0 flex-col">
        <div className="grid min-h-0 flex-1 gap-6 overflow-hidden xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 flex min-h-0 flex-col">
            <div className="rounded-3xl border border-neutral-200 bg-white h-[min(56dvh,520px)] overflow-hidden">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-full w-full resize-none rounded-3xl bg-white p-6 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
              />
            </div>

            <div className="mt-4 -mx-1 overflow-x-auto px-1">
              <div className="inline-flex min-w-max items-center gap-2">
                {[
                  { label: "Narrate a story", value: "In a distant land..." },
                  { label: "Tell a silly joke", value: "Why did the robot..." },
                  {
                    label: "Record an advertisement",
                    value: "Introducing VoiceAI...",
                  },
                  {
                    label: "Speak in different languages",
                    value: "Assalomu alaykum...",
                  },
                  {
                    label: "Introduce your podcast",
                    value: "Welcome to my show...",
                  },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setText(chip.value)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <EditorBar
              text={text}
              loading={loading}
              onClear={() => {
                setText("");
                setAudioUrl("");
                setError("");
                setJobId("");
                setStatus("");
                setPlayerOpen(false);
              }}
              onGenerate={onGenerate}
            />
          </div>

          <aside className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                <button
                  type="button"
                  className={[
                    "text-sm font-semibold",
                    tab === "settings"
                      ? "text-neutral-950"
                      : "text-neutral-500",
                  ].join(" ")}
                  onClick={() => setTab("settings")}
                >
                  Settings
                </button>
                <button
                  type="button"
                  className={[
                    "text-sm font-semibold",
                    tab === "history" ? "text-neutral-950" : "text-neutral-500",
                  ].join(" ")}
                  onClick={() => setTab("history")}
                >
                  History
                </button>
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-auto pr-1">
              {tab === "history" ? (
                <HistoryList
                  items={historyItems}
                  loading={historyLoading}
                  error={historyError}
                  canLoadMore={Boolean(historyCursor)}
                  onLoadMore={() => loadHistory({ reset: false })}
                  onSelect={(it) => {
                    setText(it.text ?? "");
                    if (it.voice_id) setVoiceId(it.voice_id);
                    if (it.model_id) setModelId(it.model_id);
                    if (it.output_format) setOutputFormat(it.output_format);
                    const s = (it.settings ?? {}) as Record<string, unknown>;
                    if (typeof s.speed === "number") setSpeed(s.speed);
                    if (typeof s.stability === "number")
                      setStability(s.stability);
                    if (typeof s.similarity === "number")
                      setSimilarity(s.similarity);
                    if (typeof s.style_exaggeration === "number")
                      setStyleExaggeration(s.style_exaggeration);
                    if (typeof s.speaker_boost === "boolean")
                      setSpeakerBoost(s.speaker_boost);
                    if (it.audio_url) {
                      setAudioUrl(it.audio_url);
                      setPlayerOpen(true);
                    }
                  }}
                />
              ) : (
                <>
                  <div className="rounded-2xl border border-neutral-200 bg-white">
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-neutral-950">
                              Try Studio 3.0
                            </div>
                            <div className="truncate text-xs text-neutral-600">
                              Voiceovers, music, and SFX in one editor.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                          title="Dismiss"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Voice
                      </div>
                      <button
                        type="button"
                        className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-left hover:bg-neutral-50"
                        onClick={() => setVoicePickerOpen(true)}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-neutral-950">
                            {selectedVoice?.name ?? "Select voice"}
                          </div>
                          <div className="truncate text-xs text-neutral-500">
                            {selectedVoice?.style ?? ""}
                          </div>
                        </div>
                        <div className="text-neutral-400">›</div>
                      </button>
                      <div className="mt-2 text-xs text-neutral-500">
                        Or browse the full{" "}
                        <button
                          type="button"
                          className="font-semibold text-neutral-900 hover:underline"
                          onClick={() => router.push("/app/voices")}
                        >
                          voice library
                        </button>
                        .
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Model
                      </div>
                      <div className="mt-2 space-y-2">
                        {models.map((m) => {
                          const selected = modelId === m.id;
                          const disabled = m.badge === "Soon";
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                if (!disabled) setModelId(m.id);
                              }}
                              className={[
                                "w-full rounded-2xl border px-3 py-2 text-left transition",
                                selected
                                  ? "border-violet-200 bg-violet-50"
                                  : "border-neutral-200 bg-white hover:bg-neutral-50",
                                disabled
                                  ? "cursor-not-allowed opacity-60 hover:bg-white"
                                  : "",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-semibold text-neutral-950">
                                  {m.name}
                                </div>
                                {m.badge ? (
                                  <span
                                    className={[
                                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                      m.badge === "Fast"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-neutral-200 bg-neutral-50 text-neutral-500",
                                    ].join(" ")}
                                  >
                                    {m.badge}
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-xs text-neutral-600">
                                {m.desc}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 p-4">
                      <div className="space-y-4">
                        <Slider
                          label="Speed"
                          value={speed}
                          onChange={setSpeed}
                          left="Slower"
                          right="Faster"
                        />
                        <Slider
                          label="Stability"
                          value={stability}
                          onChange={setStability}
                          left="More variable"
                          right="More stable"
                        />
                        <Slider
                          label="Similarity"
                          value={similarity}
                          onChange={setSimilarity}
                          left="Low"
                          right="High"
                        />
                        <Slider
                          label="Style Exaggeration"
                          value={styleExaggeration}
                          onChange={setStyleExaggeration}
                          left="None"
                          right="Exaggerated"
                        />
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
                        <div>
                          <div className="text-sm font-semibold text-neutral-950">
                            Speaker boost
                          </div>
                          <div className="text-xs text-neutral-500">
                            Adds presence and clarity.
                          </div>
                        </div>
                        <button
                          type="button"
                          className={[
                            "relative h-6 w-11 rounded-full border transition",
                            speakerBoost
                              ? "border-neutral-950 bg-neutral-950"
                              : "border-neutral-200 bg-neutral-100",
                          ].join(" ")}
                          onClick={() => setSpeakerBoost((v) => !v)}
                          aria-pressed={speakerBoost}
                        >
                          <span
                            className={[
                              "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition",
                              speakerBoost ? "left-5" : "left-0.5",
                            ].join(" ")}
                          />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          onClick={() => {
                            setSpeed(0.5);
                            setStability(0.5);
                            setSimilarity(0.7);
                            setStyleExaggeration(0.2);
                            setSpeakerBoost(true);
                            setOutputFormat("audio-24khz-96kbitrate-mono-mp3");
                          }}
                        >
                          Reset values
                        </button>

                        <select
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 outline-none hover:bg-neutral-50"
                        >
                          <option value="audio-16khz-32kbitrate-mono-mp3">
                            Standard
                          </option>
                          <option value="audio-24khz-48kbitrate-mono-mp3">
                            Good
                          </option>
                          <option value="audio-24khz-96kbitrate-mono-mp3">
                            High
                          </option>
                          <option value="audio-48khz-96kbitrate-mono-mp3">
                            Ultra
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>

        <MiniPlayer
          text={text}
          audioUrl={audioUrl}
          status={status}
          playerOpen={playerOpen}
          onClosePlayer={() => setPlayerOpen(false)}
          voiceLabel={selectedVoice?.name ?? voiceId}
          voiceSubLabel={selectedVoice?.style ?? ""}
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
        />
        <VoicePicker
          open={voicePickerOpen}
          onClose={() => setVoicePickerOpen(false)}
          apiUrl={API_URL}
          authToken={authToken}
          selectedVoiceId={voiceId}
          onSelect={(id) => {
            setVoiceId(id);
            setVoicePickerOpen(false);
          }}
        />
    </div>
  );
}

function EditorBar({
  text,
  loading,
  onClear,
  onGenerate,
}: {
  text: string;
  loading: boolean;
  onClear: () => void;
  onGenerate: () => void;
}) {
  const chars = text.length;
  const maxChars = 5000;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-200 bg-white">
          ◌
        </span>
        <span>9,560 credits remaining</span>
      </div>

      <div className="text-xs text-neutral-500">
        {chars.toLocaleString()} / {maxChars.toLocaleString()} characters
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
          title="Download"
          disabled
        >
          ↓
        </button>
        <button
          type="button"
          className="rounded-2xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 disabled:opacity-60"
          disabled={loading || !text.trim()}
          onClick={onGenerate}
        >
          {loading ? "Regenerate speech" : "Generate speech"}
        </button>
        <button
          type="button"
          className="hidden rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 md:inline-flex"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function MiniPlayer({
  text,
  audioUrl,
  status,
  playerOpen,
  onClosePlayer,
  voiceLabel,
  voiceSubLabel,
  onDownload,
  onShare,
  shareCopied,
}: {
  text: string;
  audioUrl: string;
  status: string;
  playerOpen: boolean;
  onClosePlayer: () => void;
  voiceLabel: string;
  voiceSubLabel: string;
  onDownload: () => void;
  onShare: () => void;
  shareCopied: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Reset playback without triggering cascading renders; state will sync via events.
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // ignore
    }
  }, [audioUrl]);

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

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const previewText = (text || "").trim().replace(/\s+/g, " ");
  const title =
    previewText.length > 0
      ? previewText
      : "Start typing to generate lifelike speech…";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 md:left-[272px]">
      {shareCopied ? (
        <div className="pointer-events-none absolute inset-x-0 -top-10 flex justify-center">
          <div className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
            Copied link
          </div>
        </div>
      ) : null}
      {/* drawer */}
      <div
        className={[
          "w-full",
          audioUrl || (playerOpen && status)
            ? ""
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "bg-white border-t border-neutral-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all duration-500 ease-in-out",
            audioUrl
              ? "translate-y-0"
              : playerOpen
                ? "translate-y-0"
                : "translate-y-full",
          ].join(" ")}
        >
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid grid-cols-[320px_1fr_320px] items-center gap-8">
              {/* left: title + meta */}
              <div className="min-w-0">
                <div className="max-w-[320px] truncate text-[14px] font-semibold tracking-tight text-neutral-900">
                  {title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-500">
                    🌍
                  </span>
                  <span className="truncate">
                    {voiceLabel}
                    {voiceSubLabel ? ` - ${voiceSubLabel}` : ""}
                  </span>
                  <span className="mx-0.5 opacity-40">•</span>
                  <span className="shrink-0 opacity-80">
                    Created 1 second ago...
                  </span>
                </div>
              </div>

              {/* center: transport + progress */}
              <div className="flex flex-col items-center gap-2">
                {/* transport */}
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
                    <svg
                      height="1.1rem"
                      className="shrink-0 w-5 h-5"
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
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition hover:scale-105 active:scale-95 disabled:opacity-40"
                    onClick={() => {
                      const el = audioRef.current;
                      if (!el) return;
                      if (el.paused) el.play().catch(() => null);
                      else el.pause();
                    }}
                    disabled={!audioUrl}
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 translate-x-[1px]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
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
                    <svg
                      height="1.1rem"
                      className="shrink-0 w-5 h-5"
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
                  </button>
                </div>

                {/* progress bar */}
                <div className="flex w-full max-w-lg items-center gap-3">
                  <span className="min-w-[32px] text-left text-[11px] font-medium tabular-nums text-neutral-400">
                    {fmt(time.current)}
                  </span>
                  <div className="group relative flex-1 items-center">
                    <input
                      type="range"
                      min={0}
                      max={Math.max(1, time.duration || 0)}
                      step={0.01}
                      value={Math.min(time.current, time.duration || 0)}
                      onChange={(e) => {
                        const el = audioRef.current;
                        if (!el) return;
                        el.currentTime = Number(e.target.value);
                      }}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-950 transition-all group-hover:bg-neutral-300"
                      aria-label="Seek"
                      disabled={!audioUrl}
                    />
                  </div>
                  <span className="min-w-[32px] text-right text-[11px] font-medium tabular-nums text-neutral-400">
                    {fmt(time.duration || 0)}
                  </span>
                </div>
              </div>

              {/* right: actions */}
              <div className="flex items-center justify-end gap-6 min-w-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    disabled={!audioUrl}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    disabled={!audioUrl}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" />
                    </svg>
                  </button>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2 text-[13px] font-semibold text-neutral-900 transition hover:bg-neutral-50 shrink-0"
                  onClick={onShare}
                  disabled={!audioUrl}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    onClick={onDownload}
                    disabled={!audioUrl}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                    onClick={onClosePlayer}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* keep audio element for playback */}
            {audioUrl ? (
              <audio ref={audioRef} className="hidden" src={audioUrl} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  left,
  right,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  left: string;
  right: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-neutral-950">{label}</div>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-neutral-950"
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
