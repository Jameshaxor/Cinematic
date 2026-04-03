"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, User, Film, Star, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TasteProfile } from "@/types";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Animation", "Crime", "Mystery", "Documentary", "Fantasy"];
const DECADES = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
const MOODS = ["Late night binge", "Sunday afternoon", "Date night", "Solo deep dive", "Background watching", "Need a good cry", "Need a good laugh"];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local editing state
  const [genres, setGenres] = useState<string[]>([]);
  const [decades, setDecades] = useState<string[]>([]);
  const [moodPrefs, setMoodPrefs] = useState<string[]>([]);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile(d.profile);
          setGenres(d.profile.favoriteGenres || []);
          setDecades(d.profile.favoriteDecades || []);
          setMoodPrefs(d.profile.moodPreferences || []);
          setAiSummary(d.profile.aiSummary || "");
        }
      })
      .finally(() => setLoading(false));
  }, [session]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        favoriteGenres: genres,
        favoriteDecades: decades,
        moodPreferences: moodPrefs,
        favoriteDirectors: profile?.favoriteDirectors || [],
        ratedMovies: profile?.ratedMovies || [],
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const generateSummary = async () => {
    setGeneratingSummary(true);
    const res = await fetch("/api/ai/taste-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favoriteGenres: genres, favoriteDecades: decades, moodPreferences: moodPrefs, favoriteDirectors: [], ratedMovies: profile?.ratedMovies || [] }),
    });
    const d = await res.json();
    setAiSummary(d.summary || "");
    setGeneratingSummary(false);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen pt-24 section-padding"><div className="skeleton h-8 w-64 rounded" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 text-smoke mx-auto mb-4" />
          <h2 className="heading-md text-ivory mb-2">Sign in to build your taste profile</h2>
          <p className="text-silver text-sm mb-6">Get AI-powered recommendations tailored to you</p>
          <Link href="/auth/signin" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-padding max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          {session.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-ember" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-graphite border-2 border-ash flex items-center justify-center">
              <User className="w-7 h-7 text-silver" />
            </div>
          )}
          <div>
            <h1 className="heading-md text-ivory">{session.user?.name}</h1>
            <p className="text-sm text-silver">{session.user?.email}</p>
          </div>
        </div>

        {/* AI Taste Summary */}
        {(aiSummary || genres.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 bg-obsidian border border-ember/20 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ember" />
                <span className="label-sm text-ember">Your Cinematic Identity</span>
              </div>
              <button
                onClick={generateSummary}
                disabled={generatingSummary || genres.length === 0}
                className="text-xs text-ember hover:text-ember-light transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {generatingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {aiSummary ? "Regenerate" : "Generate"}
              </button>
            </div>
            {aiSummary ? (
              <p className="text-sm text-mist leading-relaxed">{aiSummary}</p>
            ) : (
              <p className="text-sm text-smoke italic">Fill in your preferences below and generate your AI taste profile.</p>
            )}
          </motion.div>
        )}

        <div className="space-y-10">
          {/* Genres */}
          <section>
            <h2 className="heading-md text-ivory mb-1">Favourite Genres</h2>
            <p className="text-sm text-silver mb-4">Select all that resonate with you</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggle(genres, setGenres, g)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all",
                    genres.includes(g)
                      ? "bg-ember border-ember text-void font-semibold"
                      : "border-ash text-silver hover:border-smoke hover:text-ivory"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </section>

          {/* Decades */}
          <section>
            <h2 className="heading-md text-ivory mb-1">Favourite Eras</h2>
            <p className="text-sm text-silver mb-4">Which decades speak to you?</p>
            <div className="flex flex-wrap gap-2">
              {DECADES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggle(decades, setDecades, d)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all font-mono",
                    decades.includes(d)
                      ? "bg-ember border-ember text-void font-semibold"
                      : "border-ash text-silver hover:border-smoke hover:text-ivory"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Mood preferences */}
          <section>
            <h2 className="heading-md text-ivory mb-1">How You Watch</h2>
            <p className="text-sm text-silver mb-4">Your typical viewing moods</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggle(moodPrefs, setMoodPrefs, m)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all",
                    moodPrefs.includes(m)
                      ? "bg-ember border-ember text-void font-semibold"
                      : "border-ash text-silver hover:border-smoke hover:text-ivory"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* Rated movies */}
          {profile?.ratedMovies && profile.ratedMovies.length > 0 && (
            <section>
              <h2 className="heading-md text-ivory mb-4">Films You've Rated</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {profile.ratedMovies.slice(0, 12).map((r) => (
                  <Link key={r.movieId} href={`/film/${r.movieId}`} className="group">
                    <div className="relative poster-ratio rounded-lg overflow-hidden bg-graphite">
                      {r.posterPath && (
                        <img src={`https://image.tmdb.org/t/p/w342${r.posterPath}`} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-void/80">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-2.5 h-2.5", i < r.rating ? "fill-ember text-ember" : "text-smoke")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-silver mt-1 truncate group-hover:text-ivory transition-colors">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Save */}
          <div className="flex gap-3 pt-4 border-t border-ash">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saved ? "Saved!" : saving ? "Saving..." : "Save Preferences"}
            </button>
            <button
              onClick={generateSummary}
              disabled={generatingSummary || genres.length === 0}
              className="btn-ghost flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
