import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import {
  DEFAULT_SITE_SECTIONS,
  type SiteSectionsData
} from "@/lib/site-sections-types";

export interface SiteSectionsPayload {
  data: SiteSectionsData;
  source: "prisma" | "file";
}

const STORE_FILE = path.join(process.cwd(), "data", "site-sections.json");

async function readFileStore(): Promise<SiteSectionsPayload> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteSectionsData>;
    return {
      data: {
        process: { ...DEFAULT_SITE_SECTIONS.process, ...(parsed.process ?? {}) },
        packages: { ...DEFAULT_SITE_SECTIONS.packages, ...(parsed.packages ?? {}) },
        testimonials: {
          ...DEFAULT_SITE_SECTIONS.testimonials,
          ...(parsed.testimonials ?? {})
        },
        faq: { ...DEFAULT_SITE_SECTIONS.faq, ...(parsed.faq ?? {}) },
        footer: { ...DEFAULT_SITE_SECTIONS.footer, ...(parsed.footer ?? {}) }
      },
      source: "file"
    };
  } catch {
    await writeFileStore(DEFAULT_SITE_SECTIONS);
    return { data: DEFAULT_SITE_SECTIONS, source: "file" };
  }
}

async function writeFileStore(data: SiteSectionsData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getSiteSections(): Promise<SiteSectionsPayload> {
  try {
    let row = await db.siteSectionsConfig.findUnique({ where: { id: "default" } });
    if (!row) {
      row = await db.siteSectionsConfig.create({
        data: { id: "default", data: DEFAULT_SITE_SECTIONS as unknown as object }
      });
    }
    const parsed = (row.data ?? {}) as Partial<SiteSectionsData>;
    return {
      data: {
        process: { ...DEFAULT_SITE_SECTIONS.process, ...(parsed.process ?? {}) },
        packages: { ...DEFAULT_SITE_SECTIONS.packages, ...(parsed.packages ?? {}) },
        testimonials: {
          ...DEFAULT_SITE_SECTIONS.testimonials,
          ...(parsed.testimonials ?? {})
        },
        faq: { ...DEFAULT_SITE_SECTIONS.faq, ...(parsed.faq ?? {}) },
        footer: { ...DEFAULT_SITE_SECTIONS.footer, ...(parsed.footer ?? {}) }
      },
      source: "prisma"
    };
  } catch {
    return readFileStore();
  }
}

export async function updateSiteSections(
  data: SiteSectionsData
): Promise<SiteSectionsPayload> {
  try {
    await db.siteSectionsConfig.upsert({
      where: { id: "default" },
      create: { id: "default", data: data as unknown as object },
      update: { data: data as unknown as object }
    });
    return await getSiteSections();
  } catch {
    await writeFileStore(data);
    return { data, source: "file" };
  }
}

export async function resetSiteSections(): Promise<SiteSectionsPayload> {
  return updateSiteSections(DEFAULT_SITE_SECTIONS);
}
