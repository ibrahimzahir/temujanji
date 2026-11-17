import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import {
  getStudioDashboardPayload,
  reseedStudioDummyData,
} from "@/lib/studio-service";

export const dynamic = "force-dynamic";

export const GET = withStudioApi(
  { roles: ["admin", "dev", "editor"] },
  async ({ role }) => {
    const payload = await getStudioDashboardPayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
        "x-studio-role": role,
      },
    });
  }
);

export const POST = withStudioApi(
  { roles: ["admin", "dev"] },
  async () => {
    const payload = await reseedStudioDummyData();
    return NextResponse.json(payload);
  }
);
