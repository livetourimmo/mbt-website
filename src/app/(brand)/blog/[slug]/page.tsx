import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MediaPlaceholder from "@/components/media-placeholder";
import { blogPosts, getPostBySlug } from "@/lib/blog-posts";
import SplitWords from "@/components/split-words";
import JsonLd from "@/components/json-ld";
import { MAIN_URL, PERSON_ID, orgId } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "de_CH",
      title: post.title,
      description: post.excerpt,
      authors: ["Markus Tappolet"],
      images: [{ url: "/images/startseite.jpg" }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const index = blogPosts.findIndex((p) => p.slug === slug);
  const related = blogPosts.filter((_, i) => i !== index).slice(0, 3);

  // Kein datePublished: Die Beiträge haben bisher kein Jahr ("17. März").
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${MAIN_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${MAIN_URL}/blog/${post.slug}`,
    inLanguage: "de-CH",
    author: { "@id": PERSON_ID, "@type": "Person", name: "Markus Tappolet" },
    publisher: { "@id": orgId("consulting") },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <section className="border-b border-hairline bg-neutral-tint px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-[14px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            ← Zum Blog
          </Link>
          <div className="mt-6 flex items-center gap-2 text-[13px] text-ink-soft">
            <span>{post.date}</span>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="hero-title mt-4 font-display text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-ink md:text-[3.25rem]">
            <SplitWords text={post.title} />
          </h1>
        </div>
      </section>

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <MediaPlaceholder
            kind="image"
            label="Bild folgt"
            aspect="aspect-[21/9]"
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
          <div className="space-y-6 text-[17px] leading-relaxed text-ink-soft">
            {post.body.map((block, i) => {
              if (block.type === "lead") {
                return (
                  <p
                    key={i}
                    className="font-display text-[20px] leading-snug font-medium text-ink"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "heading") {
                return (
                  <h2
                    key={i}
                    className="!mt-12 font-display text-[1.4rem] font-semibold text-ink"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="list-disc space-y-2 pl-5">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{block.text}</p>;
            })}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-hairline bg-neutral-tint">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <h2 className="font-display text-[1.3rem] font-semibold text-ink">
              Weitere Beiträge
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-hairline bg-paper p-6 transition-transform duration-300 ease-out hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <span>{p.date}</span>
                    <span aria-hidden>·</span>
                    <span>{p.readingTime}</span>
                  </div>
                  <h3 className="mt-3 font-display text-[1.05rem] leading-snug font-semibold text-ink transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
