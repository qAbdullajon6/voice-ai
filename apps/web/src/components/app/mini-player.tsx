"use client";

import * as React from "react";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function ChevronDown({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type MiniPlayerItem = {
  title: string;
  hue: number;
  rotate: number;
  audioSrc: string;
  languageLabel?: string;
};

export function MiniPlayer({
  item,
  onClose,
}: {
  item: MiniPlayerItem | null;
  onClose: () => void;
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [seeking, setSeeking] = React.useState<number | null>(null);

  const src = item?.audioSrc ?? "";

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    setDuration(0);
    setCurrentTime(0);
    setSeeking(null);

    audio.src = src;
    audio.load();

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [src]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const visible = Boolean(item);
  const effectiveTime = seeking ?? currentTime;
  const progress = duration > 0 ? Math.min(1, Math.max(0, effectiveTime / duration)) : 0;

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      audio.pause();
    }
  }

  function seekTo(next: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration || 0, next));
  }

  function nudge(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    seekTo((audio.currentTime || 0) + delta);
  }

  function download() {
    if (!item?.audioSrc) return;
    const a = document.createElement("a");
    a.href = item.audioSrc;
    a.download = "preview.mp3";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div
      data-testid="audio-player"
      className={[
        "fixed bottom-0 z-40 w-full pr-0 transition-[width] duration-150",
        "max-md:w-full! max-md:[--eleven-sidebar-width:0rem]",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      style={{ width: "calc(100% - var(--eleven-sidebar-width, 0rem))" }}
    >
      <audio ref={audioRef} hidden />

      <div
        className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        aria-label="audio player"
        role="region"
      >
        <div className="relative flex h-20 items-center gap-6 px-4">
          {/* Left: title + language */}
          <div className="hidden min-w-0 flex-1 flex-col justify-center gap-1 overflow-hidden md:flex md:basis-1/4">
            {item ? (
              <div className="flex w-full flex-col items-start gap-1">
                <span className="flex max-w-full items-center gap-1.5">
                  <span className="inline-block align-middle">
                    <div
                      className="relative overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
                      style={{ width: "1rem", minWidth: "1rem", height: "1rem", minHeight: "1rem" }}
                    >
                      <div
                        className="h-full w-full bg-linear-to-br from-violet-400 via-fuchsia-500 to-orange-400"
                        style={{
                          filter: `hue-rotate(${item.hue}deg) saturate(120%)`,
                          transform: `rotate(${item.rotate}deg)`,
                        }}
                      />
                    </div>
                  </span>
                  <p className="block max-w-full truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </p>
                </span>

                <button
                  type="button"
                  className="flex items-center justify-between rounded-[8px] border border-neutral-200 bg-white/80 p-1 py-[0.2rem] pl-1.5 text-neutral-800 hover:bg-white/70 active:bg-white/70 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-900/60"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">{item.languageLabel ?? "English preview"}</span>
                  </div>
                  <ChevronDown className="ml-2.5 mr-0.5 h-3 w-3 min-w-fit" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Center: controls + slider */}
          <div className="flex min-w-0 flex-1 flex-col justify-center md:basis-1/2">
            <div className="flex items-center justify-between gap-2 px-2">
              <div className="hidden grow md:block md:w-12" />

              <div className="hidden items-center gap-2 md:inline-flex">
                <button
                  type="button"
                  aria-label="Rewind 10 seconds"
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 md:flex"
                  onClick={() => nudge(-10)}
                >
                  <span className="text-xs font-semibold">-10</span>
                </button>

                <button
                  type="button"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 translate-x-[5%]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
                  aria-label="Fast-forward 10 seconds"
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 md:flex"
                  onClick={() => nudge(10)}
                >
                  <span className="text-xs font-semibold">+10</span>
                </button>
              </div>

              <div className="hidden grow md:inline-flex md:w-12 md:justify-end" />
            </div>

            <div className="mt-2 flex w-full items-center gap-2 max-md:absolute max-md:left-0 max-md:right-0 max-md:top-0">
              <span className="hidden w-12 whitespace-nowrap rounded-md px-1 py-0.5 text-center text-xs leading-6 tabular-nums text-slate-500 md:block">
                {formatTime(effectiveTime)}
              </span>

              <div className="relative flex w-full select-none items-center">
                <div className="relative h-0.5 w-full overflow-hidden bg-neutral-200 max-md:rounded-none md:h-1 md:rounded-full dark:bg-neutral-800">
                  <div className="absolute h-full w-full bg-neutral-200 dark:bg-neutral-800" />
                  <div
                    className="absolute h-full bg-black max-md:rounded-l-none md:rounded-full"
                    style={{ left: 0, width: `${progress * 100}%` }}
                  />
                </div>
                <input
                  aria-label="Seek"
                  type="range"
                  min={0}
                  max={Math.max(0, duration)}
                  step={0.01}
                  value={seeking ?? currentTime}
                  onChange={(e) => setSeeking(Number(e.target.value))}
                  onMouseUp={() => {
                    if (seeking != null) {
                      seekTo(seeking);
                      setSeeking(null);
                    }
                  }}
                  onTouchEnd={() => {
                    if (seeking != null) {
                      seekTo(seeking);
                      setSeeking(null);
                    }
                  }}
                  className="absolute inset-0 h-6 w-full cursor-pointer opacity-0"
                />
                <div
                  className={[
                    "pointer-events-none absolute -top-1.5 h-2.5 w-2.5 rounded-full",
                    "bg-neutral-900 opacity-0 transition-opacity group-hover:opacity-100",
                    "dark:bg-neutral-100",
                    seeking != null ? "opacity-100" : "",
                  ].join(" ")}
                  style={{ left: `calc(${progress * 100}% - 5px)` }}
                />
              </div>

              <span className="hidden w-12 whitespace-nowrap rounded-md px-1 py-0.5 text-center text-xs leading-6 tabular-nums text-slate-500 md:block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: actions + mobile play */}
          <div className="flex items-center justify-end gap-2 md:basis-1/4">
            <button
              type="button"
              aria-label="Download Audio"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
              onClick={download}
              disabled={!item}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M8.66677 1.99986C8.66677 1.63167 8.36829 1.33319 8.0001 1.33319C7.63191 1.33319 7.33344 1.63167 7.33344 1.99986V8.39038L5.13817 6.19512C4.87782 5.93477 4.45571 5.93477 4.19536 6.19512C3.93501 6.45547 3.93501 6.87758 4.19536 7.13793L7.5287 10.4713C7.78905 10.7316 8.21116 10.7316 8.47151 10.4713L11.8048 7.13793C12.0652 6.87758 12.0652 6.45547 11.8048 6.19512C11.5445 5.93477 11.1224 5.93477 10.862 6.19512L8.66677 8.39038V1.99986Z"
                  fill="currentColor"
                />
                <path
                  d="M2.0001 9.33319C2.36829 9.33319 2.66677 9.63167 2.66677 9.99986V12.6665C2.66677 12.8433 2.73701 13.0129 2.86203 13.1379C2.98705 13.263 3.15662 13.3332 3.33344 13.3332H12.6668C12.8436 13.3332 13.0131 13.263 13.1382 13.1379C13.2632 13.0129 13.3334 12.8433 13.3334 12.6665V9.99986C13.3334 9.63167 13.6319 9.33319 14.0001 9.33319C14.3683 9.33319 14.6668 9.63167 14.6668 9.99986V12.6665C14.6668 13.197 14.4561 13.7057 14.081 14.0807C13.7059 14.4558 13.1972 14.6665 12.6668 14.6665H3.33344C2.803 14.6665 2.29429 14.4558 1.91922 14.0807C1.54415 13.7057 1.33344 13.197 1.33344 12.6665V9.99986C1.33344 9.63167 1.63191 9.33319 2.0001 9.33319Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div className="ml-2 flex items-center md:hidden">
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 translate-x-[5%]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="hidden md:flex">
              <button
                type="button"
                aria-label="Hide player"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-transparent bg-white text-neutral-900 hover:bg-neutral-100 active:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  audioRef.current?.pause();
                  onClose();
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

