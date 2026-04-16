import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function createKey(prefix = "block") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeHeadingText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function createPortableTextBlock(text, index) {
  return {
    _type: "block",
    _key: createKey(`block${index ? `-${index}` : ""}`),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: createKey(`span${index ? `-${index}` : ""}`),
        text,
        marks: [],
      },
    ],
  };
}

function normalizeBody(body) {
  if (Array.isArray(body) && body.every((block) => block && typeof block === "object" && block._type)) {
    return body;
  }

  const paragraphs = Array.isArray(body)
    ? body.map((item) => String(item || "").trim()).filter(Boolean)
    : String(body || "")
        .split(/\n\s*\n/g)
        .map((item) => item.trim())
        .filter(Boolean);

  return paragraphs.map((text, index) => createPortableTextBlock(text, index + 1));
}

function extractBlockText(block) {
  if (!block || block._type !== "block") return "";
  return (block.children || [])
    .filter((child) => child && child._type === "span")
    .map((child) => child.text || "")
    .join("")
    .trim();
}

function normalizeQuickVerdict(input, draft, documentType) {
  if (input && typeof input === "object" && input._type === "quickVerdict") {
    return {
      _type: "quickVerdict",
      _key: input._key || createKey("quick-verdict"),
      eyebrow: input.eyebrow || (documentType === "guide" ? "Quick verdict" : "At a glance"),
      title: String(input.title || "").trim(),
      body: String(input.body || "").trim(),
    };
  }

  if (input && typeof input === "object") {
    const title = String(input.title || "").trim();
    const body = String(input.body || "").trim();
    if (!title || !body) return null;

    return {
      _type: "quickVerdict",
      _key: createKey("quick-verdict"),
      eyebrow: input.eyebrow || (documentType === "guide" ? "Quick verdict" : "At a glance"),
      title,
      body,
    };
  }

  if (typeof input === "string" && input.trim()) {
    return {
      _type: "quickVerdict",
      _key: createKey("quick-verdict"),
      eyebrow: documentType === "guide" ? "Quick verdict" : "At a glance",
      title: documentType === "guide" ? "Who this is best for" : "Worth choosing if",
      body: input.trim(),
    };
  }

  const fallbackBody = String(draft.summary || "").trim();
  if (!fallbackBody) return null;

  return {
    _type: "quickVerdict",
    _key: createKey("quick-verdict"),
    eyebrow: documentType === "guide" ? "Quick verdict" : "At a glance",
    title: documentType === "guide" ? "What to know first" : "Should you base yourself here?",
    body: fallbackBody,
  };
}

function normalizeHighlightBoxes(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const body = String(item.body || "").trim();
      if (!body) return null;

      return {
        _type: "highlightBox",
        _key: item._key || createKey("highlight-box"),
        tone: item.tone || "tip",
        title: item.title ? String(item.title).trim() : "",
        body,
        insertBeforeHeading: item.insertBeforeHeading ? String(item.insertBeforeHeading).trim() : "",
        headingStyle: item.headingStyle ? String(item.headingStyle).trim().toLowerCase() : "h2",
      };
    })
    .filter(Boolean);
}

function insertQuickVerdict(body, block) {
  if (!block) return body;
  if (body.some((item) => item?._type === "quickVerdict")) return body;

  const next = [...body];
  const firstParagraphIndex = next.findIndex(
    (item) => item?._type === "block" && (item.style || "normal") === "normal"
  );

  if (firstParagraphIndex >= 0) {
    next.splice(firstParagraphIndex + 1, 0, block);
    return next;
  }

  next.unshift(block);
  return next;
}

function insertHighlightBoxes(body, items) {
  const next = [...body];

  for (const item of items) {
    const block = {
      _type: "highlightBox",
      _key: item._key || createKey("highlight-box"),
      tone: item.tone || "tip",
      title: item.title || "",
      body: item.body,
    };

    if (!item.insertBeforeHeading) {
      next.push(block);
      continue;
    }

    const targetHeading = normalizeHeadingText(item.insertBeforeHeading);
    const headingStyle = item.headingStyle || "h2";
    const targetIndex = next.findIndex(
      (entry) =>
        entry?._type === "block" &&
        (entry.style || "normal") === headingStyle &&
        normalizeHeadingText(extractBlockText(entry)) === targetHeading
    );

    if (targetIndex === -1) {
      next.push(block);
      continue;
    }

    next.splice(targetIndex, 0, block);
  }

  return next;
}

function enhanceBody({ body, draft, documentType }) {
  const quickVerdict = normalizeQuickVerdict(draft.quickVerdict, draft, documentType);
  const highlightBoxes = normalizeHighlightBoxes(draft.highlightBoxes);

  let next = insertQuickVerdict(body, quickVerdict);
  next = insertHighlightBoxes(next, highlightBoxes);
  return next;
}

function resolveMode(args) {
  const requestedMode = String(args.mode || "").trim().toLowerCase();
  if (args.publish || requestedMode === "publish" || requestedMode === "live") {
    return "publish";
  }
  return "draft";
}

function buildDocumentId(documentType, slug, mode, overrideId) {
  if (overrideId) return overrideId;
  if (mode === "publish") return `${documentType}.${slug}`;
  return `drafts.${documentType}.${slug}`;
}

function buildLiveUrl(documentType, slug) {
  const siteUrl = String(process.env.SITE_URL || "https://swisswayexplorer.com").replace(/\/+$/, "");

  if (documentType === "guide") {
    return `${siteUrl}/guides/${slug}/`;
  }

  return `${siteUrl}/destinations/${slug}/`;
}

function pickDraftShape(input) {
  if (input?.sanityMapping?.fields) {
    return {
      documentType: input.sanityMapping.documentType || input.meta?.contentType,
      title: input.sanityMapping.fields.title,
      slug: input.sanityMapping.fields.slug,
      summary: input.sanityMapping.fields.summary,
      body: input.sanityMapping.fields.body,
      category: input.sanityMapping.fields.category,
      region: input.sanityMapping.fields.region,
      bestSeason: input.sanityMapping.fields.bestSeason,
      imageAltSuggestion: input.sanityMapping.fields.imageAlt || input.contentPlan?.imageBrief,
      quickVerdict: input.sanityMapping.fields.quickVerdict || input.contentPlan?.quickVerdict,
      highlightBoxes: input.sanityMapping.fields.highlightBoxes || input.contentPlan?.highlightBoxes,
      generatedBy: input.meta?.generatedBy || input.meta?.sourceModel,
    };
  }

  return input;
}

function buildDocument(input, overrides = {}) {
  const draft = pickDraftShape(input);
  const documentType = draft.documentType || draft._type;
  if (!["guide", "destination"].includes(documentType)) {
    throw new Error("documentType must be 'guide' or 'destination'");
  }

  const title = draft.title?.trim();
  if (!title) throw new Error("title is required");

  const slug = slugify(draft.slug?.current || draft.slug || title);
  if (!slug) throw new Error("slug could not be derived");

  const now = new Date().toISOString();
  const mode = overrides.mode || "draft";
  const baseBody = normalizeBody(draft.body || "");
  const document = {
    _id: buildDocumentId(documentType, slug, mode, overrides.documentId),
    _type: documentType,
    title,
    slug: {
      _type: "slug",
      current: slug,
    },
    summary: draft.summary || "",
    body: enhanceBody({ body: baseBody, draft, documentType }),
    workflowStatus:
      overrides.status || draft.workflowStatus || (mode === "publish" ? "published" : "image_pending"),
    generatedBy: overrides.generatedBy || draft.generatedBy || "ai-editorial-pipeline",
    generatedAt: draft.generatedAt || now,
    imageAltSuggestion: draft.imageAltSuggestion || draft.imageAlt || "",
  };

  if (documentType === "guide") {
    document.category = draft.category || "";
  }

  if (documentType === "destination") {
    document.region = draft.region || "";
    document.bestSeason = draft.bestSeason || "";
  }

  return document;
}

const args = parseArgs(process.argv.slice(2));
const file = args.file;
const mode = resolveMode(args);

if (!file) {
  console.error("Missing --file path/to/draft.json");
  process.exit(1);
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

const raw = await readFile(file, "utf8");
const input = JSON.parse(raw);
const document = buildDocument(input, {
  mode,
  status: args.status,
  generatedBy: args["generated-by"],
  documentId: args["document-id"],
});
const liveUrl = buildLiveUrl(document._type, document.slug.current);

if (args["dry-run"]) {
  console.log(JSON.stringify({ ok: true, mode: `dry-run:${mode}`, document, liveUrl }, null, 2));
  process.exit(0);
}

if (!projectId) {
  console.error("Missing SANITY_PROJECT_ID.");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

let result;

if (mode === "publish") {
  const draftId = `drafts.${document._type}.${document.slug.current}`;
  const transaction = client.transaction().createOrReplace(document);

  if (draftId !== document._id) {
    transaction.delete(draftId);
  }

  result = await transaction.commit();
} else {
  result = await client.createOrReplace(document);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      mode,
      documentId: result._id,
      documentType: result._type,
      slug: document.slug.current,
      workflowStatus: document.workflowStatus,
      liveUrl,
    },
    null,
    2
  )
);
