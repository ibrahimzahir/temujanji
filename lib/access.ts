import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireUser(next = "/ruang") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/akun?next=${encodeURIComponent(next)}`);
  return session.user;
}

export async function requireStudio() {
  const user = await requireUser("/studio");
  const member = await db.user.findUnique({ where: { id: user.id }, select: { studio: true } });
  if (!member?.studio) notFound();
  return user;
}

export function customerOrders(ownerId: string) {
  return db.order.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: { invitation: { include: { guests: { select: { id: true, name: true, attendance: true, wish: true } } } } },
  });
}
