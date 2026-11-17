"use client";

import { useEffect, useState } from "react";
import { Collection } from "@/components/collection";
import type { CollectionPayload } from "@/lib/collection-types";

export function CollectionSection({ initialData }: { initialData: CollectionPayload }) {
  const [data, setData] = useState<CollectionPayload>(initialData);

  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const res = await fetch("/api/collection", { cache: "no-store" });
        if (res.ok) {
          const next = (await res.json()) as CollectionPayload;
          setData(next);
        }
      } catch {
        // Keep initial SSR data if offline
      }
    };

    syncFromBackend();
    window.addEventListener("temujanji-collection-updated", syncFromBackend);
    return () => window.removeEventListener("temujanji-collection-updated", syncFromBackend);
  }, []);

  return (
    <section className="collection studio-collection" id="koleksi">
      <div className="shell">
        <div className="section-intro">
          <div>
            <p className="eyebrow">
              <span /> {data.section.eyebrow}
            </p>
            <h2>
              {data.section.titleLine1} <em>{data.section.titleHighlight}</em>
            </h2>
          </div>
          <p>{data.section.description}</p>
        </div>
        <Collection
          items={data.templates}
          searchLabel={data.section.searchPlaceholder}
        />
      </div>
    </section>
  );
}
