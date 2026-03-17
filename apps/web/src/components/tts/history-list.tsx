"use client";

import * as React from "react";

export type HistoryItem = {
  id: string;
  text: string;
  voice_id: string | null;
  model_id: string | null;
  output_format: string | null;
  settings: Record<string, unknown> | null;
  status: string;
  audio_url: string | null;
  created_at: string;
};

export function HistoryList({
  items,
  loading,
  error,
  onSelect,
  onLoadMore,
  canLoadMore,
}: {
  items: HistoryItem[];
  loading: boolean;
  error: string;
  onSelect: (item: HistoryItem) => void;
  onLoadMore: () => void;
  canLoadMore: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-neutral-950">History</div>
        {canLoadMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            disabled={loading}
          >
            Load more
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {loading && items.length === 0 ? (
          <div className="py-6 text-sm text-neutral-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-6 text-sm text-neutral-500">No generations yet.</div>
        ) : (
          items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => onSelect(it)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left hover:bg-neutral-50"
            >
              <div className="truncate text-sm font-semibold text-neutral-950">
                {it.text || "Untitled"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5">
                  {it.status}
                </span>
                {it.voice_id ? (
                  <span className="truncate">{it.voice_id}</span>
                ) : null}
                <span>•</span>
                <span>{new Date(it.created_at).toLocaleString()}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

