"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
import { backdropUrl, posterUrl, formatYear } from "@/lib/tmdb";
import { AISearchBar } from "@/components/ai/AISearchBar";
import { cn, getRatingColor, truncate } from "@/lib/utils";
import type { Movie } from "@/types";

interface HeroProps {
  movies: Movie[];
}

export function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const featured = movies.slice(0, 5);
  const movie = featured[current];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!movie) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={backdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Multi-layer cinematic gradient */}
          <div className="absolute inset-0 bg-void/40" />
          <div className="absolute inset-0 gradient-bottom" />
          <div className="absolute inset-0 gradient-left" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-void to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end flex-1 section-padding pb-16 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="label-sm text-ember">Featured Film</span>
              <div className="h-px w-12 bg-ember/50" />
            </div>

            {/* Title */}
            <h1 className="heading-xl text-ivory mb-3 text-balance">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span className={cn("font-mono text-sm font-medium flex items-center gap-1", getRatingColor(movie.vote_average))}>
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-silver">{formatYear(movie.release_date)}</span>
              {movie.runtime && (
                <span className="text-sm text-silver">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.genres?.slice(0, 2).map((g) => (
                <span key={g.id} className="text-xs border border-ash/60 text-mist px-2 py-0.5 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-sm text-mist/80 leading-relaxed mb-8 max-w-lg">
              {truncate(movie.overview, 180)}
            </p>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <Link href={`/film/${movie.id}`} className="btn-primary flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                View Film
              </Link>
              <Link href={`/film/${movie.id}`} className="btn-ghost flex items-center gap-2">
                <Info className="w-4 h-4" />
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-0.5 rounded-full transition-all duration-500",
                i === current ? "w-8 bg-ember" : "w-4 bg-ash hover:bg-smoke"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* AI Search — floated bottom */}
      <div className="relative z-10 section-padding pb-12">
        <div className="max-w-2xl">
          <p className="label-sm text-smoke mb-3">Describe what you want to watch</p>
          <AISearchBar large />
        </div>
      </div>
    </section>
  );
}
