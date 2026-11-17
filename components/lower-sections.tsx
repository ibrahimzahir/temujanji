"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { rupiah } from "@/lib/catalog";
import type { SiteSectionsData } from "@/lib/site-sections-types";

export function LowerSections({ initialData }: { initialData: SiteSectionsData }) {
  const [data, setData] = useState<SiteSectionsData>(initialData);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/site-sections", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as { data: SiteSectionsData };
          setData(json.data);
        }
      } catch {
        // Keep SSR data if offline
      }
    };
    sync();
    window.addEventListener("temujanji-sections-updated", sync);
    return () => window.removeEventListener("temujanji-sections-updated", sync);
  }, []);

  return (
    <>
      {/* -------------------------------------------------------------------- */}
      {/* 6. DONE-FOR-YOU PROCESS & TRANSPARENT PACKAGES                       */}
      {/* -------------------------------------------------------------------- */}
      <section className="shell studio-process-section" id="proses">
        <div className="studio-process">
          <div>
            <p className="eyebrow">
              <span /> {data.process.eyebrow}
            </p>
            <h2>
              {data.process.titleLine1} <em>{data.process.titleHighlight}</em>
            </h2>
            <p style={{ color: "var(--ink-muted)", marginTop: 12, maxWidth: 500 }}>
              {data.process.description}
            </p>
            <ol className="studio-steps">
              {data.process.steps.map((step, idx) => (
                <li key={idx}>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Transparent Packages Aside */}
          <aside className="studio-packages" aria-labelledby="packages-title">
            <h3 id="packages-title">{data.packages.title}</h3>
            <p className="sub">{data.packages.subtitle}</p>

            {data.packages.items.map((item) => (
              <div className="studio-package" key={item.id}>
                {item.popular && item.badge && (
                  <span className="studio-package-badge">{item.badge}</span>
                )}
                <div className="studio-package-header">
                  <strong>{item.name}</strong>
                  <span className="price">{rupiah(item.price)}</span>
                </div>
                <p className="desc">{item.description}</p>
                {item.features.length > 0 && (
                  <ul className="studio-package-features">
                    {item.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="check" aria-hidden>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <Button asChild className="button button-terracotta" size="lg">
              <a href={data.packages.ctaHref}>
                {data.packages.ctaLabel} <span aria-hidden>↗</span>
              </a>
            </Button>
          </aside>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 7. HEARTFELT CLIENT STORIES & TESTIMONIALS                           */}
      {/* -------------------------------------------------------------------- */}
      <section className="testimonials-section">
        <div className="shell">
          <p className="eyebrow" style={{ textAlign: "center", display: "block" }}>
            <span style={{ marginInline: "auto 10px" }} /> {data.testimonials.eyebrow}
          </p>
          <h2 style={{ textAlign: "center" }}>
            {data.testimonials.titleLine1} <em>{data.testimonials.titleHighlight}</em>
          </h2>

          <div className="testimonials-grid">
            {data.testimonials.items.map((t, idx) => (
              <div className="testimonial-card" key={idx}>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <strong>{t.author}</strong>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 8. REASSURING FAQ SECTION                                            */}
      {/* -------------------------------------------------------------------- */}
      <section className="faq-section">
        <div className="shell">
          <p className="eyebrow">
            <span /> {data.faq.eyebrow}
          </p>
          <h2>{data.faq.title}</h2>

          <div className="faq-grid">
            {data.faq.items.map((item, idx) => (
              <div className="faq-item" key={idx}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
