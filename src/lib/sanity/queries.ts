export const SITE_SETTINGS_QUERY = `
*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  defaultSeo{
    title,
    description
  },
  ogImage{
    "url": asset->url,
    alt
  }
}
`;

export const HOME_PAGE_QUERY = `
*[_type == "pageHome"][0]{
  heading,
  description,
  primaryCta{
    label,
    href
  },
  secondaryCta{
    label,
    href
  }
}
`;

export const DESTINATIONS_QUERY = `
*[_type == "destination"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  summary,
  region,
  bestSeason,
  "image": image{
    "url": asset->url,
    alt
  }
}
`;

export const DESTINATION_BY_SLUG_QUERY = `
*[_type == "destination" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  "body": body[]{
    _type,
    _key,
    children[]{
      _type,
      text
    },
    style,
    markDefs[]{
      _type,
      href
    },
    asset->{
      "url": asset->url
    }
  },
  region,
  bestSeason,
  "image": image{
    "url": asset->url,
    alt
  }
}
`;

export const GUIDES_QUERY = `
*[_type == "guide"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  summary,
  category,
  "image": image{
    "url": asset->url,
    alt
  }
}
`;

export const GUIDE_BY_SLUG_QUERY = `
*[_type == "guide" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  "body": body[]{
    _type,
    _key,
    children[]{
      _type,
      text
    },
    style,
    markDefs[]{
      _type,
      href
    },
    asset->{
      "url": asset->url
    }
  },
  category,
  "image": image{
    "url": asset->url,
    alt
  }
}
`;
