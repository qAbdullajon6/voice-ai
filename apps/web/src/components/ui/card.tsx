"use client";

import * as React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "panel" | "surface";
};

export function Card({
  className = "",
  variant = "surface",
  ...props
}: CardProps) {
  const styles =
    variant === "panel"
      ? "border-white/10 bg-linear-to-br from-gray-900/60 to-gray-950/60 backdrop-blur-sm"
      : "border-white/10 bg-black/20 backdrop-blur-sm";

  return (
    <div
      className={`rounded-2xl border ${styles} ${className}`}
      {...props}
    />
  );
}

