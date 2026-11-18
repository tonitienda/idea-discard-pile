import type { MetadataRoute } from "next";
import { getPublicIdeaSlugs } from "../backend/db";
import { SITE_URL } from "./site";

// Rebuilt at most once an hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ideas = await getPublicIdeaSlugs();

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...ideas.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/ideas/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
