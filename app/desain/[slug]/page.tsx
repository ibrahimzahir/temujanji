import Link from "next/link";
import { notFound } from "next/navigation";
import { templates, packages, rupiah } from "@/lib/catalog";
import { getCollectionData } from "@/lib/collection-service";
import { InvitationCover } from "@/components/invitation-cover";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return templates.map(({ slug }) => ({ slug }));
}

export default async function Design({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collectionData = await getCollectionData();
  const template =
    collectionData.templates.find((item) => item.slug === slug) ??
    templates.find((item) => item.slug === slug);

  if (!template) notFound();

  const isKhitanan = template.category === "Khitanan";
  const tag = "tag" in template && template.tag ? template.tag : "Koleksi Studio";
  const quote = "quote" in template ? template.quote : null;
  const venue = "venue" in template ? template.venue : "Indonesia";
  const dateStr = "date" in template ? template.date : "Tahun 2026/2027";
  const accent = "accent" in template ? template.accent : "#5b236b";

  const related = collectionData.templates
    .filter((t) => t.slug !== template.slug && t.published !== false)
    .slice(0, 3);

  return (
    <div className="design-detail-page">
      {/* ------------------------------------------------------------------ */}
      {/* 1. LUXURY EDITORIAL DETAIL HERO                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="detail-hero-section">
        <div className="shell">
          <Link href="/#koleksi" className="detail-back-link">
            <span aria-hidden>←</span> Kembali ke semua koleksi studio
          </Link>

          <div className="detail-showcase-grid">
            {/* LEFT: Interactive Stationery Cover Stage */}
            <div className="detail-stage-panel">
              <div className="detail-stage-glow" aria-hidden />
              <div className="detail-stage-badge-row">
                <span className="detail-tag-pill">✦ {tag}</span>
                <div className="detail-swatch-group" title="Palet Warna Tema">
                  <span className="swatch-dot" style={{ backgroundColor: template.color }} />
                  <span className="swatch-dot" style={{ backgroundColor: accent }} />
                </div>
              </div>

              <div className="detail-cover-frame">
                <InvitationCover
                  template={template as unknown as (typeof templates)[number]}
                  title={template.sample}
                  greeting={isKhitanan ? "Undangan Syukuran" : "Undangan Pernikahan"}
                />
              </div>

              <div className="detail-stage-caption">
                <span>Pratinjau Cover · {template.sample}</span>
                <Link href={`/desain/${slug}/preview`}>
                  Lihat mode tamu penuh ↗
                </Link>
              </div>
            </div>

            {/* RIGHT: Editorial Typography, Specs & Actions */}
            <div className="detail-info-panel">
              <p className="eyebrow">
                <span /> {template.category} · {tag}
              </p>

              <h1 className="detail-title">
                {template.name}
                <span className="detail-script-sub">{template.sample}</span>
              </h1>

              <p className="detail-description">{template.description}</p>

              {quote && (
                <blockquote className="detail-quote">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              )}

              {/* Structured Specs Grid */}
              <div className="detail-specs-grid">
                <div className="detail-spec-card">
                  <span>Tata Letak</span>
                  <strong style={{ textTransform: "capitalize" }}>{template.layout}</strong>
                </div>
                <div className="detail-spec-card">
                  <span>Suasana Acara</span>
                  <strong>{isKhitanan ? "Syukuran Keluarga" : "Pernikahan Elegan"}</strong>
                </div>
                <div className="detail-spec-card">
                  <span>Contoh Lokasi</span>
                  <strong>{venue}</strong>
                </div>
                <div className="detail-spec-card">
                  <span>Contoh Jadwal</span>
                  <strong>{dateStr}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="detail-actions">
                <Button size="lg" asChild>
                  <Link href={`/pesan/${slug}`}>
                    Pesan Desain Ini · Mulai {rupiah(packages[0].price)} <span aria-hidden>→</span>
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href={`/desain/${slug}/preview`}>
                    Buka Pratinjau Tamu <span aria-hidden>↗</span>
                  </Link>
                </Button>
              </div>

              <p className="detail-assurance">
                ✓ 100% disiapkan oleh kurator studio · Bebas revisi teks &amp; jadwal hingga hari H
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. INCLUDED STUDIO FEATURES                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="detail-features-section">
        <div className="shell">
          <div className="detail-features-grid">
            <div className="detail-feature-item">
              <span className="feature-num">01</span>
              <h3>Tautan Tamu Personal</h3>
              <p>Sapa setiap kerabat dan sahabat dengan nama mereka secara otomatis tanpa batasan jumlah.</p>
            </div>
            <div className="detail-feature-item">
              <span className="feature-num">02</span>
              <h3>RSVP &amp; Buku Tamu Live</h3>
              <p>Pantau konfirmasi kehadiran serta untaian doa restu langsung melalui Ruang Klien.</p>
            </div>
            <div className="detail-feature-item">
              <span className="feature-num">03</span>
              <h3>Peta &amp; Hitung Mundur</h3>
              <p>Integrasi Google Maps akurat dan penanda waktu menuju hari bahagia kalian.</p>
            </div>
            <div className="detail-feature-item">
              <span className="feature-num">04</span>
              <h3>Dukungan Penuh Kurator</h3>
              <p>Kalian cukup kirim foto &amp; detail acara; seluruh tata letak kami rapikan dalam 1×24 jam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. RELATED DESIGNS                                                 */}
      {/* ------------------------------------------------------------------ */}
      {related.length > 0 && (
        <section className="detail-related-section">
          <div className="shell">
            <div className="detail-related-header">
              <div>
                <p className="eyebrow">
                  <span /> EKSPLORASI LAINNYA
                </p>
                <h2>
                  Pilihan tema <em>serupa dari studio.</em>
                </h2>
              </div>
              <Link href="/#koleksi" className="studio-text-link">
                Lihat semua tema <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="detail-related-grid">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/desain/${item.slug}`}
                  className="detail-related-card"
                >
                  <div className="detail-related-thumb">
                    <InvitationCover
                      template={item as unknown as (typeof templates)[number]}
                      title={item.sample}
                      greeting={item.category === "Khitanan" ? "Undangan Syukuran" : "Undangan Pernikahan"}
                      thumbnail
                    />
                  </div>
                  <div className="detail-related-meta">
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
