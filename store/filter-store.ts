import { create } from "zustand";
import type { FruitType, ProductCategory, SortOption } from "@/lib/types";

export const PRICE_FLOOR = 0;
export const PRICE_CEILING = 2000;

export const ATTRIBUTE_OPTIONS = ["No Added Sugar", "Vegan", "Best Seller"] as const;
export type Attribute = (typeof ATTRIBUTE_OPTIONS)[number] | "All";

interface FilterState {
  keyword: string;
  category: ProductCategory | "All";
  fruitTypes: FruitType[];
  attribute: Attribute;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
  setKeyword: (keyword: string) => void;
  setCategory: (category: ProductCategory | "All") => void;
  toggleFruitType: (fruitType: FruitType) => void;
  setAttribute: (attribute: Attribute) => void;
  setPriceRange: (min: number, max: number) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
}

const defaults = {
  keyword: "",
  category: "All" as const,
  fruitTypes: [] as FruitType[],
  attribute: "All" as Attribute,
  minPrice: PRICE_FLOOR,
  maxPrice: PRICE_CEILING,
  sort: "featured" as const,
};

export const useFilterStore = create<FilterState>()((set, get) => ({
  ...defaults,
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  toggleFruitType: (fruitType) => {
    const current = get().fruitTypes;
    set({
      fruitTypes: current.includes(fruitType)
        ? current.filter((f) => f !== fruitType)
        : [...current, fruitType],
    });
  },
  setAttribute: (attribute) => set({ attribute }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setSort: (sort) => set({ sort }),
  reset: () => set(defaults),
}));
