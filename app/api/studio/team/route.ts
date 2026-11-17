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
  async ({ role, data }) => {
    const payload = await createStudioMember(data, role);
    return NextResponse.json(payload, { status: 201 });
  }
);

export const PATCH = withStudioApi(
  { roles: ["admin", "dev"], schema: updateTeamMemberSchema },
  async ({ role, data }) => {
    const payload = await updateStudioMember(data, role);
    return NextResponse.json(payload);
  }
);

export const DELETE = withStudioApi(
  { roles: ["admin", "dev"], schema: deleteByIdSchema },
  async ({ role, data }) => {
    const payload = await deleteStudioMember(data.id, role);
    return NextResponse.json(payload);
  }
);
