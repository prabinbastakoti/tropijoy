"use client";

import { Search, X } from "lucide-react";
import {
  useFilterStore,
  PRICE_CEILING,
  ATTRIBUTE_OPTIONS,
  type Attribute,
} from "@/store/filter-store";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { ProductCategory, SortOption } from "@/lib/types";

const categoryLabels: Record<ProductCategory | "All", string> = {
  All: "All Categories",
  "Dehydrated Fruit": "Sliced Fruits",
  "Fruit Powder": "Powders",
  Bundle: "Bundles",
};

const categories: (ProductCategory | "All")[] = ["All", ...CATEGORIES.filter((c) => c !== "Bundle")];

const attributeLabels: Record<Attribute, string> = {
  All: "All Products",
  "No Added Sugar": "No Added Sugar",
  Vegan: "Vegan",
  "Best Seller": "Best Sellers",
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Customer Rating" },
];

export default function FilterBar() {
  const {
    keyword,
    category,
    attribute,
    sort,
    fruitTypes,
    minPrice,
    maxPrice,
    setKeyword,
    setCategory,
    setAttribute,
    setSort,
    toggleFruitType,
    setPriceRange,
    reset,
  } = useFilterStore();

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (keyword) chips.push({ key: "keyword", label: `"${keyword}"`, onRemove: () => setKeyword("") });
  if (category !== "All")
    chips.push({ key: "category", label: categoryLabels[category], onRemove: () => setCategory("All") });
  if (attribute !== "All")
    chips.push({ key: "attribute", label: attributeLabels[attribute], onRemove: () => setAttribute("All") });
  fruitTypes.forEach((f) =>
    chips.push({ key: `fruit-${f}`, label: f, onRemove: () => toggleFruitType(f) })
  );
  if (maxPrice < PRICE_CEILING)
    chips.push({
      key: "price",
      label: `Under Rs. ${maxPrice.toLocaleString("en-IN")}`,
      onRemove: () => setPriceRange(0, PRICE_CEILING),
    });

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest/10 bg-white p-3 sm:p-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search fruits…"
            aria-label="Search products"
            className="w-full rounded-full border border-forest/15 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>

        <Select
          value={category}
          onValueChange={(v) => setCategory(v as ProductCategory | "All")}
        >
          <SelectTrigger aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabels[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={attribute}
          onValueChange={(v) => setAttribute(v as Attribute)}
        >
          <SelectTrigger aria-label="Dietary attribute">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Products</SelectItem>
            {ATTRIBUTE_OPTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {attributeLabels[a]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-forest/8 text-forest-deep text-xs font-semibold px-3 py-1.5 hover:bg-forest/15 transition-colors"
              )}
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={reset}
            className="text-xs font-semibold text-forest/60 hover:text-forest underline underline-offset-2"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
