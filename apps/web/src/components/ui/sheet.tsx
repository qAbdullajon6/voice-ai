"use client";

import * as React from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
  widthClassName = "max-w-[420px]",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-full ${widthClassName} border-l border-neutral-200 bg-white shadow-xl`}
      >
        {title ? (
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
            <div className="text-sm font-semibold text-neutral-950">{title}</div>
            <button
              type="button"
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

