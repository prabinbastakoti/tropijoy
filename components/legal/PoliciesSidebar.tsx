import Link from "next/link";

export const policiesLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Quality & Safety", href: "/quality-and-safety" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Returns & Refunds", href: "/returns-policy" },
  { label: "Storage Guide", href: "/storage-guide" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function PoliciesSidebar({ currentHref }: { currentHref: string }) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <p className="text-xs font-bold uppercase tracking-wider text-forest/45 mb-3">
        Policies &amp; Guides
      </p>
      <nav className="flex flex-col gap-1">
        {policiesLinks.map((link) => {
          const active = link.href === currentHref;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "rounded-xl bg-forest text-white px-4 py-2.5 text-sm font-semibold"
                  : "rounded-xl px-4 py-2.5 text-sm font-medium text-forest-deep/65 hover:bg-forest/6 transition-colors"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
