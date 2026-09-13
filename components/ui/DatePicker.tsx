"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  /** ISO "YYYY-MM-DD", matching the rest of the bill form's date convention. */
  value: string;
  onChange: (iso: string) => void;
  className?: string;
}

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function dateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = isoToDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-left text-sm outline-none focus:ring-2 focus:ring-forest/30",
            className
          )}
        >
          <CalendarDays size={16} className="shrink-0 text-forest/60" />
          <span className={selected ? "text-forest-deep" : "text-forest-ink/40"}>
            {selected
              ? selected.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Select date"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(dateToISO(d));
              setOpen(false);
            }
          }}
          autoFocus
          // The library sets --rdp-accent-color etc. directly on its own
          // .rdp-root element, which beats an override from any ancestor —
          // these have to land on that same element, with !important so they
          // win regardless of which stylesheet happens to load last.
          className="![--rdp-accent-background-color:#E8F0EC] ![--rdp-accent-color:#116530] ![--rdp-day_button-border-radius:0.5rem] [&_.rdp-day_button:focus-visible]:outline-forest [&_.rdp-month_caption]:pl-1.5"
        />
        <div className="mt-2 border-t border-forest/10 pt-2">
          <button
            type="button"
            onClick={() => {
              onChange(dateToISO(new Date()));
              setOpen(false);
            }}
            className="w-full rounded-lg py-1.5 text-center text-xs font-semibold text-forest hover:bg-forest/5"
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
