import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import {
  createPinterestPin,
  deletePinterestPin,
  generateAndSavePinterestPin,
  listPinterestPins,
  publishDuePinterestPins,
  updatePinterestPin,
} from "@/lib/marketing-service";
import {
  createPinterestPinSchema,
  deleteByIdSchema,
  generatePinterestPinSchema,
  updatePinterestPinSchema,
} from "@/lib/schemas/studio";

export const dynamic = "force-dynamic";

export const GET = withStudioApi(
  { roles: ["admin", "dev", "editor"] },
  async () => {
    const pins = await listPinterestPins();
    return NextResponse.json({ pins }, { headers: { "Cache-Control": "no-store" } });
  }
);

export const POST = withStudioApi(
  { roles: ["admin", "dev", "editor"] },
  async ({ role, request }) => {
    const body = await request.json();

    if (body?.mode === "publish-due") {
      const result = await publishDuePinterestPins(role);
      return NextResponse.json(result);
    }

    if (body?.mode === "generate") {
      const parsed = generatePinterestPinSchema.safeParse(body.payload);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Data generator tidak valid" },
          { status: 400 }
        );
      }
      const pins = await generateAndSavePinterestPin(parsed.data, role);
      return NextResponse.json({ pins }, { status: 201 });
    }

    const parsed = createPinterestPinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data Pin tidak valid" },
        { status: 400 }
      );
    }
    const pins = await createPinterestPin(parsed.data, role);
    return NextResponse.json({ pins }, { status: 201 });
  }
);

export const PATCH = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: updatePinterestPinSchema },
  async ({ role, data }) => {
    const pins = await updatePinterestPin(data, role);
    return NextResponse.json({ pins });
  }
);

export const DELETE = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: deleteByIdSchema },
  async ({ data }) => {
    const pins = await deletePinterestPin(data.id);
    return NextResponse.json({ pins });
  }
);
