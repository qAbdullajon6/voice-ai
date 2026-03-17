"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../../../components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000";

type FileItem = {
  id: string;
  text: string;
  voice_id: string | null;
  model_id: string | null;
  output_format: string | null;
  settings: Record<string, unknown> | null;
  status: string;
  audio_url: string | null;
  created_at: string;
  error?: string;
};

export default function FilesPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "processing" | "failed">("all");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthToken(token);
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setAuthReady(true);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        router.replace("/login");
      });
  }, [router]);

  const loadFiles = useCallback(
    async (isLoadMore = false) => {
      if (!authToken) return;
      setLoading(true);
      setError("");
      try {
        const url = new URL(`${API_URL}/tts/history`);
        url.searchParams.set("limit", "20");
        if (cursor && isLoadMore) {
          url.searchParams.set("cursor", cursor);
        }
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const newFiles = Array.isArray(data?.items) ? data.items : [];
        setFiles(isLoadMore ? [...files, ...newFiles] : newFiles);
        setCursor(data?.nextCursor ?? null);
        setCanLoadMore(!!data?.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load files");
      } finally {
        setLoading(false);
      }
    },
    [authToken, cursor, files]
  );

  useEffect(() => {
    if (!authReady) return;
    setCursor(null);
    loadFiles(false);
  }, [authReady, loadFiles]);

  const handleLoadMore = () => {
    loadFiles(true);
  };

  const handleDelete = async (id: string) => {
    if (!authToken || !confirm("Delete this file?")) return;
    try {
      const res = await fetch(`${API_URL}/tts/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setFiles(files.filter((f) => f.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete file");
    }
  };

  const handleDownload = (file: FileItem) => {
    if (!file.audio_url) return;
    const a = document.createElement("a");
    a.href = file.audio_url;
    a.download = `${file.text || "audio"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async (file: FileItem) => {
    const text = `Check out this TTS: "${file.text || "Untitled"}"\n\n${file.audio_url || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy to clipboard");
    }
  };

  const handleReuse = (file: FileItem) => {
    const params = new URLSearchParams();
    params.set("voice", file.voice_id || "");
    params.set("text", file.text || "");
    router.push(`/app/text-to-speech?${params.toString()}`);
  };

  const filteredFiles = files.filter((f) => {
    if (filterStatus === "all") return true;
    return f.status === filterStatus;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      return (a.text || "").localeCompare(b.text || "");
    }
  });

  if (!authReady) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
          Checking access...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">Files</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your generated audio files and projects
          </p>
        </div>

        {sortedFiles.length === 0 && !loading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <div className="text-5xl mb-4">⧉</div>
            <div className="text-lg font-semibold text-neutral-950">No files yet</div>
            <div className="mt-1 text-sm text-neutral-600">
              Generate your first TTS clip to start building a library
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => router.push("/app/text-to-speech")}
                className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900"
              >
                Generate TTS
              </button>
              <button
                onClick={() => router.push("/app/voices")}
                className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Browse Voices
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">Name</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <option value="all">All Status</option>
                    <option value="done">Done</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                      viewMode === "grid"
                        ? "bg-violet-50 text-violet-700 border border-violet-200"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                      viewMode === "list"
                        ? "bg-violet-50 text-violet-700 border border-violet-200"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Files display */}
            {loading && sortedFiles.length === 0 ? (
              <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-3 h-3 w-1/2 bg-neutral-100" />
                    <Skeleton className="mt-2 h-3 w-2/3 bg-neutral-100" />
                  </div>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedFiles.map((file) => (
                  <div key={file.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="truncate text-sm font-semibold text-neutral-950">
                      {file.text || "Untitled"}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          file.status === "done"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : file.status === "processing"
                              ? "border border-blue-200 bg-blue-50 text-blue-700"
                              : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {file.status}
                      </span>
                      {file.voice_id && (
                        <span className="truncate border border-neutral-200 bg-neutral-50 px-2 py-0.5 rounded-full">
                          {file.voice_id}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-400">
                      {new Date(file.created_at).toLocaleString()}
                    </div>

                    {file.status === "done" && file.audio_url && (
                      <div className="mt-3">
                        <audio src={file.audio_url} className="w-full" controls />
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {file.status === "done" && file.audio_url ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownload(file)}
                            className="flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(file)}
                            className="flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          >
                            Share
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReuse(file)}
                            className="flex-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                          >
                            Reuse
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        className="flex-1 rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-neutral-950">
                        {file.text || "Untitled"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                        <span
                          className={`rounded-full px-2 py-0.5 ${
                            file.status === "done"
                              ? "border border-green-200 bg-green-50 text-green-700"
                              : file.status === "processing"
                                ? "border border-blue-200 bg-blue-50 text-blue-700"
                                : "border border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {file.status}
                        </span>
                        {file.voice_id && <span>{file.voice_id}</span>}
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      {file.status === "done" && file.audio_url ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownload(file)}
                            title="Download"
                            className="rounded-lg border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(file)}
                            title="Share"
                            className="rounded-lg border border-neutral-200 bg-white px-2 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                          >
                            ⤑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReuse(file)}
                            title="Reuse"
                            className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                          >
                            ↺
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        title="Delete"
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {canLoadMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
  );
}

