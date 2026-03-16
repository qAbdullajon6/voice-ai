"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

const navItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Voices", href: "/dashboard#voices" },
  { label: "Files", href: "/dashboard#files" },
];

const playgroundItems = [
  { label: "Text to Speech", href: "/tts" },
  { label: "Voice Changer", href: "/dashboard#voice-changer", disabled: true },
  { label: "Voice Isolator", href: "/dashboard#voice-isolator", disabled: true },
  { label: "Sound Effects", href: "/dashboard#sound-effects", disabled: true },
  { label: "Music", href: "/dashboard#music", disabled: true },
  { label: "Image & Video", href: "/dashboard#image-video", disabled: true },
  { label: "Templates", href: "/dashboard#templates", disabled: true },
];

const productItems = [
  { label: "Studio", href: "/dashboard#studio", badge: "New", disabled: true },
  { label: "Audiobooks", href: "/dashboard#audiobooks", badge: "New", disabled: true },
  { label: "Flows", href: "/dashboard#flows", badge: "New", disabled: true },
  { label: "Dubbing", href: "/dashboard#dubbing", disabled: true },
  { label: "Speech to Text", href: "/dashboard#stt", disabled: true },
];

const quickLaunch = [
  {
    title: "Instant speech",
    desc: "Generate TTS from text",
    href: "/tts",
    accent: "from-violet-500 to-purple-600",
  },
  {
    title: "Audiobook",
    desc: "Long-form narration workflow",
    href: "/dashboard#audiobook",
    accent: "from-rose-500 to-orange-500",
    disabled: true,
  },
  {
    title: "Image & Video",
    desc: "Script audio for visuals",
    href: "/dashboard#image-video",
    accent: "from-emerald-500 to-teal-500",
    disabled: true,
  },
  {
    title: "Voice Agents",
    desc: "Agentic conversational flows",
    href: "/dashboard#agents",
    accent: "from-blue-500 to-cyan-500",
    disabled: true,
  },
  {
    title: "Music",
    desc: "Generate music beds",
    href: "/dashboard#music",
    accent: "from-amber-500 to-yellow-500",
    disabled: true,
  },
  {
    title: "Dubbed video",
    desc: "Localize media at scale",
    href: "/dashboard#dubbing",
    accent: "from-fuchsia-500 to-pink-500",
    disabled: true,
  },
];

const projects = [
  {
    name: "Product intro v1",
    category: "Text to Speech",
    updated: "2 hours ago",
  },
  {
    name: "Podcast trailer",
    category: "Audiobook",
    updated: "Yesterday",
  },
  {
    name: "Uzbek ad spot",
    category: "Instant speech",
    updated: "3 days ago",
  },
  {
    name: "Mobile app onboarding",
    category: "Voice design",
    updated: "Last week",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

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
    <div className="min-h-screen bg-[#f6f6f7] text-[#111318]">
      <div className="flex min-h-screen">
        <aside className="w-[260px] border-r border-[#ececf0] bg-white px-4 py-6">
          <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <span className="h-9 w-9 rounded-xl bg-[#111318] text-white grid place-items-center">
              V
            </span>
            VoiceAI
          </div>

          <div className="mb-6 rounded-2xl border border-[#ececf0] px-3 py-2">
            <div className="text-xs text-[#7a7f89]">Workspace</div>
            <div className="flex items-center justify-between text-sm font-medium">
              ElevenCreative
              <span className="text-[#7a7f89]">?</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa0aa]">
                Main
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#2a2f36] hover:bg-[#f4f4f6]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#c9ccd3]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa0aa]">
                Playground
              </div>
              <div className="space-y-1">
                {playgroundItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${
                      item.disabled
                        ? "text-[#b6bac3] cursor-not-allowed"
                        : "text-[#2a2f36] hover:bg-[#f4f4f6]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.disabled ? (
                      <span className="rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] text-[#9aa0aa]">
                        Soon
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa0aa]">
                Products
              </div>
              <div className="space-y-1">
                {productItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${
                      item.disabled
                        ? "text-[#b6bac3] cursor-not-allowed"
                        : "text-[#2a2f36] hover:bg-[#f4f4f6]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] text-[#6f7581]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-[#ececf0] bg-white px-8 py-4">
            <div className="text-sm font-semibold">Home</div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-[#ececf0] px-4 py-2 text-xs font-medium">
                Feedback
              </button>
              <button className="rounded-full border border-[#ececf0] px-4 py-2 text-xs font-medium">
                Docs
              </button>
              <button className="rounded-full border border-[#ececf0] px-4 py-2 text-xs font-medium">
                Ask
              </button>
              <div className="h-9 w-9 rounded-full bg-[#111318] text-white grid place-items-center text-xs">
                A
              </div>
            </div>
          </header>

          <section className="px-8 py-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-[#111318] px-3 py-1 text-xs font-medium text-white">
                New
              </span>
              <span className="text-sm text-[#4c515b]">
                Introducing Flows
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-[#7a7f89]">My Workspace</p>
              <h1 className="text-3xl font-semibold">Good morning, Boy</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickLaunch.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex min-h-[160px] flex-col justify-between rounded-3xl border border-[#ececf0] bg-white p-5 shadow-sm transition ${
                    item.disabled
                      ? "cursor-not-allowed opacity-60"
                      : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl bg-linear-to-br ${item.accent} text-white grid place-items-center text-lg font-semibold`}
                  >
                    ?
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-xs text-[#7a7f89]">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl border border-[#ececf0] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent projects</h2>
                  <button className="text-xs font-medium text-[#7a7f89]">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.name}
                      className="flex items-center justify-between rounded-2xl border border-[#f0f1f4] px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold">
                          {project.name}
                        </div>
                        <div className="text-xs text-[#7a7f89]">
                          {project.category}
                        </div>
                      </div>
                      <div className="text-xs text-[#9aa0aa]">
                        {project.updated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#ececf0] bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Create or clone a voice
                </h2>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#f0f1f4] p-4">
                    <div className="text-sm font-semibold">Voice Design</div>
                    <div className="text-xs text-[#7a7f89]">
                      Design a new voice from a text prompt.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#f0f1f4] p-4">
                    <div className="text-sm font-semibold">Clone your voice</div>
                    <div className="text-xs text-[#7a7f89]">
                      Create a realistic digital clone of your voice.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
