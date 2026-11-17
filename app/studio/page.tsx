import { Button } from "@/components/ui/button";
import { publishInvitation } from "@/app/actions";
import { requireStudio } from "@/lib/access";
import { db } from "@/lib/db";

export const metadata = { title: "Studio", robots: { index: false } };

export default async function Studio() {
  await requireStudio();
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { invitation: { select: { id: true } } } });
  return <section className="shell section"><h1>Studio.</h1>
    {orders.length === 0 && <p>Belum ada pesanan.</p>}
    {orders.map((order) => <article className="panel" key={order.id}>
      <h3>{order.eventName}</h3><p>{order.design} · {order.packageId} · {order.eventDate} · {order.venue}</p><p>{order.notes}</p>
      {order.invitation ? <p>Undangan siap dibagikan.</p> : <form action={publishInvitation}><input type="hidden" name="orderId" value={order.id} /><Button>Buat undangan</Button></form>}
    </article>)}
  </section>;
}
