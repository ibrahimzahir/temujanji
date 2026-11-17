import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import {
  createBackupSnapshot,
  getDevConsolePayload,
  runDevHealthCheck,
  updateSystemConfig,
} from "@/lib/dev-service";
import { devActionSchema } from "@/lib/schemas/studio";

export const dynamic = "force-dynamic";

export const GET = withStudioApi({ roles: ["dev"] }, async () => {
  const payload = await getDevConsolePayload();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
});

export const POST = withStudioApi(
  { roles: ["dev"], schema: devActionSchema },
  async ({ role, data }) => {
    if (data.action === "healthcheck") {
      const payload = await runDevHealthCheck(role);
      return NextResponse.json(payload);
    }
    if (data.action === "maintenance") {
      const payload = await updateSystemConfig(data.payload, role);
      return NextResponse.json(payload);
    }
    const payload = await createBackupSnapshot(data.payload, role);
    return NextResponse.json(payload, { status: 201 });
  }
);
