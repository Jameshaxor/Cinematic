import { Suspense } from "react";
import { getTrending, getNowPlaying, getTopRated } from "@/lib/tmdb";
import { Hero } from "@/components/movie/Hero";
import { MovieRow } from "@/components/movie/MovieRow";
import { MoodPicker } from "@/components/ai/MoodPicker";
import { AIRecommendationsRow } from "@/components/ai/AIRecommendationsRow";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const [trending, nowPlaying, topRated] = await Promise.all([
    getTrending("week"),
    getNowPlaying(),
    getTopRated(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero with trending movies */}
      <Hero movies={trending.results} />

      {/* AI Personalized Recommendations */}
      <Suspense fallback={null}>
        <AIRecommendationsRow />
      </Suspense>

      {/* Mood-based discovery */}
      <MoodPicker />

      {/* Now Playing */}
      <MovieRow
        title="Now Playing"
        subtitle="In cinemas this week"
        movies={nowPlaying.results}
        labelTag="In Theatres"
        viewAllHref="/discover?type=now_playing"
      />

      {/* Top Rated All Time */}
      <MovieRow
        title="All-Time Greats"
        subtitle="The highest rated films ever made"
        movies={topRated.results}
        labelTag="Top Rated"
        viewAllHref="/discover?type=top_rated"
      />

      {/* Trending This Week */}
      <MovieRow
        title="Trending This Week"
        movies={trending.results.slice(5)}
        viewAllHref="/discover?type=trending"
      />

      {/* Bottom padding */}
      <div className="h-20" />
    </div>
  );
}
