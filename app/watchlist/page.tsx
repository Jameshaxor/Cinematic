"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Check, Trash2, Star, Lock } from "lucide-react";
import { posterUrl, formatYear } from "@/lib/tmdb";
import { cn, getRatingColor } from "@/lib/utils";
import type { WatchlistItem } from "@/types";

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unwatched" | "watched">("all");

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => setItems(d.watchlist || []))
      .finally(() => setLoading(false));
  }, [session]);

  const remove = async (movieId: number) => {
    await fetch(`/api/watchlist?movieId=${movieId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.movieId !== movieId));
  };

  const markWatched = async (movieId: number, watched: boolean) => {
    await fetch("/api/watchlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId, watched, watchedAt: watched ? new Date().toISOString() : undefined }),
    });
    setItems((prev) =>
      prev.map((i) => i.movieId === movieId ? { ...i, watched } : i)
    );
  };

  const filtered = items.filter((i) => {
    if (filter === "watched") return i.watched;
    if (filter === "unwatched") return !i.watched;
    return true;
  });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-24 section-padding">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 text-smoke mx-auto mb-4" />
          <h2 className="heading-md text-ivory mb-2">Sign in to access your watchlist</h2>
          <p className="text-silver text-sm mb-6">Save and track films you want to watch</p>
          <Link href="/auth/signin" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="label-sm text-ember block mb-1">My List</span>
            <h1 className="heading-lg text-ivory">Watchlist</h1>
            <p className="text-silver text-sm mt-1">
              {items.length} film{items.length !== 1 ? "s" : ""} saved ·{" "}
              {items.filter((i) => i.watched).length} watched
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(["all", "unwatched", "watched"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-body transition-all capitalize",
                filter === f
                  ? "bg-ember text-void font-semibold"
                  : "border border-ash text-silver hover:border-smoke hover:text-ivory"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Bookmark className="w-12 h-12 text-smoke mx-auto mb-4" />
            <p className="text-silver mb-4">
              {filter === "all" ? "Your watchlist is empty." : `No ${filter} films.`}
            </p>
            <Link href="/" className="btn-primary">Discover Films</Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.movieId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "group flex gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-smoke",
                  item.watched ? "bg-graphite/50 border-ash/50" : "bg-obsidian border-ash"
                )}
              >
                {/* Poster */}
                <Link href={`/film/${item.movieId}`} className="shrink-0">
                  <div className="w-16 h-24 relative rounded-lg overflow-hidden bg-graphite">
                    <Image
                      src={posterUrl(item.posterPath, "w342")}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    {item.watched && (
                      <div className="absolute inset-0 bg-void/60 flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link href={`/film/${item.movieId}`}>
                      <h3 className="text-sm font-semibold text-ivory hover:text-ember-light transition-colors truncate">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-silver mt-0.5">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => markWatched(item.movieId, !item.watched)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all",
                        item.watched
                          ? "border-emerald-800 text-emerald-400 hover:bg-reel/10 hover:border-reel hover:text-reel-light"
                          : "border-ash text-silver hover:border-emerald-700 hover:text-emerald-400"
                      )}
                    >
                      <Check className="w-3 h-3" />
                      {item.watched ? "Watched" : "Mark watched"}
                    </button>
                    <button
                      onClick={() => remove(item.movieId)}
                      className="p-1.5 rounded-full text-smoke hover:text-reel transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
