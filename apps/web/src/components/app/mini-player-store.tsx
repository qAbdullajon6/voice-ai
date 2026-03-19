"use client";

import * as React from "react";
import { MiniPlayer, type MiniPlayerItem } from "./mini-player";

type MiniPlayerControls = {
  toggle: () => void;
  playFromStart: () => void;
  pause: () => void;
};

type MiniPlayerContextValue = {
  item: MiniPlayerItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  playId: number;
  open: (item: MiniPlayerItem, opts?: { restart?: boolean }) => void;
  close: () => void;
  toggle: () => void;
  playFromStart: (item?: MiniPlayerItem) => void;
  _registerControls: (c: MiniPlayerControls | null) => void;
  _reportState: (s: { isPlaying: boolean; isLoading: boolean }) => void;
};

const MiniPlayerContext = React.createContext<MiniPlayerContextValue | null>(null);

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = React.useState<MiniPlayerItem | null>(null);
  const [playId, setPlayId] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const controlsRef = React.useRef<MiniPlayerControls | null>(null);

  const open = React.useCallback(
    (next: MiniPlayerItem, opts?: { restart?: boolean }) => {
      let shouldReload = true;
      setItem((prev) => {
        const same = Boolean(prev?.id && prev.id === next.id);
        shouldReload = !same || Boolean(opts?.restart);
        if (same && !opts?.restart) return prev;
        return next;
      });
      if (shouldReload) {
        setPlayId((n) => n + 1);
      }
    },
    [],
  );
  const close = React.useCallback(() => {
    controlsRef.current?.pause?.();
    setItem(null);
  }, []);

  const toggle = React.useCallback(() => controlsRef.current?.toggle?.(), []);
  const playFromStart = React.useCallback(
    (next?: MiniPlayerItem) => {
      if (next) {
        open(next, { restart: true });
        return;
      }
      controlsRef.current?.playFromStart?.();
    },
    [open],
  );

  const _registerControls = React.useCallback((c: MiniPlayerControls | null) => {
    controlsRef.current = c;
  }, []);

  const _reportState = React.useCallback((s: { isPlaying: boolean; isLoading: boolean }) => {
    setIsPlaying(s.isPlaying);
    setIsLoading(s.isLoading);
  }, []);

  const value = React.useMemo(
    () => ({
      item,
      isPlaying,
      isLoading,
      playId,
      open,
      close,
      toggle,
      playFromStart,
      _registerControls,
      _reportState,
    }),
    [item, isPlaying, isLoading, playId, open, close, toggle, playFromStart, _registerControls, _reportState],
  );

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
  const ctx = useMiniPlayer();
  return (
    <MiniPlayer
      item={ctx.item}
      playId={ctx.playId}
      onRegisterControls={ctx._registerControls}
      onStateChange={ctx._reportState}
    />
  );
}

