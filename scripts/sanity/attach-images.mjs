import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
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

function ensureArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blockToText(block) {
  if (!block || block._type !== "block") return "";
  return ensureArray(block.children)
    .map((child) => child?.text || "")
    .join("")
    .trim();
}

function normalizeKeyword(value, fallback = "") {
  return String(value || fallback || "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureKeywordInAltText(alt, keyword, fallback = "") {
  const safeKeyword = normalizeKeyword(keyword);
  const safeAlt = String(alt || fallback || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!safeKeyword) return safeAlt;
  if (!safeAlt) return safeKeyword;
  if (safeAlt.toLowerCase().includes(safeKeyword.toLowerCase())) return safeAlt;
  return `${safeKeyword} - ${safeAlt}`;
}

function findHeadingIndex(body, heading, headingStyle = "h2") {
  const target = normalizeText(heading);
  if (!target) return -1;

  return body.findIndex((block) => {
    if (!block || block._type !== "block") return false;
    if ((block.style || "normal") !== headingStyle) return false;
    return normalizeText(blockToText(block)) === target;
  });
}

function guessExtension(sourceUrl, contentType) {
  const ext = path.extname(new URL(sourceUrl).pathname || "").replace(".", "").toLowerCase();
  if (ext) return ext;

  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  return "jpg";
}

function deriveFilename(sourceUrl, fallbackBase, index, contentType) {
  const parsed = new URL(sourceUrl);
  const base = path.basename(parsed.pathname || "", path.extname(parsed.pathname || "")) || `${fallbackBase}-${index + 1}`;
  const safeBase = slugify(base) || `${fallbackBase}-${index + 1}`;
  const ext = guessExtension(sourceUrl, contentType);
  return `${safeBase}.${ext}`;
}

function guessContentTypeFromPath(filePath) {
  const ext = path.extname(filePath || "").replace(".", "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

function buildImageValue(assetId, image, includeKey = true, keyword = "", fallbackAlt = "") {
  const value = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId,
    },
    alt: ensureKeywordInAltText(image.alt, keyword, fallbackAlt),
    caption: image.caption || "",
  };

  if (includeKey) {
    value._key = image._key || randomUUID().replace(/-/g, "").slice(0, 12);
  }

  return value;
}

async function uploadImage(client, image, index, fallbackBase, options = {}) {
  if (!image?.url && !image?.path) {
    throw new Error(`Image at index ${index} is missing a url or path`);
  }

  let bytes;
  let contentType;
  let filename;

  if (image.path) {
    bytes = await readFile(image.path);
    contentType = guessContentTypeFromPath(image.path);
    filename = image.filename || path.basename(image.path);
  } else {
    const response = await fetch(image.url);
    if (!response.ok) {
      throw new Error(`Failed to download image ${image.url}: HTTP ${response.status}`);
    }

    contentType = response.headers.get("content-type") || "image/jpeg";
    filename = image.filename || deriveFilename(image.url, fallbackBase, index, contentType);
    bytes = Buffer.from(await response.arrayBuffer());
  }

  const asset = await client.assets.upload("image", bytes, {
    filename,
    contentType,
    title: image.title || image.alt || filename,
  });

  return buildImageValue(asset._id, image, image.includeKey ?? true, options.keyword, options.fallbackAlt);
}

const args = parseArgs(process.argv.slice(2));

if (!args.file) {
  console.error("Missing --file path/to/images.json");
  process.exit(1);
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing SANITY_PROJECT_ID.");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const raw = await readFile(args.file, "utf8");
const payload = JSON.parse(raw);
const documentType = payload.documentType;
const documentId = payload.documentId;
const slug = payload.slug ? slugify(payload.slug) : "";

if (!documentId && (!documentType || !slug)) {
  console.error("Provide documentId or both documentType and slug.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

const documentCandidates =
  documentId
    ? await client.fetch(`*[_id == $documentId]{_id, _type, title, body, gallery, slug, sectionImagePlan, imageAltSuggestion, targetKeyword}`, { documentId })
    : await client.fetch(`*[_type == $documentType && slug.current == $slug]{_id, _type, title, body, gallery, slug, sectionImagePlan, imageAltSuggestion, targetKeyword}`, {
        documentType,
        slug,
      });

const document = ensureArray(documentCandidates).sort((left, right) => {
  const leftIsDraft = String(left?._id || "").startsWith("drafts.");
  const rightIsDraft = String(right?._id || "").startsWith("drafts.");
  return Number(rightIsDraft) - Number(leftIsDraft);
})[0];

if (!document?._id) {
  console.error("Target document not found.");
  process.exit(1);
}

const heroImage = payload.heroImage || null;
const galleryImages = ensureArray(payload.gallery);
const bodyImages = ensureArray(payload.bodyImages);

const plan = {
  documentId: document._id,
  documentType: document._type,
  slug: document.slug?.current || slug,
  heroImage: Boolean(heroImage),
  galleryImages: galleryImages.length,
  bodyImages: bodyImages.length,
};
const targetKeyword = normalizeKeyword(document.targetKeyword, document.title);

const preview = {
  heroImage: heroImage
    ? {
        alt: ensureKeywordInAltText(
          heroImage.alt,
          targetKeyword,
          document.imageAltSuggestion || `${targetKeyword || document.title} hero image`
        ),
      }
    : null,
  galleryImages: galleryImages.map((image, index) => ({
    alt: ensureKeywordInAltText(image.alt, targetKeyword, `${targetKeyword || document.title} gallery image ${index + 1}`),
  })),
  bodyImages: bodyImages.map((image, index) => {
    const fallbackPlan = ensureArray(document.sectionImagePlan)[index] || null;
    return {
      insertBeforeHeading: image.insertBeforeHeading || image.heading || fallbackPlan?.heading || "",
      headingStyle: image.headingStyle || fallbackPlan?.headingStyle || "h2",
      alt: ensureKeywordInAltText(
        image.alt,
        targetKeyword,
        fallbackPlan?.alt || `${targetKeyword || document.title} ${fallbackPlan?.heading || `body image ${index + 1}`}`
      ),
    };
  }),
};

if (args["dry-run"]) {
  console.log(JSON.stringify({ ok: true, mode: "dry-run", plan, preview }, null, 2));
  process.exit(0);
}

const fallbackBase = slug || slugify(document.title || document._id);
const nextValues = {};

if (heroImage) {
  const uploadedHero = await uploadImage(client, { ...heroImage, includeKey: false }, 0, `${fallbackBase}-hero`, {
    keyword: targetKeyword,
    fallbackAlt: document.imageAltSuggestion || `${targetKeyword || document.title} hero image`,
  });
  nextValues.image = uploadedHero;
}

if (galleryImages.length > 0) {
  const uploadedGallery = [];
  for (let index = 0; index < galleryImages.length; index += 1) {
    uploadedGallery.push(
      await uploadImage(client, galleryImages[index], index, `${fallbackBase}-gallery`, {
        keyword: targetKeyword,
        fallbackAlt: `${targetKeyword || document.title} gallery image ${index + 1}`,
      })
    );
  }
  nextValues.gallery = [...ensureArray(document.gallery), ...uploadedGallery];
}

if (bodyImages.length > 0) {
  const updatedBody = [...ensureArray(document.body)];
  const sectionImagePlan = ensureArray(document.sectionImagePlan);
  for (let index = 0; index < bodyImages.length; index += 1) {
    const bodyImage = bodyImages[index];
    const fallbackPlan = sectionImagePlan[index] || null;
    const uploadedBodyImage = await uploadImage(client, bodyImage, index, `${fallbackBase}-body`, {
      keyword: targetKeyword,
      fallbackAlt:
        fallbackPlan?.alt ||
        `${targetKeyword || document.title} ${fallbackPlan?.heading || `body image ${index + 1}`}`,
    });
    const insertBeforeHeading = bodyImage.insertBeforeHeading || bodyImage.heading || fallbackPlan?.heading;
    const headingStyle = bodyImage.headingStyle || fallbackPlan?.headingStyle || "h2";

    if (insertBeforeHeading) {
      const headingIndex = findHeadingIndex(updatedBody, insertBeforeHeading, headingStyle);
      if (headingIndex === -1) {
        throw new Error(`Heading not found for body image insertion: "${insertBeforeHeading}" (${headingStyle})`);
      }
      updatedBody.splice(headingIndex, 0, uploadedBodyImage);
      continue;
    }

    updatedBody.push(uploadedBodyImage);
  }
  nextValues.body = updatedBody;
}

if (Object.keys(nextValues).length === 0) {
  console.error("Nothing to upload. Provide heroImage, gallery, or bodyImages.");
  process.exit(1);
}

await client.patch(document._id).set(nextValues).commit();

console.log(
  JSON.stringify(
    {
      ok: true,
      documentId: document._id,
      documentType: document._type,
      slug: document.slug?.current || slug,
      updated: {
        heroImage: Boolean(nextValues.image),
        galleryImages: nextValues.gallery?.length || ensureArray(document.gallery).length,
        bodyItems: nextValues.body?.length || ensureArray(document.body).length,
      },
    },
    null,
    2
  )
);
