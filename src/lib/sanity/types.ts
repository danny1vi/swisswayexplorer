export type GenericSeo = {
  title?: string;
  description?: string;
};

export type GenericCta = {
  label: string;
  href: string;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string;
  defaultSeo?: GenericSeo;
  ogImage?: { url: string; alt?: string };
};

export type PageHomeData = {
  heading: string;
  description: string;
  primaryCta: GenericCta;
  secondaryCta?: GenericCta;
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
  image?: { url: string; alt?: string };
};

export type Guide = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: BodyBlock[];
  category?: "transport" | "budget" | "itinerary" | "seasonal";
  image?: { url: string; alt?: string };
};
