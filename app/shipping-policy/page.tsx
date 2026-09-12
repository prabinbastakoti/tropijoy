import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { shippingPolicyDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Where Tropijoy delivers across Nepal, how long it takes, and what it costs.",
};

export default function ShippingPolicyPage() {
  return <LegalLayout doc={shippingPolicyDocument} currentHref="/shipping-policy" />;
}
