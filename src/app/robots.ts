import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, segmentFromHost } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = SITE_URL[segmentFromHost((await headers()).get("host"))];

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
