import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { cookiesDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What Tropijoy stores in your browser, why, and how to control it.",
};

export default function CookiesPage() {
  return <LegalLayout doc={cookiesDocument} currentHref="/cookies" />;
}
