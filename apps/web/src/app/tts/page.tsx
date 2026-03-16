"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

export default function TtsPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [text, setText] = useState(
    "Welcome to VoiceAI Text-to-Speech. Transform your text into lifelike speech with our advanced AI technology."
  );
  const [voice, setVoice] = useState("en-US-AriaNeural");
  const [outputFormat, setOutputFormat] = useState(
    "audio-24khz-96kbitrate-mono-mp3"
  );
  const [audioUrl, setAudioUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

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

  async function onGenerate() {
    setLoading(true);
    setError("");
    setAudioUrl("");
    setJobId("");
    setStatus("");

    try {
      const res = await fetch(`${API_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice,
          output_format: outputFormat,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function pollJob(id: string) {
    const res = await fetch(`${API_URL}/tts/${id}`);
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
  }

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    let timer: NodeJS.Timeout | null = null;

    const tick = async () => {
      try {
        const done = await pollJob(jobId);
        if (!done && !cancelled) {
          timer = setTimeout(tick, 1500);
        }
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
  }, [jobId]);

  const voices = [
    { id: "en-US-AriaNeural", name: "Aria", lang: "English (US)", gender: "Female", color: "from-pink-500 to-rose-500" },
    { id: "en-US-GuyNeural", name: "Guy", lang: "English (US)", gender: "Male", color: "from-blue-500 to-cyan-500" },
    { id: "en-US-JennyNeural", name: "Jenny", lang: "English (US)", gender: "Female", color: "from-purple-500 to-pink-500" },
    { id: "en-US-DavisNeural", name: "Davis", lang: "English (US)", gender: "Male", color: "from-green-500 to-emerald-500" },
    { id: "en-GB-SoniaNeural", name: "Sonia", lang: "English (UK)", gender: "Female", color: "from-violet-500 to-purple-500" },
    { id: "en-GB-RyanNeural", name: "Ryan", lang: "English (UK)", gender: "Male", color: "from-orange-500 to-red-500" },
    { id: "ru-RU-SvetlanaNeural", name: "Svetlana", lang: "Russian", gender: "Female", color: "from-red-500 to-pink-500" },
    { id: "ru-RU-DmitryNeural", name: "Dmitry", lang: "Russian", gender: "Male", color: "from-blue-600 to-indigo-600" },
    { id: "uz-UZ-LazizNeural", name: "Laziz", lang: "Uzbek", gender: "Male", color: "from-green-500 to-emerald-500" },
    { id: "uz-UZ-MadinaNeural", name: "Madina", lang: "Uzbek", gender: "Female", color: "from-purple-500 to-pink-500" },
  ];

  const selectedVoice = voices.find((v) => v.id === voice) || voices[0];

  if (!authReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0b0d] via-[#0f1117] to-[#0a0b0d] text-white">
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">
          Checking access...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b0d] via-[#0f1117] to-[#0a0b0d] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-200 w-200 -translate-x-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),rgba(11,13,16,0))] blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-150 w-150 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),rgba(11,13,16,0))] blur-3xl delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-white/5 bg-[#0a0b0d]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
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
              VoiceAI Text-to-Speech
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/5">
              Projects
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/5"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main Editor */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-semibold text-white">
                  Text to Speech
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    {charCount} / 5000 characters
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Est. time:</span>
                    <span className="text-white font-medium">
                      {Math.ceil(charCount / 100)}s
                    </span>
                  </div>
                </div>
              </div>
              <textarea
                className="min-h-50 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setText(
                      "Welcome to VoiceAI Text-to-Speech. Transform your text into lifelike speech with our advanced AI technology."
                    )
                  }
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5"
                >
                  📝 Sample 1
                </button>
                <button
                  onClick={() =>
                    setText(
                      "The future of voice generation is here. Create professional audio content with just a few clicks."
                    )
                  }
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5"
                >
                  🎤 Sample 2
                </button>
                <button
                  onClick={() => setText("")}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-500/50 hover:bg-white/5"
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={() => {
                    const textArea = document.querySelector('textarea');
                    if (textArea) {
                      (textArea as HTMLTextAreaElement).select();
                      document.execCommand('copy');
                    }
                  }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-green-500/50 hover:bg-white/5"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
              <label className="mb-4 block text-sm font-semibold text-white">
                Select Voice
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {voices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`group rounded-xl border p-4 text-left transition ${
                      voice === v.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-black/20 hover:border-violet-500/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full bg-linear-to-br ${v.color}`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {v.name}
                        </div>
                        <div className="text-xs text-gray-400">{v.lang}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">
                        {v.gender}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">
                        Neural
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Settings */}
            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
              <label className="mb-4 block text-sm font-semibold text-white">
                Audio Quality
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: "audio-16khz-32kbitrate-mono-mp3",
                    label: "Standard",
                    desc: "16kHz • 32kbps",
                  },
                  {
                    value: "audio-24khz-48kbitrate-mono-mp3",
                    label: "Good",
                    desc: "24kHz • 48kbps",
                  },
                  {
                    value: "audio-24khz-96kbitrate-mono-mp3",
                    label: "High",
                    desc: "24kHz • 96kbps",
                  },
                  {
                    value: "audio-48khz-96kbitrate-mono-mp3",
                    label: "Ultra",
                    desc: "48kHz • 96kbps",
                  },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setOutputFormat(format.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      outputFormat === format.value
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-black/20 hover:border-violet-500/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="mb-1 text-sm font-semibold text-white">
                      {format.label}
                    </div>
                    <div className="text-xs text-gray-400">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={onGenerate}
                disabled={loading || !text.trim()}
                className="group relative overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate Voice
                    </>
                  )}
                </span>
                <div className="absolute inset-0 z-0 bg-linear-to-r from-violet-400 to-purple-400 opacity-0 transition group-hover:opacity-100" />
              </button>

              <button
                onClick={() => {
                  const textArea = document.querySelector('textarea');
                  if (textArea) {
                    (textArea as HTMLTextAreaElement).select();
                    document.execCommand('copy');
                  }
                }}
                className="rounded-xl border border-white/10 px-8 py-4 text-base font-semibold text-gray-200 transition hover:border-violet-500/50 hover:bg-white/5"
              >
                📋 Copy Text
              </button>
            </div>
          </div>

          {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Selection */}
              <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Current Selection
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-full bg-linear-to-br ${selectedVoice.color}`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {selectedVoice.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedVoice.lang}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality</span>
                      <span className="text-white">
                        {outputFormat.includes("48khz")
                          ? "Ultra"
                          : outputFormat.includes("24khz-96")
                          ? "High"
                          : outputFormat.includes("24khz-48")
                          ? "Good"
                          : "Standard"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Characters</span>
                      <span className="text-white">{charCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span
                        className={`${
                          status === "done"
                            ? "text-green-400"
                            : status === "failed"
                            ? "text-red-400"
                            : status === "processing"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        {status || "Ready"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      setText(
                        "Welcome to VoiceAI Text-to-Speech. Transform your text into lifelike speech with our advanced AI technology."
                      )
                    }
                    className="w-full rounded-lg border border-white/10 px-4 py-2 text-left text-xs text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5"
                  >
                    📝 Load Sample Text
                  </button>
                  <button
                    onClick={() => setText("")}
                    className="w-full rounded-lg border border-white/10 px-4 py-2 text-left text-xs text-gray-300 transition hover:border-red-500/50 hover:bg-white/5"
                  >
                    🗑️ Clear Text
                  </button>
                  <button
                    onClick={() => setVoice("en-US-AriaNeural")}
                    className="w-full rounded-lg border border-white/10 px-4 py-2 text-left text-xs text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5"
                  >
                    👩 Reset to Aria
                  </button>
                  <button
                    onClick={() => setOutputFormat("audio-24khz-96kbitrate-mono-mp3")}
                    className="w-full rounded-lg border border-white/10 px-4 py-2 text-left text-xs text-gray-300 transition hover:border-violet-500/50 hover:bg-white/5"
                  >
                    🎵 Set High Quality
                  </button>
                </div>
              </div>

            {/* Job Status */}
            {jobId && (
              <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Job Status
                </h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-black/30 p-3">
                    <div className="mb-1 text-xs text-gray-400">Job ID</div>
                    <div className="font-mono text-xs text-white">{jobId}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "done" ? (
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
                    ) : status === "failed" ? (
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 animate-spin text-violet-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    <span className="text-sm text-white capitalize">
                      {status || "Idle"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Error
                </div>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="rounded-2xl border border-green-500/30 bg-linear-to-br from-green-900/20 to-emerald-900/20 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Audio Ready
                </div>
                <audio
                  className="mb-4 w-full"
                  controls
                  src={audioUrl}
                  style={{
                    filter: "invert(1) hue-rotate(180deg)",
                  }}
                />
                <a
                  href={audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/10"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Audio
                </a>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-gray-900/50 to-gray-950/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-white">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Use punctuation for natural pauses</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Try different voices for variety</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Higher quality = larger file size</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Keep sentences clear and concise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
