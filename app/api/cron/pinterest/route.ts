import { NextResponse } from "next/server";
import { publishDuePinterestPins } from "@/lib/marketing-service";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await publishDuePinterestPins("cron");
  return NextResponse.json({
    ok: true,
    publishedCount: result.publishedCount,
    checkedAt: new Date().toISOString(),
  });
}

export async function GET() {
  const result = await publishDuePinterestPins("cron");
  return NextResponse.json({
    ok: true,
    publishedCount: result.publishedCount,
    checkedAt: new Date().toISOString(),
  });
}
