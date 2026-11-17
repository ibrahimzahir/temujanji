import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { placeOrder } from "@/app/actions";
import { requireUser } from "@/lib/access";
import { packages, rupiah, templates } from "@/lib/catalog";

export const metadata = { title: "Pesan undangan", robots: { index: false } };

export default async function Checkout({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) notFound();
  await requireUser(`/pesan/${slug}`);
  return <section className="shell section">
    <p className="eyebrow"><span /> {template.name}</p><h1>Pesan undangan.</h1>
    <form className="stack" action={placeOrder}>
      <input type="hidden" name="checkoutKey" value={randomUUID()} /><input type="hidden" name="design" value={slug} />
      <label>Paket<select name="packageId">{packages.map((item) => <option key={item.id} value={item.id}>{item.name} · {rupiah(item.price)}</option>)}</select></label>
      <div className="panel"><strong>Pembayaran belum tersedia</strong><p>Pesanan uji coba akan disimpan sebagai menunggu pembayaran. Tidak ada tagihan.</p></div>
      <label>Nama pasangan atau judul acara<input name="eventName" maxLength={100} required /></label>
      <label>Tanggal acara<input name="eventDate" type="date" required /></label>
      <label>Lokasi<input name="venue" maxLength={160} required /></label>
      <label>Catatan untuk studio<textarea name="notes" maxLength={1500} rows={4} /></label>
      <Button>Simpan pesanan</Button>
    </form>
  </section>;
}
