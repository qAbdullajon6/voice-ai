"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  SvgAudiobook,
  SvgCloneVoice,
  SvgDubbedVideo,
  SvgElevenAgents,
  SvgImageVideo,
  SvgInstantSpeech,
  SvgMusic,
  SvgVoiceCollections,
  SvgVoiceDesign,
} from "./home-illustrations";
import { useMiniPlayer } from "../../components/app/mini-player-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

const latestFromLibrary = [
  {
    title: "Jessica Anne Bogart - Chatty and Friendly",
    subtitle:
      "Jessica Anne Bogart - Conversations - Friendly and Conversational Female voice. Articulate, Confident and Helpful. Works well for Conversations.",
    hue: 349,
    rotate: 349,
    audioSrc:
      "https://storage.googleapis.com/eleven-public-prod/custom/voices/XfNU2rGpBa01ckF309OY/kuFJZI5s8GbgYm5f0hMo.mp3",
  },
  {
    title: "Kimberly - Warm, Calm & Natural Narrator",
    subtitle:
      "A warm, calm narrative voice with a steady, reassuring cadence. Ideal for long-form storytelling, audiobooks, educational content, and gentle children's stories. Clear, expressive without being dramatic, and well-suited for projects that require consistency, trust, and an engaging human presence.",
    hue: 98,
    rotate: 98,
    audioSrc:
      "https://storage.googleapis.com/eleven-public-prod/custom/voices/XfNU2rGpBa01ckF309OY/kuFJZI5s8GbgYm5f0hMo.mp3",
  },
  {
    title: "Clancy - Viral Long-Form Storyteller",
    subtitle:
      "Clancy's voice thrives in the world of modern social content—built for Social Media, and anywhere attention is currency. It carries confidence without sounding stiff, energy without sounding forced. Clancy delivers lines with sharp timing, clear emphasis, and a natural rhythm that makes hooks hit harder and jokes land cleaner. Whether it's fast cuts, punchy captions, or high-retention storytelling, this voice is tuned for momentum. If you're trying to go viral, Clancy is for you.",
    hue: 264,
    rotate: 264,
    audioSrc:
      "https://storage.googleapis.com/eleven-public-prod/custom/voices/XfNU2rGpBa01ckF309OY/kuFJZI5s8GbgYm5f0hMo.mp3",
  },
  {
    title: "Frankie - Friendly Instructor",
    subtitle:
      "Clear tutorials. Helpful training. Educational content with a vibe like your favorite teacher ever. Fun for training videos and explainers audiobooks. Confident, encouraging and approachable. American female voice by Miss Frankie. Western United States, Utah accent.",
    hue: 294,
    rotate: 294,
    audioSrc:
      "https://storage.googleapis.com/eleven-public-prod/custom/voices/XfNU2rGpBa01ckF309OY/kuFJZI5s8GbgYm5f0hMo.mp3",
  },
  {
    title: "Dr. Lovejoy - Soft Whispering ASMR",
    subtitle:
      "Dr Lovejoy - Pro Whisper ASMR  - Dr. Lovejoy famous erotic audio artist whisper ASMR, breathy and seductive.  ",
    hue: 0,
    rotate: 0,
    audioSrc:
      "https://storage.googleapis.com/eleven-public-prod/custom/voices/XfNU2rGpBa01ckF309OY/kuFJZI5s8GbgYm5f0hMo.mp3",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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

export default function DashboardPage() {
  const router = useRouter();
  const reactId = useId().replace(/:/g, "");
  const [authReady, setAuthReady] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [authToken, setAuthToken] = useState("");
  const { open: openMiniPlayer } = useMiniPlayer();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
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

  // History fetch removed here; MiniPlayer is global now.

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500">
        Checking access...
      </div>
    );
  }

  const displayName = userName || "there";
  const uid = (i: number) => `${reactId}-${i}`;

  const homeCards: {
    label: string;
    href: string;
    disabled?: boolean;
    Svg: ComponentType<{ uid: string }>;
  }[] = [
    { label: "Instant speech", href: "/app/text-to-speech", Svg: SvgInstantSpeech },
    { label: "Audiobook", href: "/app/audiobooks", disabled: true, Svg: SvgAudiobook },
    { label: "Image & Video", href: "/app/image-video", disabled: true, Svg: SvgImageVideo },
    { label: "ElevenAgents", href: "/app/flows", Svg: SvgElevenAgents },
    { label: "Music", href: "/app/music", disabled: true, Svg: SvgMusic },
    { label: "Dubbed video", href: "/app/dubbing", disabled: true, Svg: SvgDubbedVideo },
  ];

  return (
    <main className="relative mx-auto w-full max-w-6xl pb-8">
      {/* Top: Flows pill (tema — headerdagi tugma) */}
      <div className="mb-4 flex max-w-full items-center justify-start gap-4 md:mb-8">
        <Link
          href="/app/flows"
          className="group relative flex min-w-0 max-w-full items-center rounded-full border border-neutral-200 bg-neutral-100 p-1.5 text-sm text-neutral-900 shadow-sm transition duration-200 hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className="flex max-w-full items-center gap-2 rounded-full">
            <div className="mr-2 shrink-0 rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-950">
              New
            </div>
            <span className="truncate pr-1 font-medium">Introducing Flows</span>
            <span className="shrink-0 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5">
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-4 md:mb-6">
        <p className="min-h-[20px] truncate text-sm font-medium text-neutral-500 dark:text-neutral-400">
          My Workspace
        </p>
        <h1 className="line-clamp-1 min-h-[30px] text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 md:text-3xl">
          {getGreeting()}, {displayName}
        </h1>
      </div>

      {/* 6 square cards — ElevenLabs grid + hover */}
      <div className="mb-8 grid grid-cols-2 gap-x-3 gap-y-6 min-[400px]:grid-cols-3 md:mb-12 md:grid-cols-6 md:gap-3">
        {homeCards.map((card, i) => {
          const inner = (
            <div className="flex w-full max-w-[180px] flex-col items-center gap-2">
              <div className="relative w-full flex-1 overflow-hidden rounded-[20px] bg-neutral-100 outline-none transition-colors duration-200 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                <div className="relative w-full pb-[100%]" />
                <div className="absolute inset-0 flex items-center justify-center [&_svg]:max-w-[90%] dark:[&_svg]:hue-rotate-180 dark:[&_svg]:invert dark:[&_svg]:mix-blend-plus-lighter">
                  <card.Svg uid={uid(i)} />
                </div>
              </div>
              <p className="text-center text-xs font-medium text-neutral-950 dark:text-neutral-100 sm:text-sm">
                {card.label}
              </p>
            </div>
          );
          if (card.disabled) {
            return (
              <div
                key={card.label}
                className="group flex cursor-not-allowed flex-col items-center opacity-60 outline-none"
                aria-disabled
              >
                {inner}
              </div>
            );
          }
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group flex flex-col items-center rounded-[20px] outline-none focus-visible:ring-[1.5px] focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950"
            >
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Library + Create */}
      <div className="mb-12 grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
            Latest from the library
          </p>
          <ul className="mb-2 list-none space-y-0 p-0">
            {latestFromLibrary.map((v) => (
              <li
                key={v.title}
                className="group relative flex cursor-pointer items-center gap-3 border-b border-neutral-100 py-3 transition-colors duration-75 last:border-0 hover:bg-neutral-50/80 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
                onClick={() =>
                  openMiniPlayer({
                    title: v.title,
                    hue: v.hue,
                    rotate: v.rotate,
                    audioSrc: v.audioSrc,
                    languageLabel: "English preview",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openMiniPlayer({
                      title: v.title,
                      hue: v.hue,
                      rotate: v.rotate,
                      audioSrc: v.audioSrc,
                      languageLabel: "English preview",
                    });
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative shrink-0" style={{ width: "2rem", height: "2rem" }}>
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-full w-full rounded-full bg-linear-to-br from-violet-400 via-fuchsia-500 to-orange-400"
                      style={{
                        filter: `hue-rotate(${v.hue}deg) saturate(120%)`,
                        transform: `rotate(${v.rotate}deg)`,
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-100 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M8.38 3.69C7.05 2.87 5.33 3.82 5.33 5.39v9.22c0 1.57 1.72 2.52 3.05 1.7l7.47-4.61c1.27-.78 1.27-2.62 0-3.4L8.38 3.69z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 max-w-sm text-sm font-semibold text-neutral-950 dark:text-neutral-100">
                    {v.title}
                  </p>
                  <p className="line-clamp-1 max-w-xl text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    {v.subtitle}
                  </p>
                </div>
                <div className="hidden shrink-0 gap-2 group-hover:flex">
                  <Link
                    href="/app/voices"
                    className="h-8 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-medium leading-8 text-neutral-900 shadow-none hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/app/voices" tabIndex={-1}>
            <span className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700">
              Explore Library
            </span>
          </Link>
        </div>

        <div>
          <p className="mb-3 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
            Create or clone a voice
          </p>
          <div className="flex flex-col gap-2">
            {[
              {
                title: "Voice Design",
                desc: "Design an entirely new voice from a text prompt",
                href: "/app/voices",
                illust: <SvgVoiceDesign />,
              },
              {
                title: "Clone your Voice",
                desc: "Create a realistic digital clone of your voice",
                href: "/app/voices",
                illust: <SvgCloneVoice />,
              },
              {
                title: "Voice Collections",
                desc: "Curated AI voices for every use case",
                href: "/app/voices",
                illust: <SvgVoiceCollections uid={uid(99)} />,
              },
            ].map((row) => (
              <div key={row.title} className="@container group relative min-h-[92px] w-full">
                <div className="relative flex min-h-[92px] h-full w-full items-center gap-4 rounded-2xl bg-transparent p-1.5 transition duration-200">
                  <div className="relative block min-w-[122px] max-w-[122px] shrink-0 flex-1 overflow-hidden rounded-2xl bg-neutral-100 transition-all duration-200 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                    <div className="relative w-full pb-[75%]" />
                    <div className="absolute inset-0 flex items-center justify-center [&_svg]:max-w-[90%] dark:[&_svg]:hue-rotate-180 dark:[&_svg]:invert dark:[&_svg]:mix-blend-plus-lighter">
                      {row.illust}
                    </div>
                  </div>
                  <div className="min-w-0 shrink text-left">
                    <p className="text-sm font-medium text-neutral-950 dark:text-neutral-100">{row.title}</p>
                    <p className="mt-0.5 text-sm font-normal text-neutral-500 dark:text-neutral-400">{row.desc}</p>
                  </div>
                  <Link
                    href={row.href}
                    aria-label={row.title}
                    className="absolute inset-0 rounded-3xl outline-none focus-visible:ring-[1.5px] focus-visible:ring-neutral-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
