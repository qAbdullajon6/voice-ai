"use client";

import * as React from "react";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") return t;
  } catch {
    /* ignore */
  }
  return null;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* ignore */
  }
}

export function initThemeFromStorage(): Theme {
  const stored = getStoredTheme();
  let theme: Theme;
  if (stored) {
    theme = stored;
  } else {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  applyTheme(theme);
  return theme;
}

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useLayoutEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const setTheme = React.useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light" as Theme,
      setTheme: applyTheme,
      toggleTheme: () => {
        const next = !document.documentElement.classList.contains("dark");
        applyTheme(next ? "dark" : "light");
      },
    };
  }
  return ctx;
}

export function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug‘ rejim" : "Qorong‘u rejim"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={[
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50",
        "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700",
        className,
      ].join(" ")}
    >
      {isDark ? (
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm0 15a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm8-7a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1zM6 12a1 1 0 0 0-1-1H4a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1zm.22-7.78a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l.71.71a1 1 0 0 0 1.41-1.41l-.71-.71zm12.08 12.08a1 1 0 0 0-1.41 0l-.71.71a1 1 0 0 0 1.41 1.41l.71-.71a1 1 0 0 0 0-1.41zM5.64 17.66a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.71-.71a1 1 0 0 0-1.41 1.41l.71.71zM18.36 6.34a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.71-.71a1 1 0 0 0-1.41 1.41l.71.71zM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5z" />
        </svg>
      ) : (
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.15-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.27 1 1 0 0 0-.36-.63z" />
        </svg>
      )}
    </button>
  );
}
