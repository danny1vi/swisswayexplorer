type SourceImage = {
  url: string;
  alt?: string;
};

type EntryWithImage = {
  slug?: string;
  title?: string;
  image?: SourceImage | null;
};

type ResolvedImage = {
  url: string;
  alt: string;
};

const destinationFallbacks: Record<string, ResolvedImage> = {
  lucerne: {
    url: "/images/fallbacks/destination-lucerne.svg",
    alt: "Lake Lucerne shoreline with alpine ridges and a covered bridge silhouette.",
  },
  "interlaken-jungfrau": {
    url: "/images/fallbacks/destination-interlaken-jungfrau.svg",
    alt: "Bernese Oberland valley with bright lakes and snowy Jungfrau peaks.",
  },
  zermatt: {
    url: "/images/fallbacks/destination-zermatt.svg",
    alt: "Matterhorn-style mountain silhouette above the Zermatt valley at sunrise.",
  },
};

const guideFallbacks: Record<string, ResolvedImage> = {
  "7-day-switzerland-route-basics": {
    url: "/images/fallbacks/guide-7-day-route.svg",
    alt: "Stylized Switzerland route map with two bases linked by a seven-day travel line.",
  },
  "swiss-transport-pass-quick-decision-guide": {
    url: "/images/fallbacks/guide-transport-pass.svg",
    alt: "Swiss rail ticket and train illustration for transport pass planning.",
  },
  "seasonal-planning-spring-vs-summer": {
    url: "/images/fallbacks/guide-seasonal-planning.svg",
    alt: "Split alpine landscape contrasting spring blossom with bright summer hiking weather.",
  },
};

function resolveImage(entry: EntryWithImage | null | undefined, fallbacks: Record<string, ResolvedImage>) {
  if (entry?.image?.url) {
    return {
      url: entry.image.url,
      alt: entry.image.alt || entry.title || "SwissWayExplorer editorial image",
    } satisfies ResolvedImage;
  }

  if (!entry?.slug) {
    return undefined;
  }

  return fallbacks[entry.slug];
}

export function resolveDestinationImage(entry: EntryWithImage | null | undefined) {
  return resolveImage(entry, destinationFallbacks);
}

export function resolveGuideImage(entry: EntryWithImage | null | undefined) {
  return resolveImage(entry, guideFallbacks);
}
