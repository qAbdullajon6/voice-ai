"use client";

import * as React from "react";

export function Tabs({
  value,
  onChange,
  items,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  items: Array<{ id: string; label: string; disabled?: boolean }>;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "border-violet-200 bg-violet-50 text-violet-700"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
              t.disabled ? "cursor-not-allowed opacity-50 hover:bg-white" : "",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

