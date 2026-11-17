"use server";

import { createHash, randomBytes } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { requireStudio, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { packages, templates } from "@/lib/catalog";
import { paymentProvider } from "@/lib/payment";

const text = (max: number) => z.string().trim().min(1).max(max);
const orderSchema = z.object({
  checkoutKey: z.uuid(), design: text(80), packageId: text(30),
  eventName: text(100), eventDate: z.iso.date(), venue: text(160),
  notes: z.string().trim().max(1500),
});

export async function placeOrder(form: FormData) {
  const user = await requireUser();
  const input = orderSchema.safeParse(Object.fromEntries(form));
  if (!input.success) redirect("/#koleksi");
  const { data } = input;
  const item = packages.find(({ id }) => id === data.packageId);
  if (!item || !templates.some(({ slug }) => slug === data.design)) notFound();
  const checkoutKey = createHash("sha256").update(`${user.id}:${data.checkoutKey}`).digest("hex");
  const payment = await paymentProvider.prepare({ checkoutKey, amount: item.price });
  await db.order.upsert({
    where: { checkoutKey },
    create: { ...data, checkoutKey, ownerId: user.id, amount: item.price, payment: payment.status },
    update: {},
  });
  redirect("/ruang");
}

export async function publishInvitation(form: FormData) {
  await requireStudio();
  const orderId = text(50).parse(form.get("orderId"));
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();
  await db.invitation.upsert({ where: { orderId }, create: { orderId }, update: {} });
  redirect("/studio");
}

const tokenSchema = z.string().regex(/^[a-zA-Z0-9_-]{43}$/);
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function addGuest(_: { link: string; error: string }, form: FormData) {
  const user = await requireUser();
  const parsed = z.object({ invitationId: text(50), name: text(100) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { link: "", error: "Isi nama tamu." };
  const { invitationId, name } = parsed.data;
  const invitation = await db.invitation.findFirst({ where: { id: invitationId, order: { ownerId: user.id } }, select: { id: true } });
  if (!invitation) notFound();
  const token = randomBytes(32).toString("base64url");
  await db.guest.create({ data: { tokenHash: hashToken(token), invitationId, name } });
  return { link: `/undangan/${token}`, error: "" };
}

export async function respond(form: FormData) {
  const parsed = z.object({ token: tokenSchema, attendance: z.enum(["HADIR", "TIDAK_HADIR"]), wish: z.string().trim().max(500) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) notFound();
  const { token, attendance, wish } = parsed.data;
  const now = new Date();
  const result = await db.guest.updateMany({
    where: { tokenHash: hashToken(token), OR: [{ respondedAt: null }, { respondedAt: { lte: new Date(+now - 10_000) } }] },
    data: { attendance, wish, respondedAt: now },
  });
  redirect(`/undangan/${token}?hasil=${result.count ? "tersimpan" : "tunggu"}`);
}
