import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from "@/lib/storage";
import type { WatchlistItem } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const watchlist = await getWatchlist(session.user.id);
  return NextResponse.json({ watchlist });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const item: WatchlistItem = {
    movieId: body.movieId,
    title: body.title,
    posterPath: body.posterPath,
    backdropPath: body.backdropPath,
    addedAt: new Date().toISOString(),
    watched: false,
  };

  await addToWatchlist(session.user.id, item);
  return NextResponse.json({ success: true, item });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const movieId = parseInt(searchParams.get("movieId") || "");

  if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

  await removeFromWatchlist(session.user.id, movieId);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, ...updates } = await req.json();
  await updateWatchlistItem(session.user.id, movieId, updates);
  return NextResponse.json({ success: true });
}
