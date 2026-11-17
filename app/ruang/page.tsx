import Link from "next/link";
import { GuestForm } from "@/components/guest-form";
import { Logout } from "@/components/account-form";
import { customerOrders, requireUser } from "@/lib/access";
import { rupiah, templates } from "@/lib/catalog";

export const metadata = { title: "Ruang Klien", robots: { index: false } };

export default async function Dashboard() {
  const user = await requireUser();
  const orders = await customerOrders(user.id);
  return <section className="shell section">
    <h1>Ruang klien.</h1><p>Halo, {user.name}.</p><Logout />
    {orders.length === 0 && <p className="panel">Belum ada pesanan. <Link href="/#koleksi">Lihat koleksi ↗</Link></p>}
    {orders.map((order) => <article className="panel" key={order.id}>
      <h3>{order.eventName}</h3>
      <p>{templates.find((item) => item.slug === order.design)?.name} · {rupiah(order.amount)} · {order.payment === "PAID" ? "Lunas" : "Menunggu pembayaran"}</p>
      {order.invitation ? <>
        <GuestForm id={order.invitation.id} />
        <h3>RSVP & ucapan</h3>
        {order.invitation.guests.length === 0 && <p>Belum ada tamu.</p>}
        <ul>{order.invitation.guests.map((guest) => <li key={guest.id}><strong>{guest.name}</strong> · {guest.attendance === "HADIR" ? "Hadir" : guest.attendance === "TIDAK_HADIR" ? "Tidak hadir" : "Belum menjawab"}{guest.wish && <p>{guest.wish}</p>}</li>)}</ul>
      </> : <p>Menunggu studio menyiapkan undangan.</p>}
    </article>)}
  </section>;
}
