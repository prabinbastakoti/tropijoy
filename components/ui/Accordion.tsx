"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionEntry {
  question: string;
  answer: string;
}

export default function Accordion({
  items,
  className,
}: {
  items: AccordionEntry[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-forest/10", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-start justify-between gap-4 py-5 text-left group"
            >
              <span
                className={cn(
                  "font-semibold transition-colors",
                  open ? "text-forest" : "text-forest-deep group-hover:text-forest"
                )}
              >
                {item.question}
              </span>
              <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-forest/10 text-forest transition-colors">
                {open ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-forest-deep/70">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
