import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { posts } from "@/lib/blog";
import {
  termsDocument,
  privacyDocument,
  shippingPolicyDocument,
  returnsPolicyDocument,
  storageGuideDocument,
  qualitySafetyDocument,
  cookiesDocument,
  accessibilityDocument,
} from "@/lib/legal";
import { SITE_URL } from "@/lib/utils";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const staticPages: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/bundles", priority: 0.8, changeFrequency: "weekly" },
  { path: "/best-sellers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/recipes", priority: 0.6, changeFrequency: "monthly" },
  { path: "/reviews", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/our-process", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sustainability", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/track-order", priority: 0.3, changeFrequency: "yearly" },
  { path: "/gift-cards", priority: 0.5, changeFrequency: "monthly" },
  { path: "/gifting", priority: 0.5, changeFrequency: "monthly" },
  { path: "/corporate-gifting", priority: 0.4, changeFrequency: "monthly" },
  { path: "/wholesale", priority: 0.4, changeFrequency: "monthly" },
  { path: "/stockists", priority: 0.4, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" },
  { path: "/press", priority: 0.3, changeFrequency: "monthly" },
  { path: "/refer", priority: 0.3, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.2, changeFrequency: "yearly" },
];

const legalPages = [
  { path: "/terms", updated: termsDocument.updated },
  { path: "/privacy-policy", updated: privacyDocument.updated },
  { path: "/shipping-policy", updated: shippingPolicyDocument.updated },
  { path: "/returns-policy", updated: returnsPolicyDocument.updated },
  { path: "/storage-guide", updated: storageGuideDocument.updated },
  { path: "/quality-and-safety", updated: qualitySafetyDocument.updated },
  { path: "/cookies", updated: cookiesDocument.updated },
  { path: "/accessibility", updated: accessibilityDocument.updated },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const legalEntries = legalPages.map(({ path, updated }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(updated),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const productEntries = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...legalEntries, ...productEntries, ...blogEntries];
}
