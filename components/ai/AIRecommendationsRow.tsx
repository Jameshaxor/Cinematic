"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MovieRow } from "@/components/movie/MovieRow";
import type { Movie, AIRecommendation } from "@/types";

export function AIRecommendationsRow() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recs, setRecs] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/ai/recommendations")
      .then((r) => r.json())
      .then((data) => {
        setIsPersonalized(data.isPersonalized);
        setMessage(data.message || "");
        if (data.isPersonalized && data.recommendations) {
          setRecs(data.recommendations);
          // Fetch actual movie objects for the recommended IDs
          const ids = data.recommendations.map((r: AIRecommendation) => r.movieId);
          return fetch(`/api/movies/batch?ids=${ids.join(",")}`);
        } else {
          setMovies(data.movies || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const recMap = recs.reduce((acc, r) => {
    acc[r.movieId] = r;
    return acc;
  }, {} as Record<number, AIRecommendation>);

  return (
    <section className="py-2">
      {isPersonalized ? (
        <MovieRow
          title="Picked For You"
          subtitle="Based on your taste profile"
          movies={movies}
          loading={loading}
          labelTag="✦ AI Personalized"
          recommendations={recs}
        />
      ) : (
        <MovieRow
          title="What's Hot Right Now"
          subtitle={
            session
              ? message
              : "Sign in to unlock personalized AI recommendations"
          }
          movies={movies}
          loading={loading}
          labelTag="Trending"
        />
      )}

      {!session && (
        <div className="section-padding mt-2">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian border border-ash max-w-lg">
            <div className="w-10 h-10 rounded-full bg-ember/10 border border-ember/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-ember" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ivory">Unlock AI recommendations</p>
              <p className="text-xs text-silver mt-0.5">Sign in to get films curated for your exact taste</p>
            </div>
            <Link href="/auth/signin" className="btn-primary py-2 px-4 text-xs shrink-0">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
