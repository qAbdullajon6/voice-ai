"use client";

import * as React from "react";
import { MiniPlayer, type MiniPlayerItem } from "./mini-player";

type MiniPlayerContextValue = {
  item: MiniPlayerItem | null;
  open: (item: MiniPlayerItem) => void;
  close: () => void;
};

const MiniPlayerContext = React.createContext<MiniPlayerContextValue | null>(null);

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = React.useState<MiniPlayerItem | null>(null);

  const open = React.useCallback((next: MiniPlayerItem) => setItem(next), []);
  const close = React.useCallback(() => setItem(null), []);

  const value = React.useMemo(() => ({ item, open, close }), [item, open, close]);

  return <MiniPlayerContext.Provider value={value}>{children}</MiniPlayerContext.Provider>;
}

export function useMiniPlayer() {
  const ctx = React.useContext(MiniPlayerContext);
  if (!ctx) {
    throw new Error("useMiniPlayer must be used within MiniPlayerProvider");
  }
  return ctx;
}

export function MiniPlayerRoot() {
  const { item, close } = useMiniPlayer();
  return <MiniPlayer item={item} onClose={close} />;
}

