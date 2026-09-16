"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
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
  /** Enter pressed in the search box while the dropdown is closed — lets the
   * parent move focus into the newest item row instead of Enter doing nothing. */
  onEnterWhileClosed?: () => void;
}

/** Type-to-filter product picker — the catalog is small enough to search client-side, no server round trip needed. */
const ProductCombobox = forwardRef<HTMLInputElement, ProductComboboxProps>(function ProductCombobox(
  { onSelect, onEnterWhileClosed },
  ref
) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [weightFilter, setWeightFilter] = useState<WeightOption | null>("100g");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

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

  // Keep the highlighted row in range whenever the result set changes
  // (typing, switching the weight filter, or the dropdown re-opening).
  useEffect(() => {
    setActiveIndex(0);
  }, [query, weightFilter, open]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Whenever the dropdown opens, smooth-scroll the page just enough that the
  // whole panel (weight badges + results) is in view — matters most right
  // after Enter jumps focus here from Address, where the box can land near
  // the bottom of the viewport.
  useEffect(() => {
    if (!open) return;
    dropdownRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open]);

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
    // Keep the dropdown open (reset to the full filtered list) and the
    // caret right where it was, so adding several items in a row is just
    // arrow-down + Enter, arrow-down + Enter — no reaching for the mouse.
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Only steal the arrow when the caret is already at that edge of the
      // text, so moving the cursor through typed text still works normally.
      const input = e.currentTarget;
      const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
      const atEnd = input.selectionStart === query.length && input.selectionEnd === query.length;
      if ((e.key === "ArrowRight" && atEnd) || (e.key === "ArrowLeft" && atStart)) {
        e.preventDefault();
        setOpen(true);
        const currentIndex = weightFilter ? WEIGHT_FILTERS.indexOf(weightFilter) : -1;
        const nextIndex =
          e.key === "ArrowRight"
            ? currentIndex === -1
              ? 0
              : (currentIndex + 1) % WEIGHT_FILTERS.length
            : currentIndex === -1
              ? WEIGHT_FILTERS.length - 1
              : (currentIndex - 1 + WEIGHT_FILTERS.length) % WEIGHT_FILTERS.length;
        setWeightFilter(WEIGHT_FILTERS[nextIndex]);
      }
    } else if (e.key === "Enter") {
      if (open && filtered.length > 0) {
        e.preventDefault();
        pick(filtered[activeIndex]);
      } else if (!open && onEnterWhileClosed) {
        e.preventDefault();
        onEnterWhileClosed();
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-ink/40"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls="product-combobox-list"
          aria-activedescendant={
            open && filtered[activeIndex] ? `product-option-${filtered[activeIndex].id}` : undefined
          }
          placeholder="Search a product to add…"
          className="w-full rounded-xl border border-forest/15 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-forest/15 bg-white shadow-lg"
        >
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
          <div id="product-combobox-list" role="listbox" className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-2.5 text-sm text-forest-ink/50">
                No product found — add a custom item below instead.
              </p>
            ) : (
              filtered.map((o, i) => (
                <button
                  key={o.id}
                  id={`product-option-${o.id}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  role="option"
                  aria-selected={i === activeIndex}
                  type="button"
                  onClick={() => pick(o)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 border-l-2 px-3 py-2 text-left text-sm transition-colors",
                    i === activeIndex
                      ? "border-forest bg-forest/15"
                      : "border-transparent hover:bg-forest/5"
                  )}
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
});

export default ProductCombobox;
