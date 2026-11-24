import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { publishDuePinterestPins } from "@/lib/marketing-service";

export const dynamic = "force-dynamic";

function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    // Allow local dev/loopback when CRON_SECRET is not configured
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const headerSecret = request.headers.get("x-cron-secret")?.trim() ?? "";
  const provided = bearer || headerSecret;

  if (!provided || provided.length !== secret.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
}

async function handleCron(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized cron invocation" },
      { status: 401 }
    );
  }

  const result = await publishDuePinterestPins("cron");
  return NextResponse.json(
    {
      ok: true,
      publishedCount: result.publishedCount,
      checkedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  return handleCron(request);
}

export async function GET(request: Request) {
  return handleCron(request);
}
