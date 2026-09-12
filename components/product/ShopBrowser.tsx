"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { getShoppableProducts, filterAndSortProducts } from "@/lib/products";
import { useFilterStore } from "@/store/filter-store";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

const shoppable = getShoppableProducts();

export default function ShopBrowser() {
  const [loading, setLoading] = useState(true);
  const { keyword, category, fruitTypes, attribute, minPrice, maxPrice, sort, reset } =
    useFilterStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      filterAndSortProducts(shoppable, {
        keyword,
        category,
        fruitTypes,
        attribute,
        minPrice,
        maxPrice,
        sort,
      }),
    [keyword, category, fruitTypes, attribute, minPrice, maxPrice, sort]
  );

  return (
    <>
      <FilterBar />

      <p className="text-sm text-forest-deep/50 mb-5">
        {loading
          ? "Loading products…"
          : `Showing ${filtered.length} of ${shoppable.length} products`}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="bg-white/60 rounded-3xl border border-forest/10">
          <EmptyState
            icon={PackageSearch}
            title="No products match those filters"
            description="Try widening your price range or clearing a filter or two."
          />
          <div className="pb-10 text-center -mt-4">
            <button
              onClick={reset}
              className="text-sm font-semibold text-forest hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
