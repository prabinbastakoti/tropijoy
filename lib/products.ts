import productsData from "@/data/products.json";
import type {
  FruitType,
  Product,
  ProductCategory,
  ProductVariant,
  SortOption,
} from "./types";
import { buildRatingBreakdown, getSeededReviews } from "./reviews";

/**
 * Placeholder NPR pricing (Rs 850-2550 range) lives in data/products.json under
 * each product's variants[]. Replace with real numbers there — no other file
 * needs to change.
 */
const rawProducts = productsData as Product[];

// rating/reviewsCount are derived from data/reviews.json rather than
// hand-maintained in the JSON, so the two can never drift apart.
export const products: Product[] = rawProducts.map((product) => {
  const breakdown = buildRatingBreakdown(getSeededReviews(product.id));
  return breakdown.total === 0
    ? product
    : {
        ...product,
        rating: Math.round(breakdown.average * 10) / 10,
        reviewsCount: breakdown.total,
      };
});

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getDefaultVariant(product: Product): ProductVariant {
  return (
    product.variants.find((v) => v.id === product.defaultVariantId) ??
    product.variants[0]
  );
}

export function getVariant(
  product: Product,
  variantId?: string
): ProductVariant {
  return (
    product.variants.find((v) => v.id === variantId) ??
    getDefaultVariant(product)
  );
}

export function isProductInStock(product: Product): boolean {
  return product.variants.some((v) => v.inStock);
}

/** "100g" or, when a variant also carries a style (e.g. peel type), "100g · With Peel". */
export function variantLabel(variant: ProductVariant): string {
  return variant.style ? `${variant.weight} · ${variant.style}` : variant.weight;
}

/** Units purchasable right now. Untracked variants (no `stock` count) are treated as unlimited. */
export function stockRemaining(variant: ProductVariant): number {
  if (!variant.inStock) return 0;
  return variant.stock ?? Infinity;
}

/** Lowest variant price — used for "From Rs. X" card pricing. */
export function priceFrom(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

/** Highest variant discount percentage across a product's variants, or 0. */
export function bestDiscount(product: Product): number {
  return Math.max(
    0,
    ...product.variants.map((v) =>
      v.originalPrice && v.originalPrice > v.price
        ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
        : 0
    )
  );
}

export function getBestSellers(limit?: number): Product[] {
  const list = products
    .filter((p) => p.tags.includes("Best Seller"))
    .sort((a, b) => b.rating - a.rating);
  return limit ? list.slice(0, limit) : list;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameFruit = products.filter(
    (p) => p.id !== product.id && p.fruitType === product.fruitType
  );
  const sameCategory = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      p.fruitType !== product.fruitType
  );
  return [...sameFruit, ...sameCategory].slice(0, limit);
}

export const FRUIT_TYPES: FruitType[] = [
  "Apple",
  "Lemon",
  "Orange",
  "Pineapple",
  "Banana",
];

export const CATEGORIES: ProductCategory[] = [
  "Dehydrated Fruit",
  "Fruit Powder",
];

/**
 * The per-fruit brand accent system, taken directly from the real packaging
 * labels. Tailwind's JIT compiler needs literal class names somewhere in
 * scanned source (see the `content` globs in tailwind.config.ts, which
 * specifically include lib/**), so these reference named `accent-*` tokens
 * registered in tailwind.config.ts rather than raw hex values in `className`.
 */
export const FRUIT_ACCENTS: Record<
  FruitType,
  { hex: string; bg: string; text: string; border: string; chip: string }
> = {
  Apple: {
    hex: "#9B2B19",
    bg: "bg-accent-apple",
    text: "text-accent-apple",
    border: "border-accent-apple",
    chip: "bg-accent-apple/10 text-accent-apple",
  },
  Lemon: {
    hex: "#E8C31E",
    bg: "bg-accent-lemon",
    text: "text-accent-lemon",
    border: "border-accent-lemon",
    chip: "bg-accent-lemon/15 text-forest-deep",
  },
  Orange: {
    hex: "#E46C0B",
    bg: "bg-accent-orange",
    text: "text-accent-orange",
    border: "border-accent-orange",
    chip: "bg-accent-orange/10 text-accent-orange",
  },
  Pineapple: {
    hex: "#ECB722",
    bg: "bg-accent-pineapple",
    text: "text-accent-pineapple",
    border: "border-accent-pineapple",
    chip: "bg-accent-pineapple/15 text-forest-deep",
  },
  Banana: {
    hex: "#D4AE59",
    bg: "bg-accent-banana",
    text: "text-accent-banana",
    border: "border-accent-banana",
    chip: "bg-accent-banana/15 text-forest-deep",
  },
  Mixed: {
    hex: "#116530",
    bg: "bg-forest",
    text: "text-forest",
    border: "border-forest",
    chip: "bg-forest/10 text-forest-deep",
  },
};

/** Curated multi-product bundles — excluded from the main shop grid/filters. */
export function getBundles(): Product[] {
  return products.filter((p) => p.category === "Bundle");
}

/** Real, non-bundle catalog products — what the shop page, bestseller grid, and mega menu "sliced fruit"/"powder" columns should ever show. */
export function getShoppableProducts(): Product[] {
  return products.filter((p) => p.category !== "Bundle");
}

export interface ProductFilters {
  keyword: string;
  category: ProductCategory | "All";
  fruitTypes: FruitType[];
  /** "No Added Sugar" | "Vegan" | "Best Seller" | "All" — matches against `product.tags`. */
  attribute?: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export function filterAndSortProducts(
  source: Product[],
  filters: ProductFilters
): Product[] {
  const keyword = filters.keyword.trim().toLowerCase();

  const result = source.filter((p) => {
    const matchesKeyword =
      !keyword ||
      p.name.toLowerCase().includes(keyword) ||
      p.fruitType.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword) ||
      p.tags.some((t) => t.toLowerCase().includes(keyword));
    const matchesCategory =
      filters.category === "All" || p.category === filters.category;
    const matchesFruit =
      filters.fruitTypes.length === 0 ||
      filters.fruitTypes.includes(p.fruitType);
    const matchesAttribute =
      !filters.attribute ||
      filters.attribute === "All" ||
      p.tags.includes(filters.attribute);
    const matchesPrice = p.variants.some(
      (v) => v.price >= filters.minPrice && v.price <= filters.maxPrice
    );
    return (
      matchesKeyword &&
      matchesCategory &&
      matchesFruit &&
      matchesAttribute &&
      matchesPrice
    );
  });

  switch (filters.sort) {
    case "price-asc":
      return [...result].sort((a, b) => priceFrom(a) - priceFrom(b));
    case "price-desc":
      return [...result].sort((a, b) => priceFrom(b) - priceFrom(a));
    case "rating-desc":
      return [...result].sort((a, b) => b.rating - a.rating);
    default:
      return [...result].sort(
        (a, b) =>
          Number(b.tags.includes("Best Seller")) -
          Number(a.tags.includes("Best Seller"))
      );
  }
}
