import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import MediaPlaceholder from "@/components/media-placeholder";
import { blogPosts } from "@/lib/blog-posts";
import SplitWords from "@/components/split-words";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Gedanken zu Führung, Entscheidungsfähigkeit und Zusammenarbeit — Beiträge von Markus Tappolet.",
};

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-hairline bg-neutral-tint px-6 py-24 text-center md:px-10 md:py-32">
        <p className="hero-kicker text-[15px] text-ink-soft">Blog</p>
        <h1 className="hero-title mx-auto mt-3 max-w-3xl font-display text-[2.5rem] leading-[1.08] font-semibold tracking-tight text-ink md:text-[3.5rem]">
          <SplitWords text="Gedanken zu Führung, Entscheidungsfähigkeit und Zusammenarbeit" />
        </h1>
        <p className="hero-lede mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
          Beiträge aus der Praxis — zu Entscheidungen, Selbstorganisation und
          dem, was Menschen in Unternehmen wirklich bewegt.
        </p>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-paper transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-24px_rgba(31,44,87,0.28)]">
                    <MediaPlaceholder
                      kind="image"
                      label="Bild folgt"
                      aspect="aspect-[4/3]"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                        <span>{post.date}</span>
                        <span aria-hidden>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h2 className="font-display text-[1.15rem] leading-snug font-semibold text-ink transition-colors group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[14px] font-medium text-accent">
                        Weiterlesen
                        <span
                          aria-hidden
                          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
