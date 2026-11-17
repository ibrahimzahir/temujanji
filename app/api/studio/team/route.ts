import { NextResponse } from "next/server";
import { withStudioApi } from "@/lib/api-middleware";
import {
  createTeamMemberSchema,
  deleteByIdSchema,
  updateTeamMemberSchema,
} from "@/lib/schemas/studio";
import {
  createStudioMember,
  deleteStudioMember,
  updateStudioMember,
} from "@/lib/studio-service";

export const dynamic = "force-dynamic";

export const POST = withStudioApi(
  { roles: ["admin", "dev"], schema: createTeamMemberSchema },
  async ({ data }) => {
    const payload = await createStudioMember(data);
    return NextResponse.json(payload, { status: 201 });
  }
);

export const PATCH = withStudioApi(
  { roles: ["admin", "dev"], schema: updateTeamMemberSchema },
  async ({ data }) => {
    const payload = await updateStudioMember(data);
    return NextResponse.json(payload);
  }
);

export const DELETE = withStudioApi(
  { roles: ["admin", "dev"], schema: deleteByIdSchema },
  async ({ data }) => {
    const payload = await deleteStudioMember(data.id);
    return NextResponse.json(payload);
  }
);
