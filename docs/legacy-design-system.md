# Legacy Design System — Tropijoy "v1"

This file documents the site's original design system and every component/page that gets
**superseded** during the 2026 redesign (real brand assets, real 6-product catalog, Allbirds /
Daily Harvest / Graze–inspired visual language). Nothing described here is deleted from the
repo — superseded files stay on disk, simply unimported, so they can be resurrected, referenced,
or cannibalized later. This doc is the map back to them.

See `..\..\..\claude\plans\snuggly-dreaming-falcon.md`-derived plan for the redesign itself
(or ask the assistant that ran it — the plan lived at
`C:\Users\Prabin Bastakoti\.claude\plans\snuggly-dreaming-falcon.md`).

## Original visual identity ("v1", pre-redesign)

- **Palette**: `sunny` neon yellow (`#FCD116`) as the primary CTA/accent color everywhere, `forest`
  green family as the secondary/brand color, mint-tinted `cream` (`#F4F9F5`) background, plus
  unused-in-practice `berry`/`citrus` tokens reserved for blog accents.
- **Signature effects**: an animated "aurora" mesh-gradient hero background (`.mesh-hero` in
  `app/globals.css`), neon glow button shadows (`shadow-glow-yellow`/`shadow-glow-green` in
  `tailwind.config.ts`), a cursor-following spotlight glow (`.spotlight`), a `.dotted-grid` texture
  used as a stand-in hero/panel background, and `.text-gradient-brand` (sunny gradient text-clip)
  for big display headlines.
- **Product catalog**: entirely fictional — 14 SKUs across mango, pineapple, dragonfruit, banana,
  berry, citrus, plus "trail mix" bundles — none of which Tropijoy actually sells. Sourced from
  Unsplash stock photography (`images.unsplash.com`), not real product photos.
- **Blog**: no real cover photography ever existed. Every blog card/post header substituted a
  Tailwind gradient (`lib/blog.ts`'s `accentStyles`, keyed by `sunny | forest | berry | citrus`)
  for an actual image.
- **Fonts** (kept, unchanged by the redesign): Baloo 2 (display) + Inter (body) — these already
  suit the real bubbly "tropijoy" wordmark logo well.

## Components/pages superseded (stay on disk, undocumented from active use)

### `components/home/HeroWindow.tsx`
- **Purpose**: homepage hero — animated aurora-mesh background behind a headline, with a fake
  macOS-style "browser chrome" widget below it (traffic-light dots, a fake URL bar reading
  `tropijoy.np/shop`, tabs for All/Dried Fruits/Powders/Snack Mixes/Best Sellers, a fruit-type
  filter rail, and a live mini product grid with quick-add buttons).
- **Props**: none (self-contained, reads `products` from `lib/products.ts` directly).
- **Notable**: had its own hardcoded `fruitFilters` array (`Mango/Berry/Dragonfruit/Pineapple/Citrus`)
  independent of `lib/products.ts`'s `FRUIT_TYPES` — a second source of truth that drifted from
  the real catalog once the redesign began.
- **Superseded by**: `components/home/Hero.tsx` (headline/CTA) + `components/home/ShopWindow.tsx`
  (the interactive browser-chrome product widget itself — its tabs/fruit-rail/grid pattern was
  kept, just rebuilt against the real 6-product catalog instead of the fictional one, with
  `object-contain` images and no more `Snack Mixes` tab).

**Note:** `HeroWindow.tsx` and `CategoryBento.tsx` still reference the old flat
`Product.price`/`.weight`/`.inStock` fields and the old 6-value `FruitType`
union from before the real-catalog data model migration. Left as-is
intentionally (not "fixed" to compile) since they're historical artifacts, not
live code — and to keep the build green, both files are listed in
`tsconfig.json`'s `exclude` array so the type-checker skips them entirely.
They are otherwise fully intact and can be copied out, retyped, and reused if
ever needed.

### `components/home/CategoryBento.tsx`
- **Purpose**: 4-tile "bento" grid on the homepage — a large 2x2 neon-green-gradient "Dehydrated
  Fruit Slices" tile, a sunny-gradient "Superfood Powders" tile, and two small stat tiles
  (partner-farm count, cheapest price), all on `.dotted-grid` texture.
- **Props**: none.
- **Superseded by**: `components/home/CategoryGrid.tsx` — a "shop by fruit" grid, one tile per
  real product, using real photography + the per-fruit `FRUIT_ACCENTS` color instead of neon
  gradients (makes more sense than a 2-category split now that there's only one powder SKU).

## CSS/token definitions removed (not "components" in the file sense — pruned once unreferenced, not archived as dormant files)

| Removed | Was defined in | Replaced by |
|---|---|---|
| `.mesh-hero` (animated aurora radial-gradient blob) | `app/globals.css` | Photography-first sections on the warm cream background |
| `.dotted-grid` (dot-texture hero/panel background) | `app/globals.css` | The `Media/Mountain.png` heritage skyline band (`public/brand/mountain.png`) |
| `.text-gradient-brand` (sunny gradient text-clip) | `app/globals.css` | Flat forest/terracotta display-weight headlines |
| `shadow-glow-yellow`, `shadow-glow-green` (neon button shadows) | `tailwind.config.ts` | `shadow-lift`/`shadow-window` (kept) — flat, no neon glow |
| `aurora`, `blob` keyframes/animations | `tailwind.config.ts` | n/a — no longer used anywhere |

## Still active, only retinted (not superseded — kept and reused)

For completeness, these existing components/utilities were reviewed and kept **structurally
as-is**, just retinted to the new palette / fed real data — they are not part of the "superseded"
list above:

- `components/layout/Header.tsx`, `Footer.tsx`, `SearchModal.tsx`
- `components/product/ProductCard.tsx`, `ProductDetail.tsx`, `FilterPanel.tsx`, `ShopBrowser.tsx`
- `components/cart/CartDrawer.tsx`, all of `store/*.ts`
- `components/home/ProcessTimeline.tsx`, `TrustBar.tsx`, `Testimonials.tsx`, `BlogTeaser.tsx`
- `components/blog/BlogCard.tsx`, `BlogIndex.tsx`, `BlogBlocks.tsx`
- `components/reviews/*`, `components/legal/LegalLayout.tsx`, all of `components/ui/*`
- `components/motion/*` (`Reveal`, `Spotlight`, `Stagger`, `Marquee`, `CountUp`, `PageTransition`)
- Every existing `app/**/page.tsx` route (all 13 keep their URLs and general structure)

## Known pre-existing issues fixed opportunistically during the redesign (unrelated to visual style)

- `app/actions/checkout.ts`'s order-confirmation email template hardcoded `$` (USD) instead of
  `Rs.` (the site's actual currency, via `formatPrice()`) — fixed while touching this file for
  the variant-aware cart payload change.
- `components/ui/IconButton.tsx` exists but has zero importers anywhere in the codebase (confirmed
  via grep) — left as-is/undocumented-as-superseded since it was never wired up in the first
  place, not something the redesign replaced.
