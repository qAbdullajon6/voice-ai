"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type AzureVoice = {
  ShortName: string;
  DisplayName?: string;
  LocalName?: string;
  Locale: string;
  Gender: string;
  VoiceType?: string;
  StyleList?: string[];
};

export default function VoicesPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [query, setQuery] = useState("");
  const [locale, setLocale] = useState("");
  const [gender, setGender] = useState("");
  const [voiceType, setVoiceType] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<AzureVoice[]>([]);
  const [facets, setFacets] = useState<{
    locales: string[];
    genders: string[];
    voiceTypes: string[];
    styles: string[];
  }>({ locales: [], genders: [], voiceTypes: [], styles: [] });

  const [previewing, setPreviewing] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthToken(token);
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

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = new URL(`${API_URL}/voices`);
      if (query.trim()) url.searchParams.set("q", query.trim());
      if (locale) url.searchParams.set("locale", locale);
      if (gender) url.searchParams.set("gender", gender);
      if (voiceType) url.searchParams.set("voiceType", voiceType);
      if (style) url.searchParams.set("style", style);
      const res = await fetch(url.toString(), {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
      setFacets(
        data?.facets ?? { locales: [], genders: [], voiceTypes: [], styles: [] },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load voices");
    } finally {
      setLoading(false);
    }
  }, [authToken, gender, locale, query, style, voiceType]);

  useEffect(() => {
    if (!authReady) return;
    load();
  }, [authReady, load]);

  const previewText = useMemo(
    () =>
      "Hi! This is a short preview. Choose the voice that feels most natural for your project.",
    [],
  );

  const runPreview = useCallback(
    async (voiceId: string) => {
      if (!authToken) return;
      setPreviewing(voiceId);
      setError("");
      setPreviewUrl("");
      try {
        const res = await fetch(`${API_URL}/tts/preview`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
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

        const start = Date.now();
        while (Date.now() - start < 25_000) {
          const r = await fetch(`${API_URL}/tts/${encodeURIComponent(id)}`, {
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
    },
    [authToken, previewText],
  );

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-neutral-500">Library</div>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-950">Voices</h1>
        </div>
        <div className="flex w-full max-w-3xl flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search voices..."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
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
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
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
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <option value="">Voice type</option>
              {facets.voiceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <option value="">Style</option>
              {facets.styles.slice(0, 120).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              onClick={() => {
                setQuery("");
                setLocale("");
                setGender("");
                setVoiceType("");
                setStyle("");
              }}
            >
              Reset
            </button>
            <button
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              onClick={() => load()}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {previewUrl ? (
        <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Preview
          </div>
          <audio ref={previewAudioRef} className="mt-2 w-full" controls src={previewUrl} />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No voices found. Try resetting filters.
          </div>
        ) : (
          items.slice(0, 90).map((v) => {
            const id = v.ShortName;
            const name = v.DisplayName ?? v.LocalName ?? v.ShortName;
            return (
              <div
                key={id}
                className="rounded-3xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-200" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-neutral-950">
                        {name}
                      </div>
                      <div className="truncate text-xs text-neutral-500">{v.Locale}</div>
                    </div>
                  </div>
                  <button
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                    onClick={() => router.push(`/app/text-to-speech?voice=${encodeURIComponent(id)}`)}
                  >
                    Use
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5">
                    {String(v.Gender ?? "").toLowerCase()}
                  </span>
                  {v.VoiceType ? (
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5">
                      {v.VoiceType}
                    </span>
                  ) : null}
                  {Array.isArray(v.StyleList) && v.StyleList.length ? (
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5">
                      {v.StyleList.length} styles
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs font-semibold",
                      previewing === id
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                    ].join(" ")}
                    onClick={() => runPreview(id)}
                    disabled={Boolean(previewing)}
                  >
                    {previewing === id ? "Previewing..." : "Preview"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

