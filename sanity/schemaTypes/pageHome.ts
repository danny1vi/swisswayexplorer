const pageHome = {
  name: "pageHome",
  type: "document",
  title: "Homepage",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "primaryCta",
      type: "object",
      title: "Primary CTA",
      fields: [
        { name: "label", type: "string", title: "Label", validation: (Rule: any) => Rule.required() },
        { name: "href", type: "string", title: "Href", validation: (Rule: any) => Rule.required() },
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
  ],
};

export default pageHome;
