export type NavItem = {
  label: string;
  href: string;
};

export type FeaturedCard = {
  eyebrow?: string;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type CategoryHighlight = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

export type StoryRailItem = {
  eyebrow?: string;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type PhotoGalleryItem = {
  eyebrow?: string;
  title: string;
  summary?: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

export type PhotoGallery = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: PhotoGalleryItem[];
};

export type EditorialSplit = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  cta: {
    label: string;
    href: string;
  };
  image: {
    url: string;
    alt: string;
  };
  imageSide?: "left" | "right";
  relatedStories?: Array<{
    eyebrow?: string;
    title: string;
    summary: string;
    href: string;
    imageUrl?: string;
    imageAlt?: string;
  }>;
};

export type ItineraryTeaser = {
  duration: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
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
    { label: "Destinations", href: "/destinations/" },
    { label: "Guides", href: "/guides/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ] as NavItem[],
  hero: {
    eyebrow: "Switzerland Travel Editorial",
    heading: "Build a better Switzerland itinerary in half the research time.",
    description:
      "SwissWayExplorer distills scattered travel advice into route-first decisions: where to base yourself, how long to stay, and how to move efficiently between regions.",
    primaryCta: { label: "Browse Destinations", href: "/destinations/" },
    secondaryCta: { label: "Read Planning Guides", href: "/guides/" },
  },
  homepage: {
    categoryHighlights: [
      {
        eyebrow: "Base Logic",
        title: "Destinations",
        description:
          "Start with the region profile that gives you the best hotel base, rail reach, and day-trip rhythm.",
        href: "/destinations/",
      },
      {
        eyebrow: "Decision Guides",
        title: "Guides",
        description:
          "Use focused planning notes to choose passes, compare seasons, and avoid expensive route mistakes.",
        href: "/guides/",
      },
      {
        eyebrow: "Quick Formats",
        title: "12-Hour Planning",
        description:
          "Short, high-signal editorial pieces for arrival days, city windows, and route transitions.",
        href: "/guides/",
      },
    ] as CategoryHighlight[],
    storyRail: [
      {
        eyebrow: "First-time logic",
        title: "Pick the base that makes the rest of the trip easier",
        summary:
          "See which Switzerland bases reduce transfer friction before you commit nights, passes, or mountain days.",
        href: "/destinations/lucerne/",
        imageUrl: "/images/fallbacks/destination-lucerne.svg",
        imageAlt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
      },
      {
        eyebrow: "Alpine payoff",
        title: "Compare the mountains that justify a full route shift",
        summary:
          "Use one strong alpine zone instead of scattering your week across too many scenic stops.",
        href: "/destinations/interlaken-jungfrau/",
        imageUrl: "/images/fallbacks/destination-interlaken-jungfrau.svg",
        imageAlt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
      },
      {
        eyebrow: "Route discipline",
        title: "See how a 7-day trip holds together when the pacing is right",
        summary:
          "Follow the planning logic that keeps Switzerland intense without turning every day into a transfer day.",
        href: "/guides/7-day-switzerland-route-basics/",
        imageUrl: "/images/fallbacks/guide-7-day-route.svg",
        imageAlt: "Stylized Switzerland route map with two bases linked by a seven-day travel line.",
      },
    ] as StoryRailItem[],
    photoGallery: {
      eyebrow: "Photo Gallery",
      title: "Jump into the route questions that usually begin with one strong image.",
      description:
        "Use these photo-led links to open a destination brief or planning guide directly from the top of the homepage.",
      items: [
        {
          eyebrow: "Base choice",
          title: "Lucerne",
          summary: "Open the destination brief that works well as a calm first Switzerland base.",
          href: "/destinations/lucerne/",
          imageUrl: "/images/fallbacks/destination-lucerne.svg",
          imageAlt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
        },
        {
          eyebrow: "Mountain focus",
          title: "Interlaken & Jungfrau",
          summary: "See the alpine base where weather windows and route timing matter most.",
          href: "/destinations/interlaken-jungfrau/",
          imageUrl: "/images/fallbacks/destination-interlaken-jungfrau.svg",
          imageAlt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
        },
        {
          eyebrow: "Route planning",
          title: "7-Day Structure",
          summary: "Open the guide for a cleaner two-hub Switzerland itinerary.",
          href: "/guides/7-day-switzerland-route-basics/",
          imageUrl: "/images/fallbacks/guide-7-day-route.svg",
          imageAlt: "Stylized Switzerland route map with two bases linked by a seven-day travel line.",
        },
      ],
    } as PhotoGallery,
    editorialSplit: {
      eyebrow: "Editor's Pick",
      title: "Lucerne remains the cleanest first base for many Switzerland itineraries.",
      description:
        "It balances lake-city softness, strong rail connectivity, and realistic mountain access without forcing a full alpine logistics commitment on day one.",
      body:
        "Choose Lucerne when you want one calm anchor before committing to the Bernese Oberland or Valais. It is especially strong for mixed-weather itineraries, shoulder-season pacing, and travelers who want scenic impact without transfer-heavy planning.",
      cta: { label: "Read the Lucerne brief", href: "/destinations/lucerne/" },
      image: {
        url: "/images/fallbacks/destination-lucerne.svg",
        alt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
      },
      imageSide: "left",
      relatedStories: [
        {
          eyebrow: "First trip",
          title: "Start with a base that keeps weather risk manageable",
          summary:
            "Lucerne buys flexibility when mountain plans need to move without collapsing the whole route.",
          href: "/destinations/lucerne/",
          imageUrl: "/images/fallbacks/destination-lucerne.svg",
          imageAlt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
        },
        {
          eyebrow: "Mountain switch",
          title: "Only shift fully alpine when the payoff is worth the nights",
          summary:
            "Interlaken works best when the mountains are the trip, not when they are only one scenic chapter.",
          href: "/destinations/interlaken-jungfrau/",
          imageUrl: "/images/fallbacks/destination-interlaken-jungfrau.svg",
          imageAlt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
        },
        {
          eyebrow: "Route logic",
          title: "A seven-day trip improves fast when the transfers are grouped",
          summary:
            "Use a cleaner two-hub plan before adding extra scenic stops that look good but slow the whole week.",
          href: "/guides/7-day-switzerland-route-basics/",
          imageUrl: "/images/fallbacks/guide-7-day-route.svg",
          imageAlt: "Stylized Switzerland route map with two bases linked by a seven-day travel line.",
        },
      ],
    } as EditorialSplit,
    featuredStories: [
      {
        eyebrow: "Central Switzerland",
        title: "Lucerne Region",
        summary:
          "A reliable first base for many itineraries, combining lakefront city pace with straightforward mountain day trips.",
        href: "/destinations/lucerne/",
        imageUrl: "/images/fallbacks/destination-lucerne.svg",
        imageAlt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
      },
      {
        eyebrow: "Bernese Oberland",
        title: "Interlaken & Jungfrau",
        summary:
          "High-impact alpine planning zone where timing, weather windows, and rail strategy strongly shape your trip quality.",
        href: "/destinations/interlaken-jungfrau/",
        imageUrl: "/images/fallbacks/destination-interlaken-jungfrau.svg",
        imageAlt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
      },
      {
        eyebrow: "Valais",
        title: "Zermatt & Matterhorn",
        summary:
          "A premium car-free mountain destination where route sequencing and altitude-aware pacing matter more than volume.",
        href: "/destinations/zermatt/",
        imageUrl: "/images/fallbacks/destination-zermatt.svg",
        imageAlt: "Matterhorn-style mountain silhouette above the Zermatt valley at sunrise.",
      },
    ] as FeaturedCard[],
    itineraryTeasers: [
      {
        duration: "12 hours",
        title: "Arrival-day logic without wasting your first evening",
        description:
          "A compact framework for deciding whether to stay local, take a scenic loop, or protect energy for the next rail day.",
        href: "/guides/7-day-switzerland-route-basics/",
        imageUrl: "/images/fallbacks/guide-7-day-route.svg",
        imageAlt: "Stylized Switzerland route map with two bases linked by a seven-day travel line.",
      },
      {
        duration: "2 days",
        title: "Transport decisions that reduce total trip friction",
        description:
          "Use passes, saver tickets, and route grouping deliberately instead of buying rail products too early.",
        href: "/guides/swiss-transport-pass-quick-decision-guide/",
        imageUrl: "/images/fallbacks/guide-transport-pass.svg",
        imageAlt: "Swiss rail ticket and train illustration for transport pass planning.",
      },
      {
        duration: "Shoulder season",
        title: "Spring vs summer planning with weather reality included",
        description:
          "A faster way to weigh scenery, crowd pressure, and mountain reliability before you lock dates.",
        href: "/guides/seasonal-planning-spring-vs-summer/",
        imageUrl: "/images/fallbacks/guide-seasonal-planning.svg",
        imageAlt: "Split alpine landscape contrasting spring blossom with bright summer hiking weather.",
      },
    ] as ItineraryTeaser[],
  },
  featured: [
    {
      eyebrow: "Central Switzerland",
      title: "Lucerne Region",
      summary:
        "A reliable first base for many itineraries, combining lakefront city pace with straightforward mountain day trips.",
      href: "/destinations/lucerne/",
      imageUrl: "/images/fallbacks/destination-lucerne.svg",
      imageAlt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
    },
    {
      eyebrow: "Bernese Oberland",
      title: "Interlaken & Jungfrau",
      summary:
        "High-impact alpine planning zone where timing, weather windows, and rail strategy strongly shape your trip quality.",
      href: "/destinations/interlaken-jungfrau/",
      imageUrl: "/images/fallbacks/destination-interlaken-jungfrau.svg",
      imageAlt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
    },
    {
      eyebrow: "Valais",
      title: "Zermatt & Matterhorn",
      summary:
        "A premium car-free mountain destination where route sequencing and altitude-aware pacing matter more than volume.",
      href: "/destinations/zermatt/",
      imageUrl: "/images/fallbacks/destination-zermatt.svg",
      imageAlt: "Matterhorn-style mountain silhouette above the Zermatt valley at sunrise.",
    },
  ] as FeaturedCard[],
  cta: {
    heading: "Start with one clean route decision.",
    description:
      "Pick your base region, then align transport, season, and day-trip logic. Use the guides to avoid common planning mistakes.",
    action: { label: "Open Guides", href: "/guides/" },
  },
};
