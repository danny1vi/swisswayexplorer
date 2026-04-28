const guide = {
  name: "guide",
  type: "document",
  title: "Guide",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
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
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Paragraph - Justified", value: "bodyJustify" },
            { title: "Paragraph - Left", value: "bodyLeft" },
            { title: "Paragraph - Center", value: "bodyCenter" },
            { title: "Paragraph - Right", value: "bodyRight" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        {
          type: "object",
          name: "quickVerdict",
          title: "Quick Verdict",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            { name: "title", type: "string", title: "Title", validation: (Rule) => Rule.required() },
            { name: "body", type: "text", title: "Body", rows: 4, validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
            },
          },
        },
        {
          type: "object",
          name: "highlightBox",
          title: "Highlight Box",
          fields: [
            {
              name: "tone",
              type: "string",
              title: "Tone",
              initialValue: "tip",
              options: {
                list: [
                  { title: "Tip", value: "tip" },
                  { title: "Pro Tip", value: "proTip" },
                  { title: "Important", value: "important" },
                  { title: "Budget Note", value: "budget" },
                  { title: "Route Note", value: "route" },
                  { title: "Warning", value: "warning" },
                ],
                layout: "radio",
              },
            },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Body", rows: 4, validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "tone",
              body: "body",
            },
            prepare({ title, subtitle, body }) {
              return {
                title: title || "Highlight Box",
                subtitle: subtitle || body,
              };
            },
          },
        },
        {
          type: "object",
          name: "infoTable",
          title: "Info Table",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            { name: "title", type: "string", title: "Title" },
            {
              name: "columns",
              type: "array",
              title: "Columns",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(2),
            },
            {
              name: "rows",
              type: "array",
              title: "Rows",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  title: "Table Row",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      title: "Cells",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(2),
                    },
                  ],
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            },
            { name: "caption", type: "string", title: "Caption" },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "caption",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Info Table",
                subtitle: subtitle || "Structured comparison table",
              };
            },
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
      description: "Full editorial content for this guide",
    },
    {
      name: "faq",
      type: "array",
      title: "Frequently Asked Questions",
      description: "SEO-friendly FAQ section — FAQ schema markup için kullanılır",
      of: [{ type: "faqItem" }],
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
      ],
    },
    {
      name: "gallery",
      type: "array",
      title: "Gallery",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
      description: "Optional secondary images for this guide.",
    },
    {
      name: "sectionImagePlan",
      type: "array",
      title: "Section image plan",
      description:
        "Planned inline images for the article body. Keep at least 5 entries and match each one to a real H2 so automation can place the generated image directly above that section.",
      of: [
        {
          type: "object",
          name: "sectionImageBrief",
          title: "Section image brief",
          fields: [
            {
              name: "heading",
              type: "string",
              title: "Target heading",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "headingStyle",
              type: "string",
              title: "Heading style",
              initialValue: "h2",
              options: {
                list: [
                  { title: "H2", value: "h2" },
                  { title: "H3", value: "h3" },
                ],
                layout: "radio",
              },
            },
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "prompt",
              type: "text",
              title: "Image prompt",
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "alt",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Section image",
                subtitle: subtitle || "Inline image brief",
              };
            },
          },
        },
      ],
    },
    {
      name: "workflowStatus",
      type: "string",
      title: "Workflow status",
      initialValue: "image_pending",
      options: {
        list: [
          { title: "Image Pending", value: "image_pending" },
          { title: "Review Ready", value: "review_ready" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      description: "Editorial workflow state for AI-generated or manually drafted content.",
    },
    {
      name: "generatedBy",
      type: "string",
      title: "Generated by",
      description: "Optional note for the model or workflow that created the draft.",
    },
    {
      name: "generatedAt",
      type: "datetime",
      title: "Generated at",
      description: "When this draft was generated by the editorial pipeline.",
    },
    {
      name: "imageAltSuggestion",
      type: "string",
      title: "Image alt suggestion",
      description: "Suggested alt text to copy into the image field after uploading the final visual.",
    },
    {
      name: "targetKeyword",
      type: "string",
      title: "Target keyword",
      description: "Primary Google search phrase this article is targeting. Image alt text should naturally include it.",
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
