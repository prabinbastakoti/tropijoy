import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { returnsPolicyDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Returns & Refund Guarantee",
  description:
    "Our policy for damaged items, missing packages, and food quality refunds.",
};

export default function ReturnsPolicyPage() {
  return <LegalLayout doc={returnsPolicyDocument} currentHref="/returns-policy" />;
}
