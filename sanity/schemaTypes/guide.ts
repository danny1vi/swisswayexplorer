const guide = {
  name: "guide",
  type: "document",
  title: "Guide",
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
      description: "Full editorial content for this guide",
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
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: ["transport", "budget", "itinerary", "seasonal"],
      },
      description: "Generic classification for listing and filtering",
    },
  ],
};

export default guide;
