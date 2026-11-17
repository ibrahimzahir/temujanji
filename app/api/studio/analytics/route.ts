import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import { createAnalyticsSchema } from "@/lib/schemas/studio";
import { upsertAnalyticsDaily } from "@/lib/studio-service";

export const dynamic = "force-dynamic";

export const POST = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: createAnalyticsSchema },
  async ({ data }) => {
    const payload = await upsertAnalyticsDaily(data);
    return NextResponse.json(payload, { status: 201 });
  }
);
