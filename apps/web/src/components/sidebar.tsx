"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  RiHome6Line,
  RiMicLine,
  RiFileLine,
  RiSoundModuleLine,
  RiVolumeUpLine,
  RiMusicLine,
  RiVideoLine,
  RiLayoutGridLine,
  RiPaletteLine,
  RiBook3Line,
  RiOrganizationChart,
  RiVoiceprintLine,
} from "react-icons/ri";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: "New" | "Soon";
  disabled?: boolean;
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-5 h-5 flex items-center justify-center text-gray-600 flex-shrink-0">
    {children}
  </div>
);

const NavSection = ({
  title,
  items,
}: {
  title?: string;
  items: NavItem[];
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {title && (
        <div className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const disabled = item.disabled || false;

          return (
            <Link
              key={item.label}
              href={disabled ? "#" : item.href}
              onClick={(e) => disabled && e.preventDefault()}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                disabled
                  ? "cursor-not-allowed border-transparent text-gray-400"
                  : active
                    ? "border-gray-200 bg-white text-gray-950 font-semibold"
                    : "border-transparent bg-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-950"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <Icon>{item.icon}</Icon>
                <span className="truncate text-gray-950">{item.label}</span>
              </span>
              {item.badge && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-gray-100 text-gray-600">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export function Sidebar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
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

  const mainNav: NavItem[] = [
    {
      label: "Home",
      href: "/home",
      icon: <RiHome6Line size={20} />,
    },
    {
      label: "Voices",
      href: "/dashboard/voices",
      icon: <RiMicLine size={20} />,
    },
    {
      label: "Files",
      href: "/dashboard/files",
      icon: <RiFileLine size={20} />,
    },
  ];

  const playgroundNav: NavItem[] = [
    {
      label: "Text to Speech",
      href: "/text-to-speech",
      icon: <RiSoundModuleLine size={20} />,
    },
    {
      label: "Voice Changer",
      href: "/voice-changer",
      icon: <RiMicLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Voice Isolator",
      href: "/voice-isolator",
      icon: <RiVolumeUpLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Sound Effects",
      href: "/sound-effects",
      icon: <RiMusicLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Music",
      href: "/music",
      icon: <RiMusicLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Image & Video",
      href: "/image-video",
      icon: <RiVideoLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Templates",
      href: "/templates",
      icon: <RiLayoutGridLine size={20} />,
      badge: "Soon",
    },
  ];

  const productsNav: NavItem[] = [
    {
      label: "Studio",
      href: "/studio",
      icon: <RiPaletteLine size={20} />,
      badge: "New",
    },
    {
      label: "Audiobooks",
      href: "/audiobooks",
      icon: <RiBook3Line size={20} />,
      badge: "New",
    },
    {
      label: "Flows",
      href: "/flows",
      icon: <RiOrganizationChart size={20} />,
      badge: "New",
    },
    {
      label: "Dubbing",
      href: "/dubbing",
      icon: <RiMicLine size={20} />,
      badge: "Soon",
    },
    {
      label: "Speech to Text",
      href: "/speech-to-text",
      icon: <RiVoiceprintLine size={20} />,
      badge: "Soon",
    },
  ];

  return (
    <aside className="w-72 h-screen overflow-y-auto border-r border-gray-200 bg-gray-50 px-4 py-5 flex flex-col">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white text-sm font-bold flex items-center justify-center">
          V
        </div>
        <h1 className="text-lg font-bold text-gray-950">VoiceAI</h1>
      </div>

      {/* Workspace Switcher */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Workspace
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="font-medium text-gray-950">Default</div>
          <button className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
            +
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        <NavSection items={mainNav} />
        <NavSection title="Playground" items={playgroundNav} />
        <NavSection title="Products" items={productsNav} />
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
              {userInitial}
            </div>
            <span className="truncate flex-1 text-left">{userName || "User"}</span>
            <span className="text-xs">▼</span>
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <div className="text-sm font-semibold text-gray-950">
                  {userName || "User"}
                </div>
                <div className="text-xs text-gray-500">VoiceAI Studio</div>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/home");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Upgrade Button */}
        <Link
          href="#"
          className="relative w-full overflow-hidden group rounded-lg px-3 py-2 text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-100 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <RiSoundModuleLine size={18} className="text-gray-700" />
            <span className="font-semibold text-gray-700">Upgrade</span>
          </div>
        </Link>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} VoiceAI
        </div>
      </div>
    </aside>
  );
}
