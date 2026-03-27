"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "../theme-provider";
import { MiniPlayerRoot } from "./mini-player-store";
import { CgToolbarLeft } from "react-icons/cg";
import { RiFileMusicLine } from "react-icons/ri";
type NavItem = {
  label: string;
  href: string;
  badge?: "New" | "Soon";
  disabled?: boolean;
  icon?: React.ReactNode;
};

const PAGE_TITLES: Record<string, string> = {
  "/app/text-to-speech": "Text to Speech",
};

function Icon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center text-current transition-colors">
      {children}
    </span>
  );
}

function NavSection({
  title,
  items,
  collapsed = false,
}: {
  title?: string;
  items: NavItem[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className={collapsed ? "space-y-3" : "space-y-2"}>
      {title && !collapsed ? (
        <div className="px-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </div>
      ) : null}
      <div className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              className={[
                "group relative flex items-center rounded-[10px] border border-transparent text-sm font-medium transition",
                collapsed
                  ? "mx-auto h-10 w-10 justify-center px-0 py-0"
                  : "justify-between gap-3 px-2 py-1.5",
                active
                  ? collapsed
                    ? "bg-white text-neutral-950 border-neutral-300 shadow-sm dark:bg-neutral-800 dark:text-neutral-50 dark:border-neutral-600"
                    : "bg-neutral-100/90 text-neutral-950 border-neutral-200 dark:bg-neutral-800/90 dark:text-neutral-50 dark:border-neutral-600"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 hover:border-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:hover:border-neutral-600",
              ].join(" ")}
            >
              <span className={collapsed ? "grid h-5 w-5 place-items-center" : "flex min-w-0 items-center gap-2"}>
                {item.icon ?? null}
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </span>
              {item.badge && !collapsed ? (
                <span
                  className={[
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    item.badge === "New"
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-neutral-200 bg-neutral-50 text-neutral-500",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AppLayout({
  pageTitle,
  children,
}: {
  pageTitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const resolvedPageTitle = pageTitle ?? PAGE_TITLES[pathname] ?? "Workspace";

  React.useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) setUserName(data.name);
        })
        .catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "A";
  const sidebarWidth = sidebarOpen ? "16rem" : "4.5rem";

  React.useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const main: NavItem[] = [
    {
      label: "Text to Speech",
      href: "/app/text-to-speech",
      icon: (
        <Icon>
          <RiFileMusicLine size={16} />
        </Icon>
      ),
    },
  ];

  return (
    <div
      className="app-light h-dvh min-h-screen overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
      style={{ ["--eleven-sidebar-width" as string]: sidebarWidth }}
    >
      <div
        className={[
          "fixed left-0 top-0 z-41 hidden h-dvh border-r border-neutral-200 bg-neutral-50/90 backdrop-blur-md transition-[width] duration-200 dark:border-neutral-800 dark:bg-neutral-900/95 md:block",
          sidebarOpen ? "w-64" : "w-18",
        ].join(" ")}
      >
        <aside
          className={[
            "flex h-full min-h-0 flex-col overflow-hidden py-3",
            sidebarOpen ? "px-3" : "px-2",
          ].join(" ")}
        >
          <div className={sidebarOpen ? "" : "flex justify-center"}>
            <button
              type="button"
              onClick={() => router.push("/app/text-to-speech")}
              className={[
                "cursor-pointer",
                sidebarOpen
                  ? "w-full flex-1"
                  : "",
              ].join(" ")}
              title="Go to dashboard"
            >
              {sidebarOpen ? (
                <Image
                  src="/full_logo.png"
                  alt="VoiceAI Logo"
                  width={250}
                  height={60}
                  className="h-8 scale-130 relative left-2.5 w-auto cursor-pointer object-contain"
                  priority
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="VoiceAI Icon"
                  width={30}
                  height={30}
                  className="h-8 object-contain"
                  priority
                />
              )}
            </button>
          </div>

          {/* {sidebarOpen ? (
            <button
              type="button"
              className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-2 py-2 text-left shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
              title="Workspace switcher"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md border border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-700">
                  EC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-neutral-950">{workspace}</div>
                  <div className="text-[11px] text-neutral-500">Platform switcher</div>
                </div>
                <div className="text-neutral-500">
                  <RiArrowUpDownLine size={16} />
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="mx-auto mt-3 grid h-10 w-10 place-items-center rounded-[10px] border border-neutral-200 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
              title={workspace}
              aria-label={workspace}
            >
              <Image
                src="/logo.png"
                alt="Workspace Logo"
                width={18}
                height={18}
                className="h-4.5 w-4.5 object-contain"
              />
            </button>
          )} */}

          <div className="mt-3 min-h-0 flex-1 overflow-hidden">
            <div
              className={[
                "h-full overflow-y-auto overflow-x-hidden hide-scrollbar",
                sidebarOpen ? "pr-1" : "pr-0",
              ].join(" ")}
            >
              <div className={sidebarOpen ? "space-y-5 pb-2" : "space-y-6 pb-2"}>
                <NavSection items={main} collapsed={!sidebarOpen} />
              </div>
            </div>
          </div>

          {sidebarOpen ? (
            <div className="shrink-0 px-2 pt-6 text-xs text-neutral-400 dark:text-neutral-500">
              © {new Date().getFullYear()} VoiceAI
            </div>
          ) : null}
        </aside>
      </div>

      <div className={["flex h-dvh min-h-screen", sidebarOpen ? "md:pl-64" : "md:pl-18"].join(" ")}>
        <div className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
            <div className="flex min-h-14 items-center justify-between gap-4 px-4 py-2 md:px-8">
              <div className="min-w-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="hidden h-9 w-9 cursor-pointer place-items-center rounded-[10px] border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 md:grid"
                  title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  <CgToolbarLeft />
                </button>
                <div className="truncate text-[15px] font-semibold text-neutral-950">
                  {resolvedPageTitle}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                  Feedback
                </button>
                <button className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                  Docs
                </button>
                <button className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                  Ask
                </button>
                <ThemeToggle />
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-xs font-semibold text-white hover:bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white"
                    title={userName || "User"}
                  >
                    {userInitial}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-xl">
                      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                        <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-100">{userName || "User"}</div>
                        <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Workspace</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push("/app/text-to-speech");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      >
                        Text to Speech
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 md:px-8">
            {children}
          </main>
          <MiniPlayerRoot />
        </div>
      </div>
    </div>
  );
}

