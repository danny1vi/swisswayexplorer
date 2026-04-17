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
*[_type == "pageHome" && _id == "pageHome"][0]{
  heading,
  description,
  "image": image{
    "url": asset->url,
    alt
  },
  seoTitle,
  seoDescription,
  heroVideoUrl,
  "heroVideoPoster": heroVideoPoster{
    "url": asset->url,
    alt
  },
  primaryCta{
    label,
    href
  },
  secondaryCta{
    label,
    href
  },
  categoryHighlights[]{
    eyebrow,
    title,
    description,
    href
  },
  storyRail[]{
    eyebrow,
    title,
    summary,
    href,
    "image": image{
      "url": asset->url,
      alt
    }
  },
  editorialSplit{
    eyebrow,
    title,
    description,
    body,
    "image": image{
      "url": asset->url,
      alt
    },
    imageSide,
    cta{
      label,
      href
    }
  },
  itineraryTeasers[]{
    duration,
    title,
    description,
    href,
    "image": image{
      "url": asset->url,
      alt
    }
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
    ...,
    _type == "block" => {
      _type,
      _key,
      children[]{
        _type,
        text,
        marks
      },
      style,
      markDefs[]{
        _key,
        _type,
        href
      }
    },
    _type == "image" => {
      _type,
      _key,
      alt,
      caption,
      "url": asset->url
    }
  },
  region,
  bestSeason,
  "image": image{
    "url": asset->url,
    alt,
    caption
  },
  "gallery": gallery[]{
    _key,
    alt,
    caption,
    "url": asset->url
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
    ...,
    _type == "block" => {
      _type,
      _key,
      children[]{
        _type,
        text,
        marks
      },
      style,
      markDefs[]{
        _key,
        _type,
        href
      }
    },
    _type == "image" => {
      _type,
      _key,
      alt,
      caption,
      "url": asset->url
    }
  },
  category,
  "image": image{
    "url": asset->url,
    alt,
    caption
  },
  "gallery": gallery[]{
    _key,
    alt,
    caption,
    "url": asset->url
  }
}
`;
