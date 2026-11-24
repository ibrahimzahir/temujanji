import { NextResponse } from "next/server";
import { z } from "zod";
import { withStudioApi } from "@/lib/api-middleware";
import { db } from "@/lib/db";
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

export const PUT = withStudioApi(
  { roles: ["admin", "dev", "editor"], schema: siteSectionsSchema },
  async ({ role, data }) => {
    const updated = await updateSiteSections(data);
    await db.auditLog.create({
      data: {
        actorRole: role,
        action: "SITE_SECTIONS_UPDATED",
        target: "SiteSectionsConfig",
        detail: "Konten Proses, Paket, Testimoni, FAQ, dan Footer diperbarui."
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
      const reset = await resetSiteSections();
      await db.auditLog.create({
        data: {
          actorRole: role,
          action: "SITE_SECTIONS_RESET",
          target: "SiteSectionsConfig",
          detail: "Konten bagian situs direset ke bawaan studio."
        }
      });
      return NextResponse.json(reset);
    }
    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  }
);
