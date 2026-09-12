import { Info } from "lucide-react";
import type { BlogBlock } from "@/lib/types";

export default function BlogBlocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="font-display font-extrabold text-2xl text-forest-deep pt-4"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p
                key={i}
                className="text-forest-deep/75 leading-[1.8] text-[15px]"
              >
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-forest-deep/75 text-[15px] leading-relaxed"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sunny shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <figure
                key={i}
                className="border-l-4 border-sunny pl-6 py-2 my-8"
              >
                <blockquote className="font-display text-xl text-forest-deep leading-snug">
                  &ldquo;{block.text}&rdquo;
                </blockquote>
                {block.attribution && (
                  <figcaption className="mt-3 text-sm text-forest-deep/50">
                    — {block.attribution}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <aside
                key={i}
                className="rounded-2xl bg-forest/5 border border-forest/10 p-5 my-8"
              >
                <p className="flex items-center gap-2 font-semibold text-forest-deep mb-2">
                  <Info size={16} className="text-forest shrink-0" />
                  {block.title}
                </p>
                <p className="text-sm text-forest-deep/70 leading-relaxed">
                  {block.text}
                </p>
              </aside>
            );
        }
      })}
    </div>
  );
}
