const destination = {
  name: "destination",
  type: "document",
  title: "Destination",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "summary",
      type: "text",
      title: "Summary",
      rows: 3,
    },
    {
      name: "body",
      type: "array",
      title: "Body",
      of: [{ type: "block" }],
      description: "Full editorial content for this destination",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
      ],
    },
    {
      name: "region",
      type: "string",
      title: "Region",
      description: "Project-specific: Swiss region label",
    },
    {
      name: "bestSeason",
      type: "string",
      title: "Best season",
      description: "Project-specific: e.g. spring, summer, winter",
    },
  ],
};

export default destination;
