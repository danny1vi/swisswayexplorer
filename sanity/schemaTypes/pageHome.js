const pageHome = {
  name: "pageHome",
  type: "document",
  title: "Homepage",
  preview: {
    prepare() {
      return {
        title: "Homepage",
        subtitle: "SwissWayExplorer landing page content",
      };
    },
  },
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      type: "image",
      title: "Hero image",
      description: "Primary homepage visual shown in the hero section and used as the homepage social preview when present.",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    },
    {
      name: "seoTitle",
      type: "string",
      title: "Homepage SEO title",
      description: "Optional override for the browser title and social title on the homepage.",
    },
    {
      name: "seoDescription",
      type: "text",
      title: "Homepage SEO description",
      rows: 3,
      description: "Optional override for meta description and social description on the homepage.",
    },
    {
      name: "primaryCta",
      type: "object",
      title: "Primary CTA",
      fields: [
        { name: "label", type: "string", title: "Label", validation: (Rule) => Rule.required() },
        { name: "href", type: "string", title: "Href", validation: (Rule) => Rule.required() },
      ],
    },
    {
      name: "secondaryCta",
      type: "object",
      title: "Secondary CTA",
      fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "href", type: "string", title: "Href" },
      ],
    },
    {
      name: "categoryHighlights",
      type: "array",
      title: "Category highlights",
      description: "Three quick-entry cards shown below the hero to route visitors into the right planning path.",
      of: [
        {
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: "href",
              type: "string",
              title: "Link",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    },
    {
      name: "editorialSplit",
      type: "object",
      title: "Editorial split feature",
      description: "Featured story block with split image/text layout.",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Summary",
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "body",
          type: "text",
          title: "Supporting copy",
          rows: 5,
        },
        {
          name: "image",
          type: "image",
          title: "Feature image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        },
        {
          name: "imageSide",
          type: "string",
          title: "Image side",
          initialValue: "left",
          options: {
            list: [
              { title: "Left", value: "left" },
              { title: "Right", value: "right" },
            ],
            layout: "radio",
          },
        },
        {
          name: "cta",
          type: "object",
          title: "CTA",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "string", title: "Href" },
          ],
        },
      ],
    },
    {
      name: "itineraryTeasers",
      type: "array",
      title: "Itinerary teasers",
      description: "Short editorial cards for quick planning formats shown near the bottom of the homepage.",
      of: [
        {
          type: "object",
          fields: [
            { name: "duration", type: "string", title: "Duration label" },
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: "href",
              type: "string",
              title: "Link",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "duration",
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    },
  ],
};

export default pageHome;
