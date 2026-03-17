"use client";

import * as React from "react";

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`animate-pulse rounded bg-neutral-200 ${className}`} />;
}

