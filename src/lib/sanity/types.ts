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
  caption?: string;
  _key?: string;
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

export type StoryRailItem = {
  eyebrow?: string;
  title: string;
  summary: string;
  href: string;
  image?: ImageAsset;
};

export type HomepageLinkedPhoto = {
  eyebrow?: string;
  title: string;
  summary?: string;
  href: string;
  image?: ImageAsset;
};

export type PhotoGalleryData = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: HomepageLinkedPhoto[];
};

export type EditorialSplitData = {
  eyebrow?: string;
  title: string;
  description: string;
  body?: string;
  cta?: GenericCta;
  image?: ImageAsset;
  imageSide?: "left" | "right";
  relatedStories?: Array<{
    eyebrow?: string;
    title: string;
    summary: string;
    href: string;
    image?: ImageAsset;
  }>;
};

export type ItineraryTeaser = {
  duration?: string;
  title: string;
  description: string;
  href: string;
  image?: ImageAsset;
};

export type PageHomeData = {
  heading: string;
  description: string;
  image?: ImageAsset;
  seoTitle?: string;
  seoDescription?: string;
  primaryCta: GenericCta;
  secondaryCta?: GenericCta;
  heroVideoUrl?: string;
  heroYoutubeUrl?: string;
  heroVideoPoster?: ImageAsset;
  storyRail?: StoryRailItem[];
  photoGallery?: PhotoGalleryData;
  categoryHighlights?: CategoryHighlight[];
  editorialSplit?: EditorialSplitData;
  featuredStories?: HomepageLinkedPhoto[];
  itineraryTeasers?: ItineraryTeaser[];
};

export type TextSpan = {
  _type: string;
  text: string;
  marks?: string[];
};

export type BodyTextBlock = {
  _type: "block";
  _key?: string;
  children?: TextSpan[];
  style?: string;
  markDefs?: Array<{ _type: string; href?: string }>;
};

export type BodyImageBlock = ImageAsset & {
  _type: "image";
};

export type QuickVerdictBlock = {
  _type: "quickVerdict";
  _key?: string;
  eyebrow?: string;
  title: string;
  body: string;
};

export type HighlightBoxBlock = {
  _type: "highlightBox";
  _key?: string;
  tone?: "tip" | "important" | "budget" | "route";
  title?: string;
  body: string;
};

export type BodyBlock = BodyTextBlock | BodyImageBlock | QuickVerdictBlock | HighlightBoxBlock;

export type Destination = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: BodyBlock[];
  region?: string;
  bestSeason?: string;
  image?: ImageAsset;
  gallery?: ImageAsset[];
};

export type Guide = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: BodyBlock[];
  category?: "transport" | "budget" | "itinerary" | "seasonal";
  image?: ImageAsset;
  gallery?: ImageAsset[];
};
