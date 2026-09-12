"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { posts, BLOG_CATEGORIES } from "@/lib/blog";
import type { BlogCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import BlogCard from "./BlogCard";

export default function BlogIndex() {
  const [category, setCategory] = useState<BlogCategory | "All">("All");

  const filtered = useMemo(
    () =>
      category === "All" ? posts : posts.filter((p) => p.category === category),
    [category]
  );

  const [featured, ...rest] = filtered;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {(["All", ...BLOG_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              category === cat
                ? "text-white"
                : "text-forest-deep/50 hover:text-forest-deep/80 border border-forest/10"
            )}
          >
            {category === cat && (
              <motion.span
                layoutId="blog-category-pill"
                className="absolute inset-0 bg-sunny rounded-full -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {featured && (
            <div className="mb-8">
              <BlogCard post={featured} size="lg" />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-center text-forest-deep/50 py-20">
              No articles in that category yet.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
