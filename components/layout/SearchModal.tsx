"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { products, getDefaultVariant, priceFrom } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fruitType.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query]);

  function goToProduct(slug: string) {
    onClose();
    router.push(`/shop/${slug}`);
  }

  function goToShop() {
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-forest-deep/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="w-full max-w-xl bg-white rounded-3xl shadow-window overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-forest/10">
              <Search size={20} className="text-forest shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (results.length > 0) goToProduct(results[0].slug);
                    else if (query.trim()) goToShop();
                  }
                }}
                placeholder="Search apple, lemon, banana powder…"
                className="flex-1 min-w-0 bg-transparent outline-none text-forest-deep placeholder:text-forest/40 text-base"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="text-forest/60 hover:text-forest"
              >
                <X size={20} />
              </button>
            </div>

            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto p-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => goToProduct(product.slug)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-forest/5 transition-colors text-left"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-forest-deep truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-forest/60">
                        {product.category} &middot; {getDefaultVariant(product).weight}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-forest shrink-0">
                      {formatPrice(priceFrom(product))}
                    </span>
                  </button>
                ))}
                <button
                  onClick={goToShop}
                  className="w-full text-center text-sm font-semibold text-forest py-3 hover:underline"
                >
                  See all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="p-8 text-center text-forest/60 text-sm">
                No products found for &ldquo;{query}&rdquo;
              </div>
            )}

            {!query.trim() && (
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-forest-deep/35 mb-2">
                  Popular
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Apple", "Lemon", "Banana Powder", "Best Seller"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full bg-forest/6 hover:bg-forest/12 px-3 py-1.5 text-xs font-medium text-forest-deep transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
