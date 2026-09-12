"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/checkout";
import { BUSINESS } from "@/lib/legal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BUSINESS.phone,
    note: "Fastest during business hours",
    href: `https://wa.me/${BUSINESS.phone.replace(/[^0-9]/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: BUSINESS.email,
    note: "We reply within one working day",
    href: `mailto:${BUSINESS.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: BUSINESS.phone,
    note: "Sun–Fri, 10am–6pm",
    href: `tel:${BUSINESS.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@tropijoy",
    note: "DMs are open",
    href: "#",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const result = await submitLead({
        email: email.trim(),
        source: `contact-form — ${name.trim()}: ${message.trim().slice(0, 400)}`,
      });
      if (result.success) {
        toast.success(
          result.demoMode
            ? "Demo mode — message captured but no email was sent."
            : "Thanks! We'll get back to you shortly."
        );
        setName("");
        setEmail("");
        setMessage("");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="mt-10 mb-12 max-w-2xl">
        <span className="inline-block text-xs font-bold tracking-[0.18em] text-forest uppercase mb-3">
          Get in touch
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-forest-deep leading-tight text-balance">
          We answer every message
        </h1>
        <p className="mt-4 text-forest-deep/65 leading-relaxed">
          Question about an order, a batch that didn&apos;t taste right, or a
          wholesale enquiry — pick whichever channel suits you.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* channels */}
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            {channels.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 0.07}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex h-full items-start gap-4 rounded-3xl bg-white border border-forest/10 p-6 hover:shadow-lift transition-shadow"
                >
                  <span className="w-11 h-11 rounded-2xl bg-forest/8 flex items-center justify-center shrink-0 group-hover:bg-forest group-hover:text-white text-forest transition-colors">
                    <channel.icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-forest-deep">
                      {channel.label}
                    </span>
                    <span className="block text-sm text-forest-deep/70 truncate mt-0.5">
                      {channel.value}
                    </span>
                    <span className="block text-xs text-forest-deep/40 mt-1">
                      {channel.note}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-forest text-cream p-6">
                <MapPin size={19} className="text-white mb-3" />
                <p className="font-semibold mb-1">Where we are</p>
                <p className="text-sm text-cream/65 leading-relaxed">
                  {BUSINESS.location}
                  <br />
                  Delivery across all of Nepal
                </p>
              </div>
              <div className="rounded-3xl bg-white border border-forest/10 p-6">
                <Clock size={19} className="text-forest mb-3" />
                <p className="font-semibold text-forest-deep mb-1">Hours</p>
                <p className="text-sm text-forest-deep/65 leading-relaxed">
                  Sunday–Friday
                  <br />
                  10:00am – 6:00pm NPT
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <Link
              href="/faq"
              className="group mt-6 flex items-center justify-between gap-4 rounded-3xl bg-sunny/20 border border-sunny/40 p-6 hover:bg-sunny/30 transition-colors"
            >
              <span>
                <span className="block font-semibold text-forest-deep">
                  Looking for a quick answer?
                </span>
                <span className="block text-sm text-forest-deep/60 mt-0.5">
                  Delivery, returns, ingredients and storage are all covered in
                  the FAQ.
                </span>
              </span>
              <ArrowRight
                size={20}
                className="text-forest shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* form */}
        <aside>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-7 lg:sticky lg:top-28"
          >
            <h2 className="font-display font-bold text-xl text-forest-deep mb-1">
              Send a message
            </h2>
            <p className="text-sm text-forest-deep/55 mb-6">
              We&apos;ll reply to the email you give us.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Aayush Shrestha"
                  className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              <Send size={16} />
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
