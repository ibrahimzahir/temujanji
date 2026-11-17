import { NextResponse } from "next/server";
import { z } from "zod";
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = sectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data bagian koleksi tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const updated = await updateCollectionCopy(parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan koleksi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === "reset") {
      const reset = await resetCollectionData();
      return NextResponse.json(reset);
    }

    if (body?.action === "delete") {
      const slug = typeof body.slug === "string" ? body.slug.trim() : "";
      if (!slug) {
        return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });
      }
      const updated = await deleteDesignTemplate(slug);
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
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan koleksi" }, { status: 500 });
  }
}
