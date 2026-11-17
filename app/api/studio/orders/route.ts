import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import {
  createOrderSchema,
  deleteByIdSchema,
  updateOrderSchema,
} from "@/lib/schemas/studio";
import {
  createStudioOrder,
  deleteStudioOrder,
  updateStudioOrder,
} from "@/lib/studio-service";

export const dynamic = "force-dynamic";

export const POST = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: createOrderSchema },
  async ({ data }) => {
    const payload = await createStudioOrder(data);
    return NextResponse.json(payload, { status: 201 });
  }
);

export const PATCH = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: updateOrderSchema },
  async ({ data }) => {
    const payload = await updateStudioOrder(data);
    return NextResponse.json(payload);
  }
);

export const DELETE = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: deleteByIdSchema },
  async ({ data }) => {
    const payload = await deleteStudioOrder(data.id);
    return NextResponse.json(payload);
  }
);
