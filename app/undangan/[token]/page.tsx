import { createHash } from "node:crypto";
import { InvitationCover } from "@/components/invitation-cover";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { respond } from "@/app/actions";
import { db } from "@/lib/db";
import { templates } from "@/lib/catalog";

export const metadata = { title: "Undangan untuk Anda", robots: { index: false, follow: false } };

export default async function Invitation({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ hasil?: string }> }) {
  const { token } = await params;
  const { hasil } = await searchParams;
  if (!/^[a-zA-Z0-9_-]{43}$/.test(token)) notFound();
  const guest = await db.guest.findUnique({ where: { tokenHash: createHash("sha256").update(token).digest("hex") }, include: { invitation: { include: { order: true } } } });
  if (!guest) notFound();
  const { order } = guest.invitation;
  const template = templates.find(({ slug }) => slug === order.design);
  if (!template) notFound();
  return <section className="shell section preview">
    <InvitationCover template={template} title={order.eventName} greeting={`Untuk ${guest.name}`} />
    <h2>Sampai jumpa.</h2>
    <p>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" }).format(new Date(order.eventDate))} · {order.venue}</p>
    <form className="stack" action={respond}>
      <input type="hidden" name="token" value={token} />
      <label>Konfirmasi kehadiran<select name="attendance" defaultValue={guest.attendance ?? ""} required><option value="" disabled>Pilih jawaban</option><option value="HADIR">Hadir</option><option value="TIDAK_HADIR">Tidak hadir</option></select></label>
      <label>Ucapan<textarea name="wish" defaultValue={guest.wish} maxLength={500} rows={3} /></label>
      <Button>Kirim RSVP</Button>
      {hasil === "tersimpan" && <p role="status">Terima kasih. Jawaban tersimpan.</p>}
      {hasil === "tunggu" && <p role="status">Tunggu 10 detik sebelum memperbarui jawaban.</p>}
    </form>
  </section>;
}
