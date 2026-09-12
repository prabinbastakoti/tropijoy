import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { qualitySafetyDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Quality & Safety Standards",
  description:
    "How Tropijoy processes fruit — hygienic washing, precision machine-slicing, food compliance, and zero sulphites.",
};

export default function QualitySafetyPage() {
  return <LegalLayout doc={qualitySafetyDocument} currentHref="/quality-and-safety" />;
}
