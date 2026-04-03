import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Calendar, DollarSign, Users, Play } from "lucide-react";
import { getMovieDetails, backdropUrl, posterUrl, profileUrl, formatYear, formatRuntime } from "@/lib/tmdb";
import { formatCurrency, getRatingColor, getRatingLabel } from "@/lib/utils";
import { AIInsightPanel } from "@/components/ai/AIInsightPanel";
import { MovieRow } from "@/components/movie/MovieRow";
import { WatchlistButton } from "@/components/movie/WatchlistButton";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(parseInt(params.id));
    return {
      title: `${movie.title} (${formatYear(movie.release_date)})`,
      description: movie.overview,
    };
  } catch {
    return { title: "Film Not Found" };
  }
}

export default async function FilmPage({ params }: Props) {
  const movieId = parseInt(params.id);
  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const cast = movie.credits?.cast.slice(0, 8) || [];
  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const similar = movie.similar?.results.slice(0, 10) || [];

  return (
    <div className="min-h-screen">
      {/* Hero backdrop */}
      <div className="relative h-[65vh] min-h-[500px]">
        <Image
          src={backdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-void/50" />
        <div className="absolute inset-0 gradient-bottom" />
        <div className="absolute inset-0 gradient-left" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-void to-transparent" />
      </div>

      {/* Main content */}
      <div className="section-padding -mt-48 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="shrink-0 w-40 md:w-56 lg:w-64">
            <div className="relative poster-ratio rounded-xl overflow-hidden shadow-cinema border border-ash/30">
              <Image
                src={posterUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Trailer button */}
            {trailer && (
              <a
                href={`https://youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full flex items-center justify-center gap-2 mt-4 text-sm py-2.5"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Trailer
              </a>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-2 md:pt-24">
            {/* Tagline */}
            {movie.tagline && (
              <p className="label-sm text-ember mb-3 italic">{movie.tagline}</p>
            )}

            {/* Title */}
            <h1 className="heading-lg text-ivory mb-2">{movie.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
              <div className={`flex items-center gap-1.5 font-mono text-sm font-medium ${getRatingColor(movie.vote_average)}`}>
                <Star className="w-4 h-4 fill-current" />
                {movie.vote_average.toFixed(1)}
                <span className="text-silver font-normal text-xs">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <span className="text-silver text-sm">{getRatingLabel(movie.vote_average)}</span>
              <span className="text-ash">·</span>
              <div className="flex items-center gap-1.5 text-silver text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {formatYear(movie.release_date)}
              </div>
              {movie.runtime && (
                <>
                  <span className="text-ash">·</span>
                  <div className="flex items-center gap-1.5 text-silver text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRuntime(movie.runtime)}
                  </div>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g) => (
                <Link
                  key={g.id}
                  href={`/discover?genre=${g.id}`}
                  className="text-xs border border-ash text-mist px-3 py-1 rounded-full hover:border-ember hover:text-ember-light transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Overview */}
            <p className="text-sm text-mist/85 leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <div className="mb-6 flex items-center gap-2">
                <span className="label-sm">Directed by</span>
                <span className="text-sm text-ivory font-semibold">{director.name}</span>
              </div>
            )}

            {/* Financials */}
            <div className="flex flex-wrap gap-6 mb-8">
              {movie.budget && movie.budget > 0 && (
                <div>
                  <p className="label-sm mb-1">Budget</p>
                  <p className="text-sm text-ivory font-mono">{formatCurrency(movie.budget)}</p>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div>
                  <p className="label-sm mb-1">Box Office</p>
                  <p className="text-sm text-ivory font-mono">{formatCurrency(movie.revenue)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <WatchlistButton
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                backdropPath={movie.backdrop_path}
              />
            </div>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="mt-10 max-w-2xl">
          <AIInsightPanel movieId={movie.id} movieTitle={movie.title} />
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="heading-md text-ivory mb-5">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {cast.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-graphite mb-2 border border-ash group-hover:border-ember transition-colors">
                    <Image
                      src={profileUrl(member.profile_path)}
                      alt={member.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-ivory truncate">{member.name}</p>
                  <p className="text-xs text-silver truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-12 -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24">
            <MovieRow
              title="More Like This"
              movies={similar}
              labelTag="Similar Films"
            />
          </div>
        )}
      </div>
    </div>
  );
}
