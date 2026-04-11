import { siteConfig } from "../../config/site";
import { sanityFetch } from "./client";
import {
  DESTINATIONS_QUERY,
  DESTINATION_BY_SLUG_QUERY,
  GUIDES_QUERY,
  GUIDE_BY_SLUG_QUERY,
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import type { Destination, Guide, PageHomeData, SiteSettings } from "./types";

const seedDestinations: Destination[] = siteConfig.featured.map((item) => ({
  title: item.title,
  slug: item.href.split("/").filter(Boolean).pop() || "",
  summary: item.summary,
  image: item.imageUrl ? { url: item.imageUrl, alt: item.title } : undefined,
}));

const seedGuides: Guide[] = [
  {
    title: "How to Structure a 7-Day Switzerland Trip",
    slug: "7-day-switzerland-route-basics",
    summary:
      "A practical framework for splitting nights between two hubs without overloading transfer days or mountain windows.",
    category: "itinerary",
  },
  {
    title: "Swiss Transport Pass Decision Guide",
    slug: "swiss-transport-pass-quick-decision-guide",
    summary:
      "A clean decision tree to compare Saver Day Passes, Half Fare Card, and point-to-point tickets based on your route pattern.",
    category: "transport",
  },
  {
    title: "Spring vs Summer: When to Go",
    slug: "seasonal-planning-spring-vs-summer",
    summary:
      "A realistic comparison of weather stability, crowd density, pricing pressure, and day-trip reliability between seasons.",
    category: "seasonal",
  },
];

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  return Array.from(new Map(items.filter((item) => item.slug).map((item) => [item.slug, item])).values());
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null);
}

export async function getHomePage() {
  return sanityFetch<PageHomeData | null>(HOME_PAGE_QUERY, {}, null);
}

export async function getDestinations() {
  const fromSanity = await sanityFetch<Destination[]>(DESTINATIONS_QUERY, {}, []);
  return fromSanity.length > 0 ? fromSanity : seedDestinations;
}

export async function getDestinationPaths() {
  const fromSanity = await sanityFetch<Destination[]>(DESTINATIONS_QUERY, {}, []);
  return uniqueBySlug([...seedDestinations, ...fromSanity]);
}

export async function getDestinationBySlug(slug: string, seedItem?: Destination) {
  const fromSanity = await sanityFetch<Destination | null>(DESTINATION_BY_SLUG_QUERY, { slug }, null);
  return fromSanity ?? seedItem ?? null;
}

export async function getGuides() {
  const fromSanity = await sanityFetch<Guide[]>(GUIDES_QUERY, {}, []);
  return fromSanity.length > 0 ? fromSanity : seedGuides;
}

export async function getGuidePaths() {
  const fromSanity = await sanityFetch<Guide[]>(GUIDES_QUERY, {}, []);
  return uniqueBySlug([...seedGuides, ...fromSanity]);
}

export async function getGuideBySlug(slug: string, seedItem?: Guide) {
  const fromSanity = await sanityFetch<Guide | null>(GUIDE_BY_SLUG_QUERY, { slug }, null);
  return fromSanity ?? seedItem ?? null;
}
