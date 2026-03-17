"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type RecentFile = {
  id: string;
  text: string;
  voice_id: string | null;
  status: string;
  created_at: string;
  audio_url: string | null;
};

const quickLaunch = [
  {
    title: "Instant speech",
    desc: "Generate TTS from text",
    href: "/app/text-to-speech",
    icon: "✦",
  },
  {
    title: "Audiobook",
    desc: "Long-form narration workflow",
    href: "/app/audiobooks",
    disabled: true,
    icon: "≋",
  },
  {
    title: "Image & Video",
    desc: "Script audio for visuals",
    href: "/dashboard/image-video",
    disabled: true,
    icon: "▦",
  },
  {
    title: "Music",
    desc: "Generate music beds",
    href: "/app/music",
    disabled: true,
    icon: "♫",
  },
  {
    title: "Dubbed video",
    desc: "Localize media at scale",
    href: "/app/dubbing",
    disabled: true,
    icon: "⫷⫸",
  },
];

const latestFromLibrary = [
  {
    title: "Grandma Rachel - Wise Southern Senior",
    subtitle: "Grandma Rachel • Old Lady Storyteller • Narrator",
  },
  {
    title: "Dr. Lovejoy - Soft Whispering ASMR",
    subtitle: "Dr. Lovejoy • Pro Whisper ASMR",
  },
  {
    title: "David Castlemore - Newsreader and Educator",
    subtitle: "David Castlemore • Newsreader",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // avoid setState-in-effect lint; token is stable per mount
    queueMicrotask(() => setAuthToken(token));

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json().catch(() => null);
        if (data?.name && typeof data.name === "string") {
          setUserName(data.name);
        }
        setAuthReady(true);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        router.replace("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!authToken || !authReady) return;

    const url = new URL(`${API_URL}/tts/history`);
    url.searchParams.set("limit", "3");

    fetch(url.toString(), {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.items) {
          setRecentFiles(data.items.slice(0, 3));
        }
      })
      .catch(() => {
        // Silently fail for dashboard, don't break page
      });
  }, [authToken, authReady]);

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
    <div className="space-y-8">
        <div>
          <div className="text-sm text-neutral-500">My Workspace</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
            {userName ? `${getGreeting()}, ${userName}` : getGreeting()}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLaunch.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
              }}
              className={[
                "group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                item.disabled ? "cursor-not-allowed opacity-60 hover:translate-y-0" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-neutral-200 bg-neutral-50 text-lg text-neutral-900">
                  {item.icon}
                </div>
                {item.disabled ? (
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                    Soon
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    Launch
                  </span>
                )}
              </div>
              <div className="mt-4 text-sm font-semibold text-neutral-950">{item.title}</div>
              <div className="mt-1 text-xs text-neutral-500">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-950">
                {recentFiles.length > 0 ? "Recent Generations" : "No Generations Yet"}
              </div>
              {recentFiles.length > 0 && (
                <Link href="/app/files" className="text-xs font-semibold text-violet-700 hover:text-violet-800">
                  See all →
                </Link>
              )}
            </div>
            {recentFiles.length > 0 ? (
              <div className="mt-4 space-y-3">
                {recentFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => router.push(`/app/text-to-speech?voice=${file.voice_id || ""}&text=${encodeURIComponent(file.text || "")}`)}
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-left hover:bg-neutral-50 transition"
                  >
                    <div className="truncate text-sm font-semibold text-neutral-950">
                      {file.text || "Untitled"}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          file.status === "done"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : file.status === "processing"
                              ? "border border-blue-200 bg-blue-50 text-blue-700"
                              : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {file.status}
                      </span>
                      <span>•</span>
                      <span>{new Date(file.created_at).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
                <div className="text-sm text-neutral-600">
                  Generate your first TTS clip to get started
                </div>
                <Link
                  href="/app/text-to-speech"
                  className="mt-3 inline-block rounded-lg bg-neutral-950 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-900"
                >
                  Generate Now
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-950">
                Featured Voices
              </div>
              <Link href="/app/voices" className="text-xs font-semibold text-violet-700 hover:text-violet-800">
                Browse all →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {latestFromLibrary.map((v) => (
                <button
                  key={v.title}
                  onClick={() => router.push("/app/voices")}
                  className="w-full text-left rounded-xl border border-neutral-200 bg-white p-3 hover:bg-neutral-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-neutral-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-neutral-950">
                        {v.title}
                      </div>
                      <div className="truncate text-xs text-neutral-500">
                        {v.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
  );
}
