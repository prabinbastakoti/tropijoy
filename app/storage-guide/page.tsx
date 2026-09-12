import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { storageGuideDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Storage & Shelf Life Guide",
  description:
    "How to store Tropijoy pouches, how long they last, and how to protect them from humidity and sunlight.",
};

export default function StorageGuidePage() {
  return <LegalLayout doc={storageGuideDocument} currentHref="/storage-guide" />;
}
