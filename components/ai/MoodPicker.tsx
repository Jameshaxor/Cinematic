"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { MovieRow } from "@/components/movie/MovieRow";
import { MOODS } from "@/lib/utils";
import type { Movie } from "@/types";

export function MoodPicker() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    title: string;
    movies: Movie[];
  }[]>([]);

  const handleMoodSelect = async (mood: typeof MOODS[0]) => {
    if (activeMood === mood.value) {
      setActiveMood(null);
      setResults([]);
      return;
    }
    setActiveMood(mood.value);
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${mood.label} movies I should watch tonight` }),
      });
      const data = await res.json();
      if (data.movies?.length) {
        setResults([{ title: `${mood.emoji} ${mood.label} picks for you`, movies: data.movies }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10">
      <div className="section-padding mb-6">
        <span className="label-sm text-ember block mb-1">What's your mood?</span>
        <h2 className="heading-md text-ivory">Find your perfect film</h2>
      </div>

      {/* Mood chips */}
      <div className="section-padding flex flex-wrap gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-body
              transition-all duration-200
              ${activeMood === mood.value
                ? "bg-ember border-ember text-void font-semibold shadow-glow-amber"
                : "border-ash bg-obsidian text-silver hover:border-smoke hover:text-ivory"
              }
            `}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section-padding mt-8 flex items-center gap-3 text-silver"
          >
            <Loader2 className="w-4 h-4 animate-spin text-ember" />
            <span className="text-sm font-mono">AI is curating your picks...</span>
          </motion.div>
        )}

        {results.map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MovieRow
              title={result.title}
              movies={result.movies}
              labelTag="AI Curated"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
