"use client";

import { motion } from "motion/react";

interface StudioPillarsProps {
  categoriesCount: number;
  startingPrice: string;
}

const PILLARS = [
  {
    num: "01",
    label: "Pilihan Tema",
    getValue: (count: number) => `${count} Kategori Desain`,
    sub: "Dari tradisi adat nusantara hingga seni kontemporer",
    accent: "Koleksi Kurasi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c2.5 3.5 5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 2.5-5.5 5-9Z" />
        <path d="M12 12v9" />
        <path d="M8.5 16.5C6 16 4 14 4 11c2.5 0 4.5 1 6 3" />
        <path d="M15.5 16.5C18 16 20 14 20 11c-2.5 0-4.5 1-6 3" />
      </svg>
    )
  },
  {
    num: "02",
    label: "Paket Transparan",
    getValue: (_: number, price: string) => `Mulai ${price}`,
    sub: "Sekali bayar tanpa biaya tersembunyi",
    accent: "Jelas & Pasti",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
        <path d="M2 9h20" />
        <path d="m12 21 3-12-3-6-3 6 3 12Z" />
      </svg>
    )
  },
  {
    num: "03",
    label: "Sentuhan Personal",
    getValue: () => "Tautan Tamu Khusus",
    sub: "Setiap tamu disapa secara personal tanpa batas",
    accent: "Tanpa Batas Tamu",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    )
  },
  {
    num: "04",
    label: "Layanan Studio",
    getValue: () => "Done-for-You",
    sub: "Kalian santai, kurator kami yang menyelaraskan detailnya",
    accent: "Terima Beres",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
        <path d="M5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9L5 17Z" />
        <path d="M19 15l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z" />
      </svg>
    )
  }
];

export function StudioPillars({ categoriesCount, startingPrice }: StudioPillarsProps) {
  return (
    <section className="studio-pillars-section" aria-label="Keunggulan Studio Temu Janji">
      <div className="shell">
        <div className="pillars-grid">
          {PILLARS.map((item, idx) => (
            <motion.article
              key={item.num}
              className={`pillar-card ${idx % 2 === 1 ? "is-offset" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {/* Top Row: Medallion Icon + Index Pill */}
              <div className="pillar-card-top">
                <div className="pillar-icon-medallion" aria-hidden>
                  {item.icon}
                </div>
                <span className="pillar-accent-tag">{item.accent}</span>
              </div>

              {/* Label & Hero Value */}
              <div className="pillar-card-body">
                <span className="pillar-kicker">{item.num} · {item.label}</span>
                <h3 className="pillar-value">
                  {item.getValue(categoriesCount, startingPrice)}
                </h3>
                <p className="pillar-desc">{item.sub}</p>
              </div>

              {/* Subtle Gold Corner Hairline */}
              <div className="pillar-gold-corner" aria-hidden />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
