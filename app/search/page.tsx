"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Film, SlidersHorizontal } from "lucide-react";
import { AISearchBar } from "@/components/ai/AISearchBar";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import type { Movie } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [results, setResults] = useState<Movie[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setSearched(true);
    setInterpretation("");
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.movies || []);
      setInterpretation(data.aiInterpretation || "");
    } finally {
      setLoading(false);
    }
  };

  const handleResults = (data: unknown) => {
    const d = data as { movies: Movie[]; aiInterpretation: string };
    setResults(d.movies || []);
    setInterpretation(d.aiInterpretation || "");
    setSearched(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding">
        {/* Header */}
        <div className="mb-8">
          <span className="label-sm text-ember block mb-2">AI-Powered</span>
          <h1 className="heading-lg text-ivory mb-2">Search Films</h1>
          <p className="text-sm text-silver">
            Describe a mood, era, vibe — not just a title
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mb-10">
          <AISearchBar large onResults={handleResults} />
        </div>

        {/* AI interpretation */}
        <AnimatePresence>
          {interpretation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 mb-8 p-4 bg-obsidian border border-ember/20 rounded-xl max-w-2xl"
            >
              <Sparkles className="w-4 h-4 text-ember mt-0.5 shrink-0" />
              <div>
                <p className="label-sm text-ember mb-1">AI Interpreted As</p>
                <p className="text-sm text-mist">{interpretation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div>
            <p className="label-sm text-smoke mb-5">Finding films...</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : searched && results.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-5">
              <p className="label-sm text-smoke">
                {results.length} films found
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          </motion.div>
        ) : searched && !loading ? (
          <div className="text-center py-20">
            <Film className="w-12 h-12 text-smoke mx-auto mb-4" />
            <p className="text-silver">No films found. Try a different description.</p>
          </div>
        ) : (
          /* Empty state suggestions */
          <div className="py-8">
            <p className="label-sm text-smoke mb-4">Try searching for</p>
            <div className="flex flex-wrap gap-3">
              {[
                "A mind-bending sci-fi from the 2010s",
                "Cozy films to watch on a rainy day",
                "Dark psychological thrillers",
                "Classic Westerns with great cinematography",
                "Underrated horror gems",
                "Romantic dramas that make you cry",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(q)}`);
                  }}
                  className="text-sm bg-obsidian border border-ash text-silver hover:text-ivory hover:border-smoke px-4 py-2 rounded-full transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 section-padding"><div className="skeleton h-8 w-48 rounded mb-4" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
