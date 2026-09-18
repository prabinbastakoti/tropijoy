"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

const SECOND = 1000;

function secondsUntil(target: number) {
  return Math.max(0, Math.ceil((target - Date.now()) / SECOND));
}

function split(total: number) {
  return [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((total % 3600) / 60) },
    { label: "Seconds", value: total % 60 },
  ];
}

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ label, value }: { label: string; value: number | null }) {
  const text = value === null ? "--" : pad(value);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-md shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10">
        {/* soft top sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"
        />
        {/* Tile and digit size follow viewport height so the whole page fits one screen. */}
        <div className="relative flex h-[clamp(3.75rem,min(12.5vh,20vw),8rem)] items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-display font-extrabold tabular-nums leading-none text-white [font-size:clamp(1.75rem,min(11vw,8vh),4.5rem)]"
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // null until mounted: the server has no idea what "now" is for the visitor,
  // so rendering a live value on the first pass would cause a hydration mismatch.
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    setSeconds(secondsUntil(targetMs));
    // Tick faster than 1s so the display never lags behind the wall clock;
    // React bails out of re-rendering while the value is unchanged.
    const id = setInterval(() => setSeconds(secondsUntil(targetMs)), 250);
    return () => clearInterval(id);
  }, [targetMs]);

  if (seconds === 0) {
    return (
      <div className="text-center">
        <p className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          The wait is over!
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-forest-deep transition-transform hover:scale-[1.03] active:scale-95"
        >
          <RefreshCw size={16} /> Refresh to visit Tropijoy
        </button>
      </div>
    );
  }

  const units: { label: string; value: number | null }[] = split(seconds ?? 0).map((u) =>
    seconds === null ? { ...u, value: null } : u
  );

  return (
    <div role="timer" aria-label="Time until Tropijoy reopens">
      {/* Screen readers get one stable sentence instead of four ticking cards. */}
      <p className="sr-only">
        {seconds === null
          ? "Countdown loading."
          : `${units[0].value} days, ${units[1].value} hours and ${units[2].value} minutes remaining.`}
      </p>
      <div aria-hidden className="grid grid-cols-4 gap-[clamp(0.5rem,1.6vw,1.25rem)]">
        {units.map((unit) => (
          <Unit key={unit.label} label={unit.label} value={unit.value} />
        ))}
      </div>
    </div>
  );
}
