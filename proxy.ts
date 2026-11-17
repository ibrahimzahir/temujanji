import { NextResponse, type NextRequest } from "next/server";
import { studioRoleSchema } from "@/lib/schemas/studio";

export function proxy(request: NextRequest) {
  const cookieRole = request.cookies.get("tj_studio_role")?.value;
  const headerRole = request.headers.get("x-studio-role");
  const parsedRole = studioRoleSchema.safeParse(headerRole ?? cookieRole ?? "admin");
  const activeRole = parsedRole.success ? parsedRole.data : "admin";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-studio-role", activeRole);
  requestHeaders.set("x-temujanji-proxy", "active");

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-studio-role", activeRole);
  response.headers.set("x-temujanji-proxy", "active");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/studio/:path*"],
};
