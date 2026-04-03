"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLE_QUERIES = [
  "A slow-burn thriller set in the 80s",
  "Feel-good movies like Amélie",
  "Sci-fi with a great twist ending",
  "Sad but beautiful Japanese films",
  "Movies that will keep me up at night",
  "Underrated 90s crime dramas",
];

interface AISearchBarProps {
  large?: boolean;
  onResults?: (results: unknown) => void;
  className?: string;
}

export function AISearchBar({ large = false, onResults, className }: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(EXAMPLE_QUERIES[0]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % EXAMPLE_QUERIES.length;
      setPlaceholder(EXAMPLE_QUERIES[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    if (onResults) {
      // In-page search
      setLoading(true);
      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        onResults(data);
      } finally {
        setLoading(false);
      }
    } else {
      // Navigate to search page
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn(
        "relative flex items-center rounded-xl border transition-all duration-300",
        focused
          ? "border-ember bg-graphite shadow-glow-amber"
          : "border-ash bg-obsidian hover:border-smoke",
        large ? "h-16" : "h-12"
      )}>
        {/* AI icon */}
        <div className={cn(
          "flex items-center gap-2 pl-4 shrink-0",
          large ? "pl-5" : "pl-4"
        )}>
          <Sparkles className={cn(
            "shrink-0 transition-colors",
            focused ? "text-ember" : "text-smoke",
            large ? "w-5 h-5" : "w-4 h-4"
          )} />
          {large && (
            <span className="text-xs font-mono text-smoke uppercase tracking-widest hidden sm:block">
              AI Search
            </span>
          )}
          {large && <div className="w-px h-5 bg-ash mx-1" />}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent outline-none text-ivory placeholder:text-smoke/60 font-body",
            large ? "text-base px-4" : "text-sm px-3"
          )}
        />

        {/* Clear */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="p-2 text-smoke hover:text-silver transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search button */}
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className={cn(
            "flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 shrink-0 mr-2",
            large ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs",
            query.trim()
              ? "bg-ember text-void hover:bg-ember-light"
              : "bg-ash text-smoke cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {large && <span>Search</span>}
        </button>
      </div>

      {/* Suggestion chips */}
      {large && focused && !query && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-full left-0 right-0 mt-3 flex flex-wrap gap-2 z-10"
        >
          {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
            <button
              key={q}
              onMouseDown={(e) => { e.preventDefault(); setQuery(q); handleSearch(q); }}
              className="text-xs bg-graphite border border-ash text-silver hover:text-ivory hover:border-smoke rounded-full px-3 py-1.5 transition-all"
            >
              {q}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
