import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((crumb, i) => {
        const last = i === items.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {crumb.href && !last ? (
              <Link
                href={crumb.href}
                className="text-forest-deep/50 hover:text-forest transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={last ? "text-forest-deep font-medium" : "text-forest-deep/50"}
                aria-current={last ? "page" : undefined}
              >
                {crumb.label}
              </span>
            )}
            {!last && <ChevronRight size={14} className="text-forest-deep/25" />}
          </span>
        );
      })}
    </nav>
  );
}
