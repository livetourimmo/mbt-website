import { headers } from "next/headers";
import { type Segment, resolveSegmentFromPath } from "@/lib/segment";

export async function getSegment(): Promise<Segment> {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  const host = (hdrs.get("host") ?? "").toLowerCase();
  const hostFallback: Segment = host.includes("coaching")
    ? "coaching"
    : "consulting";

  return resolveSegmentFromPath(pathname, hostFallback);
}
