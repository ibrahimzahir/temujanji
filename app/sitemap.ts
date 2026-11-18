import type { MetadataRoute } from "next";
import { getCollectionData } from "@/lib/collection-service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temujanji.id";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collection = await getCollectionData();
  const now = new Date();

  const designRoutes: MetadataRoute.Sitemap = collection.templates
    .filter((t) => t.published)
    .map((template) => ({
      url: `${SITE_URL}/desain/${template.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privasi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/syarat-ketentuan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...designRoutes,
  ];
}
