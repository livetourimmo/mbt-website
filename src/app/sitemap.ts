import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { blogPosts } from "@/lib/blog-posts";
import { MAIN_URL, SHARED_PATHS, SITE_URL, segmentFromHost } from "@/lib/site";

// Jede Domain listet nur ihre eigenen kanonischen URLs. Die gemeinsamen
// Seiten sind auf mbt-consulting.ch kanonisch und erscheinen nur dort.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const segment = segmentFromHost((await headers()).get("host"));

  if (segment === "coaching") {
    return [{ url: `${SITE_URL.coaching}/`, changeFrequency: "monthly", priority: 1 }];
  }

  return [
    { url: `${MAIN_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...SHARED_PATHS.map((path) => ({
      url: `${MAIN_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/impressum" || path === "/datenschutz" ? 0.2 : 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${MAIN_URL}/blog/${post.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
