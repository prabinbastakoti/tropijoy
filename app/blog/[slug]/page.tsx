import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { posts, getPostBySlug, getRelatedPosts, getPostAccentChip } from "@/lib/blog";
import { cn, formatDate } from "@/lib/utils";
import BlogBlocks from "@/components/blog/BlogBlocks";
import BlogCard from "@/components/blog/BlogCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HeritageBand from "@/components/brand/HeritageBand";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const chip = getPostAccentChip(post);

  return (
    <article>
      {/* header panel — flat accent bar + heritage motif stand in for a cover photo */}
      <header className="relative overflow-hidden bg-cream py-14 sm:py-20">
        <HeritageBand imageClassName="object-top" heightClassName="h-56 sm:h-80" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.category },
            ]}
          />
          <span
            className={cn(
              "inline-block mt-6 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
              chip
            )}
          >
            {post.category}
          </span>
          <h1 className="mt-4 font-display font-extrabold text-3xl sm:text-5xl leading-[1.08] text-balance text-forest-deep">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-forest-deep/60">
            <span className="font-semibold">{post.author}</span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {post.readTime} min read
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-lg text-forest-deep/70 leading-relaxed border-l-4 border-forest/15 pl-5 mb-10">
          {post.excerpt}
        </p>

        <BlogBlocks blocks={post.blocks} />

        <div className="mt-14 pt-8 border-t border-forest/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to the journal
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="font-display font-extrabold text-2xl text-forest-deep mb-8">
            Keep reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
