"use client";

import { useState } from "react";
import { Gift, Send, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { submitLead } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/utils";

const REFERRAL_REWARD = 150;

const steps = [
  {
    icon: Share2,
    title: "Share your email",
    body: "Tell us who you'd like to refer — we'll send them a one-time code.",
  },
  {
    icon: Users,
    title: "They order",
    body: `Your friend gets ${formatPrice(REFERRAL_REWARD)} off their first order over Rs. 1,500.`,
  },
  {
    icon: Gift,
    title: "You both get rewarded",
    body: `Once their order ships, we credit you ${formatPrice(REFERRAL_REWARD)} toward your next one.`,
  },
];

export default function ReferPage() {
  const [yourEmail, setYourEmail] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!yourEmail.trim() || !friendEmail.trim()) return;
    setLoading(true);
    try {
      const result = await submitLead({
        email: yourEmail.trim(),
        source: `referral — referring ${friendEmail.trim()}`,
      });
      if (result.success) {
        toast.success(
          result.demoMode
            ? "Demo mode — referral captured, no email was sent."
            : "Sent! We'll email your friend a code shortly."
        );
        setYourEmail("");
        setFriendEmail("");
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
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Refer a Friend" }]} />

      <SectionHeading
        eyebrow="Referrals"
        as="h1"
        title={`Give ${formatPrice(REFERRAL_REWARD)}, get ${formatPrice(REFERRAL_REWARD)}`}
        description="Know someone who'd like real dried fruit? Send them a code — you both win."
        className="my-10"
      />

      <div className="grid sm:grid-cols-3 gap-6 mb-14">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl bg-white border border-forest/10 p-7">
              <div className="w-12 h-12 rounded-2xl bg-forest/8 flex items-center justify-center mb-5">
                <step.icon size={22} className="text-forest" />
              </div>
              <h3 className="font-display font-bold text-lg text-forest-deep mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-forest-deep/65 leading-relaxed">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-8 max-w-xl mx-auto"
        >
          <h2 className="font-display font-bold text-xl text-forest-deep mb-1">
            Refer a friend
          </h2>
          <p className="text-sm text-forest-deep/55 mb-6">
            One code per friend — they&apos;ll get it by email.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="your-email"
                className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
              >
                Your email
              </label>
              <input
                id="your-email"
                type="email"
                required
                value={yourEmail}
                onChange={(e) => setYourEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div>
              <label
                htmlFor="friend-email"
                className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
              >
                Friend&apos;s email
              </label>
              <input
                id="friend-email"
                type="email"
                required
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="friend@email.com"
                className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          <Button type="submit" fullWidth disabled={loading} className="mt-6">
            <Send size={16} />
            {loading ? "Sending…" : "Send referral"}
          </Button>
        </form>
      </Reveal>
    </div>
  );
}
