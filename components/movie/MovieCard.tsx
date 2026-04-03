"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Star, Play } from "lucide-react";
import { cn, getRatingColor, formatYear, truncate } from "@/lib/utils";
import { posterUrl } from "@/lib/tmdb";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  showReason?: string;
  onWatchlistToggle?: (movie: Movie, added: boolean) => void;
  isInWatchlist?: boolean;
  variant?: "default" | "wide" | "minimal";
}

export function MovieCard({
  movie,
  index = 0,
  showReason,
  onWatchlistToggle,
  isInWatchlist = false,
  variant = "default",
}: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const [watchlisted, setWatchlisted] = useState(isInWatchlist);
  const [toggling, setToggling] = useState(false);

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);

    try {
      const method = watchlisted ? "DELETE" : "POST";
      const url = watchlisted
        ? `/api/watchlist?movieId=${movie.id}`
        : "/api/watchlist";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST"
          ? JSON.stringify({
              movieId: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
            })
          : undefined,
      });

      setWatchlisted(!watchlisted);
      onWatchlistToggle?.(movie, !watchlisted);
    } finally {
      setToggling(false);
    }
  };

  if (variant === "minimal") {
    return (
      <Link href={`/film/${movie.id}`} className="group flex gap-3 p-3 rounded-lg hover:bg-graphite transition-colors">
        <div className="w-12 h-18 relative shrink-0 rounded overflow-hidden poster-ratio" style={{ width: 48, height: 72 }}>
          <Image
            src={imgError ? "/placeholder-poster.jpg" : posterUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fill className="object-cover"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p className="text-sm font-semibold text-ivory truncate group-hover:text-ember-light transition-colors">{movie.title}</p>
          <p className="text-xs text-silver">{formatYear(movie.release_date)}</p>
          <div className={cn("text-xs font-mono mt-1", getRatingColor(movie.vote_average))}>
            ★ {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={cn("group relative shrink-0", variant === "wide" ? "w-64" : "w-44 md:w-48")}
    >
      <Link href={`/film/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative overflow-hidden rounded-lg poster-ratio bg-graphite">
          <Image
            src={imgError ? "/placeholder-poster.jpg" : posterUrl(movie.poster_path, "w500")}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 176px, 192px"
            onError={() => setImgError(true)}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-void/0 group-hover:bg-void/60 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-ivory">
              <Play className="w-8 h-8 fill-ivory" />
            </div>
          </div>

          {/* Rating badge */}
          <div className={cn(
            "absolute top-2 left-2 score-badge bg-void/80 border-void/50 backdrop-blur-sm",
            getRatingColor(movie.vote_average)
          )}>
            ★ {movie.vote_average.toFixed(1)}
          </div>

          {/* Watchlist button */}
          <button
            onClick={handleWatchlist}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center",
              "bg-void/80 backdrop-blur-sm border transition-all duration-200",
              watchlisted
                ? "border-ember text-ember"
                : "border-ash/50 text-mist opacity-0 group-hover:opacity-100"
            )}
            aria-label={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
          >
            {watchlisted
              ? <BookmarkCheck className="w-3.5 h-3.5" />
              : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 gradient-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-sm font-semibold text-ivory leading-tight group-hover:text-ember-light transition-colors truncate">
            {movie.title}
          </h3>
          <p className="text-xs text-silver mt-0.5">{formatYear(movie.release_date)}</p>
          {showReason && (
            <p className="text-xs text-smoke mt-1 leading-relaxed line-clamp-2">{showReason}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader
export function MovieCardSkeleton({ variant = "default" }: { variant?: "default" | "wide" }) {
  return (
    <div className={cn("shrink-0", variant === "wide" ? "w-64" : "w-44 md:w-48")}>
      <div className="skeleton rounded-lg poster-ratio" />
      <div className="mt-2.5 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
