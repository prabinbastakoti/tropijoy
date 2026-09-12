"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Briefcase,
  ChefHat,
  Gift,
  Heart,
  HelpCircle,
  Leaf,
  Mail,
  Menu,
  Newspaper,
  Package,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Star,
  Store,
  Trophy,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import SearchModal from "./SearchModal";
import MegaMenu, { type MegaId } from "./MegaMenu";

const navLinks: { label: string; href: string; mega?: MegaId }[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", mega: "shop" },
  { label: "Blog", href: "/blog", mega: "blog" },
  { label: "About Us", href: "/about", mega: "about" },
  { label: "Support", href: "/faq", mega: "support" },
];

/**
 * Every route reachable only through a mega menu (not one of navLinks'
 * own hrefs) — e.g. /our-process is an "About Us" page but its URL
 * doesn't start with /about, so isActive() alone would never light up
 * a tab for it. Mirrors MegaMenu.tsx's actual groupings; keep in sync
 * when a page moves between menus or a new one is added there.
 */
const megaMemberPaths: Record<MegaId, string[]> = {
  shop: ["/best-sellers", "/bundles", "/gift-cards", "/gifting"],
  blog: ["/recipes", "/reviews"],
  about: ["/our-process", "/sustainability", "/careers", "/press"],
  support: [
    "/quality-and-safety",
    "/shipping-policy",
    "/returns-policy",
    "/storage-guide",
    "/track-order",
    "/contact",
    "/wholesale",
    "/stockists",
    "/corporate-gifting",
    "/refer",
    "/privacy-policy",
    "/terms",
    "/cookies",
    "/accessibility",
  ],
};

const mobileGroups = [
  {
    heading: "Shop",
    links: [
      { label: "Best Sellers", href: "/best-sellers", icon: Trophy },
      { label: "Custom Bundles", href: "/bundles", icon: Gift },
      { label: "Gift Cards", href: "/gift-cards", icon: Gift },
      { label: "Gifting & Bulk Orders", href: "/gifting", icon: Gift },
      { label: "Recipes & Uses", href: "/recipes", icon: ChefHat },
      { label: "Reviews", href: "/reviews", icon: Star },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Quality & Process", href: "/our-process", icon: Sprout },
      { label: "About Us", href: "/about", icon: Users },
      { label: "Sustainability", href: "/sustainability", icon: Leaf },
      { label: "Careers", href: "/careers", icon: Briefcase },
      { label: "Press & Media", href: "/press", icon: Newspaper },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq", icon: HelpCircle },
      { label: "Quality & Safety", href: "/quality-and-safety", icon: ShieldCheck },
      { label: "Shipping Policy", href: "/shipping-policy", icon: Truck },
      { label: "Returns & Refunds", href: "/returns-policy", icon: PackageSearch },
      { label: "Storage Guide", href: "/storage-guide", icon: Archive },
      { label: "Track Your Order", href: "/track-order", icon: PackageSearch },
      { label: "Contact", href: "/contact", icon: Mail },
      { label: "Wholesale Orders", href: "/wholesale", icon: Store },
      { label: "Stockists", href: "/stockists", icon: Package },
      { label: "Corporate Gifting", href: "/corporate-gifting", icon: Gift },
      { label: "Refer a Friend", href: "/refer", icon: Gift },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Order History", href: "/orders", icon: Package },
      { label: "Wishlist", href: "/wishlist", icon: Heart },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeMega, setActiveMega] = useState<MegaId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  /** Opens (or switches) the mega menu, cancelling any pending close. */
  function openMega(id: MegaId | null) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMega(id);
  }

  /** Closes after a short delay so moving the pointer from the trigger link
   *  down into the portaled panel doesn't clip it shut mid-transit. */
  function scheduleCloseMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMega(null), 150);
  }

  const toggleCart = useCartStore((s) => s.toggleCart);
  const { itemCount } = useCartTotals();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const hydrated = useHydrated();

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // stay put near the top, and ignore sub-pixel jitter either direction
      if (y < 96) {
        setHiddenByScroll(false);
      } else if (y > lastScrollY.current + 4) {
        setHiddenByScroll(true);
      } else if (y < lastScrollY.current - 4) {
        setHiddenByScroll(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => setActiveMega(null), [pathname]);
  // never hide the header mid-interaction — only once the mega menu, search, and mobile drawer are all closed
  useEffect(() => {
    if (activeMega || searchOpen || mobileOpen) setHiddenByScroll(false);
  }, [activeMega, searchOpen, mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pathMatches = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  /** True for a link's own href, or — for a link that owns a mega menu —
   *  any page listed under that mega menu (see megaMemberPaths above),
   *  so e.g. /our-process still lights up "About Us" even though its URL
   *  doesn't start with /about. */
  const isActive = (link: (typeof navLinks)[number]) =>
    pathMatches(link.href) ||
    (link.mega ? megaMemberPaths[link.mega].some(pathMatches) : false);

  /**
   * The link the moving underline should sit under. Falls back through:
   * the literally-hovered nav link, then — since the mega menu is a portal
   * rendered outside `<nav>`, moving the pointer into it fires `<nav>`'s
   * onMouseLeave and clears `hovered` even though the menu is still open —
   * whichever link opened the still-open mega menu, then the active route.
   */
  const indicatorFor =
    hovered ??
    (activeMega ? navLinks.find((l) => l.mega === activeMega)?.href : undefined) ??
    navLinks.find(isActive)?.href;
  const solidHeader = scrolled || activeMega !== null;
  const headerHidden = hiddenByScroll && !activeMega && !searchOpen && !mobileOpen;

  const iconBtnClass =
    "relative w-10 h-10 rounded-full flex items-center justify-center text-forest-ink/70 transition-colors duration-200 hover:bg-forest/10 hover:text-forest";
  const mobileIconBtnClass =
    "relative w-10 h-10 rounded-full flex items-center justify-center text-forest transition-colors duration-300 hover:bg-forest/8";

  function renderNavLink(link: (typeof navLinks)[number]) {
    const active = isActive(link);
    // The underline only actually sits under this link when nothing else is
    // hovered (or this one is). If hover moved it elsewhere, this link must
    // fall back to a readable color — `active` alone isn't enough, since
    // that stays true for the current route even while its underline has
    // slid away.
    const pillHere = indicatorFor === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onMouseEnter={() => {
          setHovered(link.href);
          openMega(link.mega ?? null);
        }}
        className={cn(
          "relative flex items-center gap-1 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
          pillHere
            ? "text-forest"
            : active
            ? "text-forest-deep"
            : "text-forest-ink/70 hover:text-forest"
        )}
      >
        {link.label}
        {pillHere && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-forest"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </Link>
    );
  }

  return (
    <>
      {/* fixed — fully transparent at rest so it reads as part of the hero underneath it,
          then gains a glassmorphism surface once content scrolls beneath it for legibility.
          Slides fully out of view on scroll-down and reappears on scroll-up, rather than staying permanently pinned. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out",
          headerHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "transition-all duration-500 ease-out border-b",
            solidHeader
              ? "bg-white/80 backdrop-blur-xl border-forest/10 shadow-[0_1px_0_0_rgba(9,56,26,0.04)]"
              : "bg-transparent border-transparent"
          )}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* single row — logo left, nav genuinely centered (1fr column), actions right */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-20">
            <Link href="/" className="flex items-center shrink-0" aria-label="Tropijoy home">
              <span className="relative h-9 sm:h-10 aspect-[2336/824] block">
                <Image
                  src="/brand/logo-green.png"
                  alt="Tropijoy"
                  fill
                  priority
                  sizes="150px"
                  className="object-contain"
                />
              </span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-8 lg:gap-10 justify-self-center"
              onMouseLeave={() => {
                setHovered(null);
                scheduleCloseMega();
              }}
            >
              {navLinks.map(renderNavLink)}
            </nav>

            <div className="flex items-center gap-3 shrink-0 justify-self-end">
              {/* grouped icon toolbar, md+ */}
              <div className="hidden md:flex items-center gap-1 rounded-full bg-white/60 border border-forest/10 p-1.5">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                  title="Search (⌘K)"
                  className={iconBtnClass}
                >
                  <Search size={18} />
                </button>
                <Link href="/orders" aria-label="Order history" title="Orders" className={iconBtnClass}>
                  <Package size={18} />
                </Link>
                <Link href="/wishlist" aria-label="Wishlist" title="Wishlist" className={iconBtnClass}>
                  <Heart size={18} />
                  {hydrated && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-forest text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 border-2 border-white">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                <button onClick={toggleCart} aria-label="Open cart" title="Cart" className={iconBtnClass}>
                  <ShoppingBag size={18} />
                  <AnimatePresence>
                    {hydrated && itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-0 right-0 bg-sunny text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 border-2 border-white"
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* compact actions below md — everything else lives in the mobile drawer */}
              <div className="flex md:hidden items-center gap-1">
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                  className={mobileIconBtnClass}
                >
                  <Search size={19} />
                </button>
                <Link href="/wishlist" aria-label="Wishlist" className={mobileIconBtnClass}>
                  <Heart size={19} />
                  {hydrated && wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-forest text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5 border border-cream">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                <button onClick={toggleCart} aria-label="Open cart" className={mobileIconBtnClass}>
                  <ShoppingBag size={19} />
                  <AnimatePresence>
                    {hydrated && itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1 right-1 bg-sunny text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5 border border-cream"
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  className={mobileIconBtnClass}
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <MegaMenu
          activeMega={activeMega}
          onMouseEnter={() => openMega(activeMega)}
          onMouseLeave={scheduleCloseMega}
        />
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-forest-deep/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[280px] bg-cream p-6 flex flex-col gap-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <Image
                  src="/brand/logo-green.png"
                  alt="Tropijoy"
                  width={177}
                  height={80}
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-forest hover:bg-forest/8"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-semibold uppercase tracking-wide transition-colors",
                      isActive(link)
                        ? "bg-forest text-white"
                        : "text-forest-deep/75 hover:bg-forest/6"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {mobileGroups.map((group) => (
                <div key={group.heading} className="border-t border-forest/10 pt-4 flex flex-col gap-1">
                  <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-forest-deep/35">
                    {group.heading}
                  </p>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-forest-deep/65 hover:bg-forest/6 transition-colors"
                    >
                      <link.icon size={16} /> {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
