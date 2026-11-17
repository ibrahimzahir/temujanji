import { NextResponse } from "next/server";
import type { z } from "zod";
import { studioRoleSchema, type StudioRoleType } from "@/lib/schemas/studio";

export interface StudioApiContext<TData> {
  role: StudioRoleType;
  data: TData;
  request: Request;
}

function resolveRoleFromRequest(request: Request): StudioRoleType {
  const headerRole = request.headers.get("x-studio-role");
  if (headerRole) {
    const parsed = studioRoleSchema.safeParse(headerRole);
    if (parsed.success) return parsed.data;
  }
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)tj_studio_role=([^;]+)/);
  if (match?.[1]) {
    const parsed = studioRoleSchema.safeParse(decodeURIComponent(match[1]));
    if (parsed.success) return parsed.data;
  }
  return "admin";
}

export function withStudioApi<TSchema extends z.ZodTypeAny>(
  options: {
    roles?: readonly StudioRoleType[];
    schema?: TSchema;
  },
  handler: (ctx: StudioApiContext<z.infer<TSchema>>) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    const role = resolveRoleFromRequest(request);

    if (options.roles && !options.roles.includes(role)) {
      return NextResponse.json(
        {
          error: `Peran "${role}" tidak memiliki izin untuk aksi ini.`,
          allowedRoles: options.roles,
        },
        { status: 403 }
      );
    }

    let parsedData = undefined as z.infer<TSchema>;
    if (options.schema) {
      let rawBody: unknown;
      try {
        rawBody = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Body JSON tidak valid" },
          { status: 400 }
        );
      }

      const parsed = options.schema.safeParse(rawBody);
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: parsed.error.issues[0]?.message ?? "Validasi gagal",
            issues: parsed.error.issues,
          },
          { status: 400 }
        );
      }
      parsedData = parsed.data;
    }

    try {
      return await handler({ role, data: parsedData, request });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan server";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
