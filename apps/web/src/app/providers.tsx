"use client";

import { ThemeProvider } from "../components/theme-provider";
import { MiniPlayerProvider } from "../components/app/mini-player-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MiniPlayerProvider>{children}</MiniPlayerProvider>
    </ThemeProvider>
  );
}
