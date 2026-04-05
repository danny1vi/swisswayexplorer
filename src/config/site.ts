export type NavItem = {
  label: string;
  href: string;
};

export type FeaturedCard = {
  title: string;
  summary: string;
  href: string;
  imageUrl?: string;
};

export const siteConfig = {
  name: "SwissWayExplorer",
  domain: "swisswayexplorer.com",
  tagline: "Plan Switzerland with clarity, pace, and confidence.",
  seo: {
    title: "SwissWayExplorer | Editorial Switzerland Trip Planning",
    description:
      "Trusted destination briefs and practical travel guides for Switzerland, designed for faster and better trip decisions.",
  },
  nav: [
    { label: "Destinations", href: "/destinations" },
    { label: "Guides", href: "/guides" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  hero: {
    eyebrow: "Switzerland Travel Editorial",
    heading: "Build a better Switzerland itinerary in half the research time.",
    description:
      "SwissWayExplorer distills scattered travel advice into route-first decisions: where to base yourself, how long to stay, and how to move efficiently between regions.",
    primaryCta: { label: "Browse Destinations", href: "/destinations" },
    secondaryCta: { label: "Read Planning Guides", href: "/guides" },
  },
  featured: [
    {
      title: "Lucerne Region",
      summary:
        "A reliable first base for many itineraries, combining lakefront city pace with straightforward mountain day trips.",
      href: "/destinations/lucerne",
    },
    {
      title: "Interlaken & Jungfrau",
      summary:
        "High-impact alpine planning zone where timing, weather windows, and rail strategy strongly shape your trip quality.",
      href: "/destinations/interlaken-jungfrau",
    },
    {
      title: "Zermatt & Matterhorn",
      summary:
        "A premium car-free mountain destination where route sequencing and altitude-aware pacing matter more than volume.",
      href: "/destinations/zermatt",
    },
  ] as FeaturedCard[],
  cta: {
    heading: "Start with one clean route decision.",
    description:
      "Pick your base region, then align transport, season, and day-trip logic. Use the guides to avoid common planning mistakes.",
    action: { label: "Open Guides", href: "/guides" },
  },
};
