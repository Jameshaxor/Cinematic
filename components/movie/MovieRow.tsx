"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  loading?: boolean;
  viewAllHref?: string;
  labelTag?: string;
  recommendations?: Array<{ movieId: number; reason: string; matchScore: number }>;
}

export function MovieRow({
  title,
  subtitle,
  movies,
  loading = false,
  viewAllHref,
  labelTag,
  recommendations = [],
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const getRecommendation = (movieId: number) =>
    recommendations.find((r) => r.movieId === movieId);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="section-padding flex items-end justify-between mb-5">
        <div>
          {labelTag && (
            <span className="label-sm text-ember mb-1 block">{labelTag}</span>
          )}
          <h2 className="heading-md text-ivory">{title}</h2>
          {subtitle && <p className="text-sm text-silver mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="btn-icon w-8 h-8 hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="btn-icon w-8 h-8 hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-silver hover:text-ember-light transition-colors ml-2"
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Scroll container */}
      <div ref={scrollRef} className="scroll-x section-padding">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie, i) => {
              const rec = getRecommendation(movie.id);
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={i}
                  showReason={rec?.reason}
                />
              );
            })}
      </div>
    </section>
  );
}
