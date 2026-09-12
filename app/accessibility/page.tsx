import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { accessibilityDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Tropijoy's accessibility statement — what we've done and how to report a problem.",
};

export default function AccessibilityPage() {
  return <LegalLayout doc={accessibilityDocument} currentHref="/accessibility" />;
}
