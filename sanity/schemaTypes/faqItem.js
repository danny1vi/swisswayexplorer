const faqItem = {
  name: "faqItem",
  type: "object",
  title: "FAQ Item",
  fields: [
    {
      name: "question",
      type: "string",
      title: "Question",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      type: "text",
      title: "Answer",
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
};

export default faqItem;
