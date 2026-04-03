import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTasteProfile, saveTasteProfile } from "@/lib/storage";
import type { TasteProfile } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getTasteProfile(session.user.id);
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const profile: TasteProfile = {
    favoriteGenres: body.favoriteGenres || [],
    favoriteDecades: body.favoriteDecades || [],
    favoriteDirectors: body.favoriteDirectors || [],
    moodPreferences: body.moodPreferences || [],
    ratedMovies: body.ratedMovies || [],
    lastUpdated: new Date().toISOString(),
  };

  await saveTasteProfile(session.user.id, profile);
  return NextResponse.json({ success: true, profile });
}
