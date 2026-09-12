"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/checkout";
import Reveal from "@/components/motion/Reveal";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await submitLead({ email: email.trim(), source: "homepage-newsletter" });
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <Reveal>
          <div className="rounded-[2rem] border border-forest/10 bg-white px-6 py-10 sm:px-14 sm:py-16 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest/8 text-forest mb-5">
              <Mail size={22} />
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep text-balance">
              Get Fresh Discounts &amp; Season Drops
            </h2>
            <p className="mt-3 text-forest-deep/65 max-w-md mx-auto text-balance">
              Join our newsletter for 10% off your first order and early
              access to new releases.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 min-w-0 rounded-full border border-forest/15 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white text-sm font-semibold px-6 py-3 hover:bg-forest-light transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Claim 10% Off"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
