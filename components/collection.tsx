"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { InvitationCover } from "@/components/invitation-cover";
import Link from "next/link";
import { categories as defaultCategories, templates as defaultTemplates } from "@/lib/catalog";
import type { ManagedTemplate } from "@/lib/collection-types";

function CatalogCard3D({ template }: { template: ManagedTemplate | (typeof defaultTemplates)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isKhitanan = template.category === "Khitanan";
  const tag = "tag" in template ? template.tag : null;

  // 3D tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      className="catalog-entry preserve-3d"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900
      }}
    >
      <Link className="design-card" href={`/desain/${template.slug}`}>
        <div className="card-badge-wrap">
          {tag && <span className="card-tag">{tag}</span>}
          <InvitationCover
            template={template as unknown as (typeof defaultTemplates)[number]}
            title={template.sample}
            greeting={isKhitanan ? "Undangan Syukuran" : "Undangan Pernikahan"}
            thumbnail
          />
        </div>
        <div className="card-caption">
          <div>
            <p>{template.category}</p>
            <h3>{template.name}</h3>
          </div>
          <span aria-hidden title="Lihat detail">↗</span>
        </div>
      </Link>
      <div className="catalog-actions">
        <Link
          href={`/desain/${template.slug}/preview`}
          title={`Coba buka demo undangan ${template.name}`}
        >
          <span>Buka demo tamu</span>
          <span aria-hidden>↗</span>
        </Link>
        <Link
          href={`/pesan/${template.slug}`}
          title={`Pilih paket untuk desain ${template.name}`}
          style={{ color: "var(--ink)" }}
        >
          <span>Pilih desain</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}

export function Collection({
  items,
  searchLabel = "Cari Desain"
}: {
  items?: ManagedTemplate[];
  searchLabel?: string;
} = {}) {
  const [category, setCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");

  const activeTemplates = (items ?? defaultTemplates).filter(
    (t) => !("published" in t) || t.published !== false
  );

  const dynamicCategories = Array.from(
    new Set([...defaultCategories, ...activeTemplates.map((t) => t.category)])
  ).filter((cat) => activeTemplates.some((t) => t.category === cat));

  const keyword = query.trim().toLocaleLowerCase("id");
  const shown = activeTemplates.filter((template) =>
    (category === "Semua" || template.category === category) &&
    `${template.name} ${template.category} ${template.description} ${"tag" in template ? template.tag : ""}`
      .toLocaleLowerCase("id")
      .includes(keyword)
  );

  const getCategoryCount = (cat: string) => {
    if (cat === "Semua") return activeTemplates.length;
    return activeTemplates.filter((t) => t.category === cat).length;
  };

  return (
    <>
      <div className="collection-search">
        <label htmlFor="design-search">{searchLabel}</label>
        <div className="search-input-group">
          <input
            id="design-search"
            type="search"
            placeholder="Cari nuansa (contoh: Adat, Floral, Motion, Modern...)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery("")}
              aria-label="Hapus kata pencarian"
            >
              ✕
            </button>
          )}
        </div>
        <p role="status">
          Menampilkan <strong>{shown.length}</strong> dari {activeTemplates.length} karya studio
        </p>
      </div>

      <div className="filters" aria-label="Filter kategori desain">
        {["Semua", ...dynamicCategories].map((label) => {
          const count = getCategoryCount(label);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={label === category}
              onClick={() => setCategory(label)}
            >
              <span>{label}</span>
              <span className="count">{count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>
            Belum ada desain yang cocok dengan pencarian <em>&ldquo;{query}&rdquo;</em>.
          </p>
          <button
            className="button button-outline"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("Semua");
            }}
          >
            Tampilkan semua koleksi studio
          </button>
        </div>
      )}

      <div className="card-grid" data-editorial={category === "Semua" && !keyword}>
        {shown.map((template) => (
          <CatalogCard3D key={template.slug} template={template} />
        ))}
      </div>
    </>
  );
}
