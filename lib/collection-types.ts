import { templates as defaultTemplates } from "@/lib/catalog";

export interface CollectionSectionCopy {
  eyebrow: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  searchPlaceholder: string;
}

export interface ManagedTemplate {
  slug: string;
  name: string;
  category: string;
  image: string;
  color: string;
  layout: string;
  sample: string;
  description: string;
  tag: string;
  accent: string;
  venue: string;
  date: string;
  quote: string;
  published: boolean;
  sortOrder: number;
}

export interface CollectionPayload {
  section: CollectionSectionCopy;
  templates: ManagedTemplate[];
  source: "prisma" | "file";
}

export const DEFAULT_COLLECTION_SECTION: CollectionSectionCopy = {
  eyebrow: "KOLEKSI STUDIO · PILIHAN TEMA",
  titleLine1: "Temukan gaya yang mewakili",
  titleHighlight: "kisah kalian.",
  description:
    "Pilih nuansa yang paling pas di hati, lalu buka contoh undangan untuk melihatnya utuh sebagaimana para tamu tercinta akan menerimanya nanti.",
  searchPlaceholder: "Cari Desain"
};

export const DEFAULT_MANAGED_TEMPLATES: ManagedTemplate[] = defaultTemplates.map(
  (t, index) => ({
    ...t,
    published: true,
    sortOrder: index + 1
  })
);
