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

  return paragraphs.map((text, index) => ({
    _type: "block",
    _key: `block-${index + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `span-${index + 1}`,
        text,
        marks: [],
      },
    ],
  }));
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
  const document = {
    _id: overrides.documentId || `drafts.${documentType}.${slug}`,
    _type: documentType,
    title,
    slug: {
      _type: "slug",
      current: slug,
    },
    summary: draft.summary || "",
    body: normalizeBody(draft.body || ""),
    workflowStatus: overrides.status || draft.workflowStatus || "image_pending",
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
  status: args.status,
  generatedBy: args["generated-by"],
  documentId: args["document-id"],
});

if (args["dry-run"]) {
  console.log(JSON.stringify({ ok: true, mode: "dry-run", document }, null, 2));
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

const result = await client.createOrReplace(document);

console.log(
  JSON.stringify(
    {
      ok: true,
      documentId: result._id,
      documentType: result._type,
      slug: document.slug.current,
      workflowStatus: document.workflowStatus,
    },
    null,
    2
  )
);
