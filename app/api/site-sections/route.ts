import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSiteSections,
  resetSiteSections,
  updateSiteSections
} from "@/lib/site-sections-service";

export const dynamic = "force-dynamic";

const siteSectionsSchema = z.object({
  process: z.object({
    eyebrow: z.string().min(1),
    titleLine1: z.string().min(1),
    titleHighlight: z.string().min(1),
    description: z.string().min(1),
    steps: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1)
      })
    )
  }),
  packages: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
    items: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        price: z.number().int().min(0),
        popular: z.boolean(),
        badge: z.string().optional(),
        description: z.string().min(1),
        features: z.array(z.string().min(1))
      })
    )
  }),
  testimonials: z.object({
    eyebrow: z.string().min(1),
    titleLine1: z.string().min(1),
    titleHighlight: z.string().min(1),
    items: z.array(
      z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        location: z.string().min(1)
      })
    )
  }),
  faq: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    items: z.array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1)
      })
    )
  }),
  footer: z.object({
    tagline: z.string().min(1),
    copyright: z.string().min(1),
    bottomQuote: z.string().min(1),
    links: z.array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1)
      })
    )
  })
});

export async function GET() {
  const payload = await getSiteSections();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" }
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = siteSectionsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data bagian situs tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const updated = await updateSiteSections(parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan konfigurasi bagian situs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.action === "reset") {
      const reset = await resetSiteSections();
      return NextResponse.json(reset);
    }
    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses permintaan bagian situs" },
      { status: 500 }
    );
  }
}
