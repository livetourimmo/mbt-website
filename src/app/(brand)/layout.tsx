import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import JsonLd from "@/components/json-ld";
import { getSegment } from "@/lib/get-segment.server";
import { SEGMENT_META, type Segment } from "@/lib/segment";
import { BUSINESS, MAIN_URL, PERSON_ID, SITE_URL, orgId } from "@/lib/site";

function brandSchema(segment: Segment) {
  const meta = SEGMENT_META[segment];
  const url = SITE_URL[segment];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: BUSINESS.person,
        jobTitle: "Coach und Unternehmensentwickler",
        image: `${MAIN_URL}/images/portrait-anzug-nah.jpg`,
        url: `${MAIN_URL}/ueber-mich`,
        worksFor: [{ "@id": orgId("consulting") }, { "@id": orgId("coaching") }],
      },
      {
        "@type": "ProfessionalService",
        "@id": orgId(segment),
        name: meta.brand,
        description:
          segment === "coaching"
            ? "Coaching für Führungspersönlichkeiten."
            : "Consulting für Unternehmensführungen.",
        url: `${url}/`,
        logo: `${MAIN_URL}/images/logo-mbt.png`,
        image: `${MAIN_URL}/images/startseite.jpg`,
        email: meta.email,
        telephone: BUSINESS.telephone,
        vatID: BUSINESS.vatId,
        address: { "@type": "PostalAddress", ...BUSINESS.address },
        areaServed: { "@type": "Country", name: "Schweiz" },
        founder: { "@id": PERSON_ID },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url: `${url}/`,
        name: meta.brand,
        inLanguage: "de-CH",
        publisher: { "@id": orgId(segment) },
      },
    ],
  };
}

export default async function BrandLayout({ children }: { children: ReactNode }) {
  const segment = await getSegment();

  return (
    <div className="flex min-h-full flex-1 flex-col" data-segment={segment}>
      <JsonLd data={brandSchema(segment)} />
      <SiteHeader segment={segment} />
      <main className="flex-1">{children}</main>
      <SiteFooter segment={segment} />
    </div>
  );
}
