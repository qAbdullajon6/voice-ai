"use client";

import * as React from "react";
import { Sheet } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { Tabs } from "../ui/tabs";

type AzureVoice = {
  Name: string;
  ShortName: string;
  Gender: string;
  Locale: string;
  LocaleName?: string;
  DisplayName?: string;
  LocalName?: string;
  VoiceType?: string;
  StyleList?: string[];
};

export function VoicePicker({
  open,
  onClose,
  apiUrl,
  authToken,
  selectedVoiceId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  apiUrl: string;
  authToken: string;
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
}) {
  const [tab, setTab] = React.useState<"explore" | "my" | "default">("explore");
  const [q, setQ] = React.useState("");
  const [locale, setLocale] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [voiceType, setVoiceType] = React.useState("");
  const [style, setStyle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState<AzureVoice[]>([]);
  const [facets, setFacets] = React.useState<{ locales: string[]; genders: string[] }>({
    locales: [],
    genders: [],
  });
  const [previewing, setPreviewing] = React.useState<string>("");
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const previewAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const previewText =
    "Hi! This is a short preview. Choose the voice that feels most natural for your project.";

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const url = new URL(`${apiUrl}/voices`);
        if (q.trim()) url.searchParams.set("q", q.trim());
        if (locale) url.searchParams.set("locale", locale);
        if (gender) url.searchParams.set("gender", gender);
        if (voiceType) url.searchParams.set("voiceType", voiceType);
        if (style) url.searchParams.set("style", style);
        const res = await fetch(url.toString(), {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (cancelled) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
        setFacets(data?.facets ?? { locales: [], genders: [] });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load voices");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [open, q, locale, gender, voiceType, style, apiUrl, authToken]);

  React.useEffect(() => {
    if (!open) return;
    setPreviewUrl("");
    setPreviewing("");
  }, [open]);

  const runPreview = async (voiceId: string) => {
    if (!authToken) {
      setError("Login required to preview voices.");
      return;
    }
    setPreviewing(voiceId);
    setError("");
    setPreviewUrl("");
    try {
      const res = await fetch(`${apiUrl}/tts/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          text: previewText,
          voice: voiceId,
          output_format: "audio-24khz-96kbitrate-mono-mp3",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const id = String(data?.id ?? "");
      if (!id) throw new Error("No preview id returned");

      // Poll existing /tts/:id endpoint until audio is ready.
      const start = Date.now();
      while (Date.now() - start < 25_000) {
        const r = await fetch(`${apiUrl}/tts/${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        if (j?.status === "failed") throw new Error(j?.error || "Preview failed");
        if (j?.status === "done" && j?.url) {
          setPreviewUrl(String(j.url));
          window.setTimeout(() => {
            previewAudioRef.current?.play().catch(() => null);
          }, 0);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setPreviewing("");
    }
  };

  if (!open) return null;

  return (
    <Sheet open={open} onClose={onClose} title="Select a voice">
      <div className="p-4">
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          items={[
            { id: "explore", label: "Explore" },
            { id: "my", label: "My Voices", disabled: true },
            { id: "default", label: "Default", disabled: true },
          ]}
        />

        <div className="mt-3 flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Start typing to search..."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <option value="">Languages</option>
            {facets.locales.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <option value="">Gender</option>
            {facets.genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={voiceType}
            onChange={(e) => setVoiceType(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <option value="">Voice type</option>
            {Array.from(new Set(items.map((v) => v.VoiceType).filter(Boolean) as string[]))
              .sort()
              .map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <option value="">Style</option>
            {Array.from(
              new Set(
                items
                  .flatMap((v) => (Array.isArray(v.StyleList) ? v.StyleList : []))
                  .filter(Boolean),
              ),
            )
              .sort()
              .slice(0, 80)
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            onClick={() => {
              setLocale("");
              setGender("");
              setVoiceType("");
              setStyle("");
              setQ("");
            }}
          >
            Reset
          </button>
        </div>

        {error ? (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="h-[calc(100%-230px)] overflow-auto px-2 pb-6">
          {loading ? (
            <div className="space-y-2 px-3 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-2"
                >
                  <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-1/3 bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-6 text-sm text-neutral-500">No voices found.</div>
          ) : (
            <div className="space-y-1">
              {items.slice(0, 150).map((v) => {
                const id = v.ShortName;
                const active = id === selectedVoiceId;
                return (
                  <div
                    key={id}
                    className={[
                      "flex w-full items-start gap-3 rounded-2xl px-3 py-2 text-left transition",
                      active ? "bg-violet-50" : "hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-neutral-200" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-neutral-950">
                          {v.DisplayName ?? v.LocalName ?? v.ShortName}
                        </div>
                        <div className="truncate text-xs text-neutral-500">
                          {v.Locale} • {String(v.Gender ?? "").toLowerCase()}
                          {v.VoiceType ? ` • ${v.VoiceType}` : ""}
                        </div>
                        {Array.isArray(v.StyleList) && v.StyleList.length ? (
                          <div className="mt-1 truncate text-[11px] text-neutral-400">
                            Styles: {v.StyleList.slice(0, 4).join(", ")}
                          </div>
                        ) : null}
                      </div>
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => runPreview(id)}
                        disabled={Boolean(previewing)}
                        className={[
                          "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                          previewing === id
                            ? "border-violet-200 bg-violet-50 text-violet-700"
                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                        ].join(" ")}
                        title="Preview"
                      >
                        {previewing === id ? "..." : "Preview"}
                      </button>
                      <div className="text-neutral-400">›</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
      {previewUrl ? (
        <div className="border-t border-neutral-200 bg-white px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Preview
          </div>
          <audio ref={previewAudioRef} className="mt-2 w-full" controls src={previewUrl} />
        </div>
      ) : null}
    </Sheet>
  );
}

