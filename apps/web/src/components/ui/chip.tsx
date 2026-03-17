"use client";

import * as React from "react";

export function Chip({
  active,
  disabled,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
        disabled ? "cursor-not-allowed opacity-50 hover:bg-white" : "",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

