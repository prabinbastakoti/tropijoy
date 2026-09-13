"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { products, variantLabel } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import type { WeightOption } from "@/lib/types";

export interface ProductOption {
  id: string;
  name: string;
  variant: string;
  weight: WeightOption;
  price: number;
  sku: string;
}

const OPTIONS: ProductOption[] = products.flatMap((p) =>
  p.variants.map((v) => ({
    id: `${p.id}:${v.id}`,
    name: p.name,
    variant: variantLabel(v),
    weight: v.weight,
    price: v.price,
    sku: v.sku,
  }))
);

const WEIGHT_FILTERS: WeightOption[] = ["100g", "200g", "50g", "Bundle"];

interface ProductComboboxProps {
  onSelect: (option: ProductOption) => void;
}

/** Type-to-filter product picker — the catalog is small enough to search client-side, no server round trip needed. */
export default function ProductCombobox({ onSelect }: ProductComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [weightFilter, setWeightFilter] = useState<WeightOption | null>("100g");
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OPTIONS.filter((o) => {
      if (weightFilter && o.weight !== weightFilter) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.sku.toLowerCase().includes(q) ||
        o.variant.toLowerCase().includes(q)
      );
    });
  }, [query, weightFilter]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function pick(option: ProductOption) {
    onSelect(option);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-ink/40"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a product to add…"
          className="w-full rounded-xl border border-forest/15 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-forest/15 bg-white shadow-lg">
          <div className="flex flex-wrap gap-1.5 border-b border-forest/10 px-3 py-2">
            {WEIGHT_FILTERS.map((w) => {
              const active = weightFilter === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeightFilter(active ? null : w)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                    active
                      ? "border-forest bg-forest text-white"
                      : "border-forest/15 text-forest-deep/70 hover:bg-forest/5"
                  )}
                >
                  {w}
                </button>
              );
            })}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-2.5 text-sm text-forest-ink/50">
                No product found — add a custom item below instead.
              </p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => pick(o)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-forest/5"
                >
                  <span className="truncate">
                    <span className="font-medium text-forest-deep">{o.name}</span>{" "}
                    <span className="text-forest-ink/50">· {o.variant}</span>
                  </span>
                  <span className="shrink-0 font-medium text-forest-ink/70">
                    {formatPrice(o.price)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
