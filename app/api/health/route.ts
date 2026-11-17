import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = performance.now();
  try {
    await db.$queryRaw`SELECT 1`;
    const dbLatencyMs = Math.max(1, Math.round(performance.now() - started));
    const sys = await db.systemConfig.findUnique({ where: { id: "default" } });
    return NextResponse.json(
      {
        ok: true,
        status: sys?.maintenanceMode ? "MAINTENANCE" : "HEALTHY",
        maintenanceMode: Boolean(sys?.maintenanceMode),
        dbLatencyMs,
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "DEGRADED",
        error: error instanceof Error ? error.message : "Database unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
