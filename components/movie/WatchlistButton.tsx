"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  className?: string;
}

export function WatchlistButton({ movieId, title, posterPath, backdropPath, className }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((data) => {
        const found = data.watchlist?.some((item: { movieId: number }) => item.movieId === movieId);
        setInWatchlist(!!found);
      })
      .finally(() => setLoading(false));
  }, [session, movieId]);

  const toggle = async () => {
    if (!session) { router.push("/auth/signin"); return; }
    setToggling(true);
    try {
      if (inWatchlist) {
        await fetch(`/api/watchlist?movieId=${movieId}`, { method: "DELETE" });
        setInWatchlist(false);
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId, title, posterPath, backdropPath }),
        });
        setInWatchlist(true);
      }
    } finally {
      setToggling(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading || toggling}
      className={cn(
        "flex items-center gap-2 px-5 py-3 rounded-md border text-sm font-semibold transition-all duration-200",
        inWatchlist
          ? "bg-ember/10 border-ember text-ember hover:bg-reel/10 hover:border-reel hover:text-reel"
          : "border-ash bg-obsidian text-ivory hover:bg-graphite hover:border-smoke",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {toggling || loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : inWatchlist ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
