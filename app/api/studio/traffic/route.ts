import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import { createTrafficHitSchema } from "@/lib/schemas/studio";
import { upsertTrafficHit } from "@/lib/studio-service";

export const dynamic = "force-dynamic";

export const POST = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: createTrafficHitSchema },
  async ({ data }) => {
    const payload = await upsertTrafficHit(data);
    return NextResponse.json(payload, { status: 201 });
  }
);
