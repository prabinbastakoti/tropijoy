"use client";

import { forwardRef, useState } from "react";
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
  /** Called once the popover closes (date picked, Today, or dismissed) — lets
   * the parent move focus on to the next field instead of Radix's default
   * of returning focus to this trigger. */
  onDone?: () => void;
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

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, onChange, className, onDone },
  ref
) {
  const [open, setOpen] = useState(false);
  const selected = isoToDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
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
      <PopoverContent
        className="w-auto p-4"
        onCloseAutoFocus={(e) => {
          // Radix's default is to return focus to this trigger — send it on
          // to whatever's next instead, whenever the popover closes at all
          // (date picked, Today, Escape, or a click outside).
          if (onDone) {
            e.preventDefault();
            onDone();
          }
        }}
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            // Clicking/entering the already-selected day toggles react-day-picker's
            // single-select mode to `undefined` (deselect) instead of firing again
            // with the same date — keep the existing value in that case, but still
            // close the popover either way.
            if (d) onChange(dateToISO(d));
            setOpen(false);
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
});

export default DatePicker;
