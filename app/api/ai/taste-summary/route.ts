import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateTasteProfileSummary } from "@/lib/ai";
import { saveTasteProfile, getTasteProfile } from "@/lib/storage";
import type { TasteProfile } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const profile: TasteProfile = {
    ...body,
    lastUpdated: new Date().toISOString(),
  };

  const summary = await generateTasteProfileSummary(profile);

  // Save summary to profile
  const existing = await getTasteProfile(session.user.id);
  await saveTasteProfile(session.user.id, {
    ...existing,
    ...profile,
    aiSummary: summary,
  });

  return NextResponse.json({ summary });
}
