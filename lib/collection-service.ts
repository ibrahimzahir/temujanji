import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import {
  DEFAULT_COLLECTION_SECTION,
  DEFAULT_MANAGED_TEMPLATES,
  type CollectionPayload,
  type CollectionSectionCopy,
  type ManagedTemplate
} from "@/lib/collection-types";

export {
  DEFAULT_COLLECTION_SECTION,
  DEFAULT_MANAGED_TEMPLATES,
  type CollectionPayload,
  type CollectionSectionCopy,
  type ManagedTemplate
};

const STORE_FILE = path.join(process.cwd(), "data", "collection-store.json");

async function readFileStore(): Promise<CollectionPayload> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<CollectionPayload>;
    return {
      section: { ...DEFAULT_COLLECTION_SECTION, ...(parsed.section ?? {}) },
      templates:
        Array.isArray(parsed.templates) && parsed.templates.length > 0
          ? parsed.templates
          : DEFAULT_MANAGED_TEMPLATES,
      source: "file"
    };
  } catch {
    const initial: CollectionPayload = {
      section: DEFAULT_COLLECTION_SECTION,
      templates: DEFAULT_MANAGED_TEMPLATES,
      source: "file"
    };
    await writeFileStore(initial);
    return initial;
  }
}

async function writeFileStore(payload: Omit<CollectionPayload, "source">): Promise<void> {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(
    STORE_FILE,
    JSON.stringify(
      {
        section: payload.section,
        templates: payload.templates
      },
      null,
      2
    ),
    "utf8"
  );
}

export async function getCollectionData(): Promise<CollectionPayload> {
  try {
    const [config, rows] = await Promise.all([
      db.collectionSectionConfig.findUnique({ where: { id: "default" } }),
      db.designTemplate.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
    ]);

    if (!config) {
      await db.collectionSectionConfig.create({
        data: { id: "default", ...DEFAULT_COLLECTION_SECTION }
      });
    }

    if (rows.length === 0) {
      await db.designTemplate.createMany({
        data: DEFAULT_MANAGED_TEMPLATES.map((t) => ({
          slug: t.slug,
          name: t.name,
          category: t.category,
          image: t.image,
          color: t.color,
          layout: t.layout,
          sample: t.sample,
          description: t.description,
          tag: t.tag,
          accent: t.accent,
          venue: t.venue,
          date: t.date,
          quote: t.quote,
          published: t.published,
          sortOrder: t.sortOrder
        })),
        skipDuplicates: true
      });
    }

    const finalConfig =
      config ?? (await db.collectionSectionConfig.findUnique({ where: { id: "default" } }));
    const finalRows =
      rows.length > 0
        ? rows
        : await db.designTemplate.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

    return {
      section: {
        eyebrow: finalConfig?.eyebrow ?? DEFAULT_COLLECTION_SECTION.eyebrow,
        titleLine1: finalConfig?.titleLine1 ?? DEFAULT_COLLECTION_SECTION.titleLine1,
        titleHighlight:
          finalConfig?.titleHighlight ?? DEFAULT_COLLECTION_SECTION.titleHighlight,
        description: finalConfig?.description ?? DEFAULT_COLLECTION_SECTION.description,
        searchPlaceholder:
          finalConfig?.searchPlaceholder ?? DEFAULT_COLLECTION_SECTION.searchPlaceholder
      },
      templates: finalRows.map((r) => ({
        slug: r.slug,
        name: r.name,
        category: r.category,
        image: r.image,
        color: r.color,
        layout: r.layout,
        sample: r.sample,
        description: r.description,
        tag: r.tag,
        accent: r.accent,
        venue: r.venue,
        date: r.date,
        quote: r.quote,
        published: r.published,
        sortOrder: r.sortOrder
      })),
      source: "prisma"
    };
  } catch {
    return readFileStore();
  }
}

export async function updateCollectionCopy(
  section: CollectionSectionCopy
): Promise<CollectionPayload> {
  const current = await getCollectionData();
  const nextSection = { ...DEFAULT_COLLECTION_SECTION, ...section };

  try {
    await db.collectionSectionConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...nextSection },
      update: nextSection
    });
    return await getCollectionData();
  } catch {
    await writeFileStore({ section: nextSection, templates: current.templates });
    return { section: nextSection, templates: current.templates, source: "file" };
  }
}

export async function upsertDesignTemplate(
  tpl: ManagedTemplate
): Promise<CollectionPayload> {
  const current = await getCollectionData();

  try {
    await db.designTemplate.upsert({
      where: { slug: tpl.slug },
      create: {
        slug: tpl.slug,
        name: tpl.name,
        category: tpl.category,
        image: tpl.image,
        color: tpl.color,
        layout: tpl.layout,
        sample: tpl.sample,
        description: tpl.description,
        tag: tpl.tag,
        accent: tpl.accent,
        venue: tpl.venue,
        date: tpl.date,
        quote: tpl.quote,
        published: tpl.published,
        sortOrder: tpl.sortOrder
      },
      update: {
        name: tpl.name,
        category: tpl.category,
        image: tpl.image,
        color: tpl.color,
        layout: tpl.layout,
        sample: tpl.sample,
        description: tpl.description,
        tag: tpl.tag,
        accent: tpl.accent,
        venue: tpl.venue,
        date: tpl.date,
        quote: tpl.quote,
        published: tpl.published,
        sortOrder: tpl.sortOrder
      }
    });
    return await getCollectionData();
  } catch {
    const idx = current.templates.findIndex((item) => item.slug === tpl.slug);
    const updated =
      idx >= 0
        ? current.templates.map((item, i) => (i === idx ? tpl : item))
        : [...current.templates, tpl];
    updated.sort((a, b) => a.sortOrder - b.sortOrder);
    await writeFileStore({ section: current.section, templates: updated });
    return { section: current.section, templates: updated, source: "file" };
  }
}

export async function deleteDesignTemplate(slug: string): Promise<CollectionPayload> {
  const current = await getCollectionData();

  try {
    await db.designTemplate.delete({ where: { slug } });
    return await getCollectionData();
  } catch {
    const updated = current.templates.filter((item) => item.slug !== slug);
    await writeFileStore({ section: current.section, templates: updated });
    return { section: current.section, templates: updated, source: "file" };
  }
}

export async function resetCollectionData(): Promise<CollectionPayload> {
  try {
    await db.collectionSectionConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...DEFAULT_COLLECTION_SECTION },
      update: DEFAULT_COLLECTION_SECTION
    });
    await db.designTemplate.deleteMany({});
    await db.designTemplate.createMany({
      data: DEFAULT_MANAGED_TEMPLATES.map((t) => ({
        slug: t.slug,
        name: t.name,
        category: t.category,
        image: t.image,
        color: t.color,
        layout: t.layout,
        sample: t.sample,
        description: t.description,
        tag: t.tag,
        accent: t.accent,
        venue: t.venue,
        date: t.date,
        quote: t.quote,
        published: t.published,
        sortOrder: t.sortOrder
      }))
    });
    return await getCollectionData();
  } catch {
    await writeFileStore({
      section: DEFAULT_COLLECTION_SECTION,
      templates: DEFAULT_MANAGED_TEMPLATES
    });
    return {
      section: DEFAULT_COLLECTION_SECTION,
      templates: DEFAULT_MANAGED_TEMPLATES,
      source: "file"
    };
  }
}
