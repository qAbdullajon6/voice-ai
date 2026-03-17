"use client";

import { Sidebar } from "./sidebar";

export function ComingSoonPage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-950">{title}</h2>
              <p className="mt-0.5 text-xs text-gray-600">{description}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-8 py-8">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl flex items-center justify-center">
                {typeof icon === "string" ? icon : <div className="text-5xl">{icon}</div>}
              </div>
              <h1 className="text-3xl font-bold text-gray-950">Coming Soon</h1>
              <p className="mt-2 text-gray-600">
                We&apos;re working on {title} for you. Stay tuned!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
