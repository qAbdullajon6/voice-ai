"use client";

import * as React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "new" | "soon";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "border-white/10 bg-white/5 text-gray-200",
  new: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  soon: "border-white/10 bg-white/5 text-gray-400",
};

export function Badge({ className = "", tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

