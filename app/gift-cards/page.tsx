"use client";

import { useState } from "react";
import { Gift, Send } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { submitLead } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/utils";

const amounts = [1000, 2000, 3000, 5000];

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(amounts[1]);
  const [email, setEmail] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await submitLead({
        email: email.trim(),
        source: `gift-card-request — Rs. ${amount} for ${recipient.trim() || "unspecified recipient"}`,
      });
      if (result.success) {
        toast.success(
          result.demoMode
            ? "Demo mode — request captured, no email was sent."
            : "Got it — we'll send payment details and issue your gift card."
        );
        setEmail("");
        setRecipient("");
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gift Cards" }]} />

      <SectionHeading
        eyebrow="Gifting"
        as="h1"
        title="Tropijoy Gift Cards"
        description="Let someone else pick their own favourites. Gift cards never expire and work on any product in the shop."
        className="my-10"
      />

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-forest via-forest-light to-forest-deep p-8 sm:p-10 text-white relative overflow-hidden">
            <Gift size={28} className="text-white mb-6" />
            <p className="text-sm text-white/60 mb-1">Tropijoy Gift Card</p>
            <p className="font-display font-extrabold text-4xl sm:text-5xl mb-6">
              {formatPrice(amount)}
            </p>
            <p className="text-sm text-white/60">
              Delivered by email &middot; No expiry &middot; Redeemable on any product
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-7"
          >
            <p className="text-sm font-semibold text-forest-deep mb-3">Choose an amount</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                    amount === value
                      ? "border-forest bg-forest text-white"
                      : "border-forest/20 text-forest-deep/70 hover:border-forest/50"
                  }`}
                >
                  {value / 1000}k
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="gift-recipient"
                  className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                >
                  Recipient name (optional)
                </label>
                <input
                  id="gift-recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Who's it for?"
                  className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
              <div>
                <label
                  htmlFor="gift-email"
                  className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                >
                  Your email
                </label>
                <input
                  id="gift-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <p className="text-xs text-forest-deep/45 mt-4 mb-4 leading-relaxed">
              We don&apos;t process card payments on the site yet — request a
              gift card here and we&apos;ll follow up to arrange payment and
              issue the code, same as a regular order.
            </p>

            <Button type="submit" fullWidth disabled={loading}>
              <Send size={16} />
              {loading ? "Sending…" : `Request ${formatPrice(amount)} gift card`}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
