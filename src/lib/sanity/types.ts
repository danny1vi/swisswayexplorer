export type GenericSeo = {
  title?: string;
  description?: string;
};

export type GenericCta = {
  label: string;
  href: string;
};

export type ImageAsset = {
  url: string;
  alt?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string;
  defaultSeo?: GenericSeo;
  ogImage?: ImageAsset;
};

export type CategoryHighlight = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
};

export type EditorialSplitData = {
  eyebrow?: string;
  title: string;
  description: string;
  body?: string;
  cta?: GenericCta;
  image?: ImageAsset;
  imageSide?: "left" | "right";
};

export type ItineraryTeaser = {
  duration?: string;
  title: string;
  description: string;
  href: string;
};

export type PageHomeData = {
  heading: string;
  description: string;
  image?: ImageAsset;
  seoTitle?: string;
  seoDescription?: string;
  primaryCta: GenericCta;
  secondaryCta?: GenericCta;
  categoryHighlights?: CategoryHighlight[];
  editorialSplit?: EditorialSplitData;
  itineraryTeasers?: ItineraryTeaser[];
};

export type BodyBlock = {
  _type: string;
  _key?: string;
  children?: Array<{ _type: string; text: string }>;
  style?: string;
  markDefs?: Array<{ _type: string; href?: string }>;
  asset?: { _ref: string };
};

export type Destination = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: BodyBlock[];
  region?: string;
  bestSeason?: string;
  image?: ImageAsset;
};

export type Guide = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: BodyBlock[];
  category?: "transport" | "budget" | "itinerary" | "seasonal";
  image?: ImageAsset;
};
