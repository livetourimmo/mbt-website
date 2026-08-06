import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSegment } from "@/lib/get-segment.server";

export default async function BrandLayout({ children }: { children: ReactNode }) {
  const segment = await getSegment();

  return (
    <div className="flex min-h-full flex-1 flex-col" data-segment={segment}>
      <SiteHeader segment={segment} />
      <main className="flex-1">{children}</main>
      <SiteFooter segment={segment} />
    </div>
  );
}
