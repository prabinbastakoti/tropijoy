import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Use "h1" on pages where this is the primary heading. */
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-bold tracking-[0.18em] text-forest uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <Tag className="font-display font-extrabold text-3xl sm:text-4xl lg:text-display-sm text-forest-deep text-balance">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-forest-deep/60 leading-relaxed text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
