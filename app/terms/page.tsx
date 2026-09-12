import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { termsDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of the Tropijoy website and any order placed through it.",
};

export default function TermsPage() {
  return <LegalLayout doc={termsDocument} currentHref="/terms" />;
}
