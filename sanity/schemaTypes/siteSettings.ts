const siteSettings = {
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  fields: [
    {
      name: "siteName",
      type: "string",
      title: "Site name",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tagline",
      type: "string",
      title: "Tagline",
    },
    {
      name: "defaultSeo",
      type: "object",
      title: "Default SEO",
      fields: [
        { name: "title", type: "string", title: "SEO title" },
        { name: "description", type: "text", title: "SEO description", rows: 3 },
      ],
    },
    {
      name: "ogImage",
      type: "image",
      title: "Default social image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
      ],
    },
  ],
};

export default siteSettings;
