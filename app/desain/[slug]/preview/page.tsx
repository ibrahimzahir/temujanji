import { DemoOpening } from "@/components/demo-opening";
import { InvitationCover } from "@/components/invitation-cover";
import Link from "next/link";
import { notFound } from "next/navigation";
import { templates } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return templates.map(({ slug }) => ({ slug }));
}

export default async function Preview({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) notFound();

  const isKhitanan = template.category === "Khitanan";
  const venue = "venue" in template ? template.venue : "Plataran Hutan Kota, Jakarta";
  const dateFormatted = "date" in template ? template.date : "Sabtu, 24 Oktober 2026";

  return (
    <section className="shell section preview">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Link href={`/desain/${slug}`} className="studio-text-link">
          ← Kembali ke detail {template.name}
        </Link>
        <span style={{ fontSize: 12, color: "var(--ink-subtle)" }}>
          Simulasi Pratinjau Pengalaman Tamu
        </span>
      </div>

      <DemoOpening
        image={template.image}
        title={template.sample}
        eventLabel={isKhitanan ? "Syukuran Keluarga" : "Undangan Pernikahan"}
        venue={venue}
        dateFormatted={dateFormatted}
      >
        <InvitationCover
          template={template}
          title={template.sample}
          greeting={isKhitanan ? "Undangan Syukuran" : "Undangan Pernikahan"}
        />
      </DemoOpening>

      <div className="demo-order">
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          <span /> COCOK DENGAN NUANSA INI?
        </p>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBlock: "8px 16px" }}>
          Miliki desain <em>{template.name}</em> untuk hari bahagia kalian.
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 24px", color: "var(--ink-muted)", fontSize: 15 }}>
          Kalian cukup mengirimkan detail acara dan foto kenangan. Kurator studio kami yang akan
          merapikan setiap huruf dan tata letaknya hingga sempurna.
        </p>
        <Button size="lg" asChild className="button button-terracotta">
          <Link href={`/pesan/${slug}`}>
            Pilih paket dan pesan sekarang <span aria-hidden>↗</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
