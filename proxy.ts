import { NextResponse, type NextRequest } from "next/server";
import { studioRoleSchema } from "@/lib/schemas/studio";

export function proxy(request: NextRequest) {
  const cookieRole = request.cookies.get("tj_studio_role")?.value;
  const headerRole = request.headers.get("x-studio-role");
  const parsedRole = studioRoleSchema.safeParse(headerRole ?? cookieRole ?? "admin");
  const activeRole = parsedRole.success ? parsedRole.data : "admin";

  const requestId =
    request.headers.get("x-request-id") ?? crypto.randomUUID();
  const clientIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for") ??
    "127.0.0.1";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-studio-role", activeRole);
  requestHeaders.set("x-temujanji-proxy", "active");
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-client-ip", clientIp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-studio-role", activeRole);
  response.headers.set("x-temujanji-proxy", "active");
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/studio/:path*"],
};
