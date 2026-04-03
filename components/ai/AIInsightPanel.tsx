"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Loader2 } from "lucide-react";
import type { AIMovieInsight } from "@/types";

interface AIInsightPanelProps {
  movieId: number;
  movieTitle: string;
}

export function AIInsightPanel({ movieId, movieTitle }: AIInsightPanelProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AIMovieInsight | null>(null);

  const fetchInsight = async () => {
    if (insight) { setOpen(!open); return; }
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/insight?movieId=${movieId}`);
      const data = await res.json();
      setInsight(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-ash overflow-hidden">
      {/* Toggle button */}
      <button
        onClick={fetchInsight}
        className="w-full flex items-center justify-between px-5 py-4 bg-obsidian hover:bg-graphite transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ember/10 border border-ember/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-ember" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ivory">AI Cinephile Insight</p>
            <p className="text-xs text-silver">Deep analysis by Claude</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-silver transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-5 border-t border-ash bg-obsidian/50 space-y-5">
              {loading ? (
                <div className="flex items-center gap-3 text-silver py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-ember" />
                  <span className="text-sm font-mono">Generating insight for {movieTitle}...</span>
                </div>
              ) : insight ? (
                <>
                  {/* Summary */}
                  <div>
                    <p className="label-sm text-ember mb-2">Critical Take</p>
                    <p className="text-sm text-mist leading-relaxed">{insight.summary}</p>
                  </div>

                  {/* Themes */}
                  {insight.themes?.length > 0 && (
                    <div>
                      <p className="label-sm text-ember mb-2">Core Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.themes.map((theme) => (
                          <span
                            key={theme}
                            className="text-xs bg-graphite border border-ash text-mist px-3 py-1 rounded-full"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Watch mood */}
                  {insight.watchMood && (
                    <div className="flex items-start gap-3 p-4 bg-ember-muted border border-ember/20 rounded-lg">
                      <span className="text-lg">🎬</span>
                      <div>
                        <p className="label-sm text-ember mb-1">Best Watched</p>
                        <p className="text-sm text-mist">{insight.watchMood}</p>
                      </div>
                    </div>
                  )}

                  {/* Cinephile note */}
                  {insight.cinephileNote && (
                    <div>
                      <p className="label-sm text-ember mb-2">Cinephile Note</p>
                      <p className="text-sm text-mist/80 leading-relaxed italic border-l-2 border-ember/30 pl-3">
                        {insight.cinephileNote}
                      </p>
                    </div>
                  )}

                  {/* Similar vibes */}
                  {insight.similarVibes?.length > 0 && (
                    <div>
                      <p className="label-sm text-ember mb-2">Similar Vibes</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.similarVibes.map((v) => (
                          <span key={v} className="text-xs text-silver bg-graphite px-3 py-1 rounded-full border border-ash">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
