"use client";

import { ThemeProvider } from "../components/theme-provider";
import { MiniPlayerProvider, MiniPlayerRoot } from "../components/app/mini-player-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MiniPlayerProvider>
        {children}
        <MiniPlayerRoot />
      </MiniPlayerProvider>
    </ThemeProvider>
  );
}
