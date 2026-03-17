"use client";

import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition outline-none disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 focus-visible:ring-2 focus-visible:ring-violet-500/30",
  secondary:
    "border border-white/10 bg-white/5 text-gray-100 hover:border-white/20 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/15",
  ghost:
    "text-gray-200 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export function Button({
  className = "",
  variant = "secondary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

