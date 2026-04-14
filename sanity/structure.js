const EDITORIAL_TYPES = ["guide", "destination"];

function editorialList(S, title, status) {
  return S.listItem()
    .title(title)
    .child(
      S.documentList()
        .title(title)
        .filter('_type in $types && workflowStatus == $status')
        .params({ types: EDITORIAL_TYPES, status })
        .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
    );
}

export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .child(S.document().schemaType("pageHome").documentId("pageHome")),
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      editorialList(S, "Image Pending", "image_pending"),
      editorialList(S, "Review Ready", "review_ready"),
      editorialList(S, "Published Queue", "published"),
      S.divider(),
      S.listItem().title("Guides").child(S.documentTypeList("guide").title("Guides")),
      S.listItem().title("Destinations").child(S.documentTypeList("destination").title("Destinations")),
    ]);
