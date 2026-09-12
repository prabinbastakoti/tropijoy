"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/checkout";
import Button from "@/components/ui/Button";

export default function InquiryForm({
  source,
  title = "Send an enquiry",
  subtitle = "We'll reply to the email you give us.",
  messageLabel = "Message",
  messagePlaceholder = "Tell us a bit about what you need.",
  namePlaceholder = "Aayush Shrestha",
  className,
}: {
  /** Tag stored with the lead so it's clear which page/purpose this came from. */
  source: string;
  title?: string;
  subtitle?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  namePlaceholder?: string;
  className?: string;
}) {
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
        source: `${source} — ${name.trim()}: ${message.trim().slice(0, 400)}`,
      });
      if (result.success) {
        toast.success(
          result.demoMode
            ? "Demo mode — enquiry captured but no email was sent."
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
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl bg-white border border-forest/10 p-6 sm:p-7 ${className ?? ""}`}
    >
      <h2 className="font-display font-bold text-xl text-forest-deep mb-1">{title}</h2>
      <p className="text-sm text-forest-deep/55 mb-6">{subtitle}</p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`${source}-name`}
            className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
          >
            Your name
          </label>
          <input
            id={`${source}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={namePlaceholder}
            className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>

        <div>
          <label
            htmlFor={`${source}-email`}
            className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
          >
            Email
          </label>
          <input
            id={`${source}-email`}
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
            htmlFor={`${source}-message`}
            className="text-xs font-semibold text-forest-deep/70 mb-1.5 block"
          >
            {messageLabel}
          </label>
          <textarea
            id={`${source}-message`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder={messagePlaceholder}
            className="w-full rounded-xl border border-forest/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-forest/30 resize-none"
          />
        </div>
      </div>

      <Button type="submit" fullWidth disabled={loading} className="mt-6">
        <Send size={16} />
        {loading ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
