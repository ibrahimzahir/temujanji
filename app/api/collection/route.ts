import { NextResponse } from "next/server";
import { z } from "zod";
import { withStudioApi } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import {
  deleteDesignTemplate,
  getCollectionData,
  resetCollectionData,
  updateCollectionCopy,
  upsertDesignTemplate
} from "@/lib/collection-service";

export const dynamic = "force-dynamic";

const sectionSchema = z.object({
  eyebrow: z.string().min(1).max(120),
  titleLine1: z.string().min(1).max(160),
  titleHighlight: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  searchPlaceholder: z.string().min(1).max(80)
});

const templateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(60),
  image: z.string().min(1).max(300),
  color: z.string().min(3).max(40),
  layout: z.string().min(1).max(40),
  sample: z.string().min(1).max(100),
  description: z.string().min(1).max(400),
  tag: z.string().max(60),
  accent: z.string().min(3).max(40),
  venue: z.string().min(1).max(200),
  date: z.string().min(1).max(120),
  quote: z.string().min(1).max(400),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999).default(1)
});

export async function GET() {
  const data = await getCollectionData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" }
  });
}

export const PUT = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: sectionSchema },
  async ({ role, data }) => {
    const updated = await updateCollectionCopy(data);
    await db.auditLog.create({
      data: {
        actorRole: role,
        action: "COLLECTION_COPY_UPDATED",
        target: "CollectionSectionConfig",
        detail: `Judul koleksi diperbarui: "${data.titleLine1} ${data.titleHighlight}".`
      }
    });
    return NextResponse.json(updated);
  }
);

export const POST = withStudioApi(
  { roles: ["admin", "dev", "editor"] },
  async ({ role, request }) => {
    const body = await request.json();

    if (body?.action === "reset") {
      const reset = await resetCollectionData();
      await db.auditLog.create({
        data: {
          actorRole: role,
          action: "COLLECTION_RESET",
          target: "DesignTemplate",
          detail: "Koleksi tema direset ke bawaan studio."
        }
      });
      return NextResponse.json(reset);
    }

    if (body?.action === "delete") {
      const slug = typeof body.slug === "string" ? body.slug.trim() : "";
      if (!slug) {
        return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });
      }
      const updated = await deleteDesignTemplate(slug);
      await db.auditLog.create({
        data: {
          actorRole: role,
          action: "THEME_DELETED",
          target: slug,
          detail: `Tema undangan "${slug}" dihapus.`
        }
      });
      return NextResponse.json(updated);
    }

    if (body?.action === "upsert") {
      const parsed = templateSchema.safeParse(body.template);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Data tema tidak valid", issues: parsed.error.issues },
          { status: 400 }
        );
      }
      const updated = await upsertDesignTemplate(parsed.data);
      await db.auditLog.create({
        data: {
          actorRole: role,
          action: "THEME_UPSERTED",
          target: parsed.data.slug,
          detail: `Tema "${parsed.data.name}" (${parsed.data.category}) disimpan.`
        }
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  }
);
