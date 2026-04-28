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

function createPortableTextBlock(text, index, style = "normal") {
  return {
    _type: "block",
    _key: createKey(`block${index ? `-${index}` : ""}`),
    style,
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

function createInfoTableBlock(input, index) {
  const columns = Array.isArray(input.columns)
    ? input.columns.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const rows = Array.isArray(input.rows)
    ? input.rows
        .map((row, rowIndex) => {
          const cells = Array.isArray(row)
            ? row
            : Array.isArray(row?.cells)
              ? row.cells
              : [];
          const normalized = cells.map((item) => String(item || "").trim());
          if (normalized.length !== columns.length || normalized.every((cell) => !cell)) return null;
          return {
            _type: "tableRow",
            _key: row?._key || createKey(`table-row-${index}-${rowIndex + 1}`),
            cells: normalized,
          };
        })
        .filter(Boolean)
    : [];

  if (columns.length < 2 || rows.length === 0) return null;

  return {
    _type: "infoTable",
    _key: input._key || createKey(`info-table-${index}`),
    eyebrow: input.eyebrow ? String(input.eyebrow).trim() : "",
    title: input.title ? String(input.title).trim() : "",
    columns,
    rows,
    caption: input.caption ? String(input.caption).trim() : "",
  };
}

function parseMarkdownTableChunk(chunk, index) {
  const lines = String(chunk || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 3 || !lines.every((line) => line.includes("|"))) return null;

  const separator = lines[1].replace(/\|/g, "").trim();
  if (!/^:?-{3,}:?(?:\s+:?-{3,}:?)*$/.test(separator.replace(/\s+/g, " "))) {
    return null;
  }

  const splitRow = (line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell, cellIndex, source) => !(cell === "" && (cellIndex === 0 || cellIndex === source.length - 1)));

  const columns = splitRow(lines[0]);
  const rows = lines.slice(2).map((line) => splitRow(line));
  return createInfoTableBlock({ columns, rows }, index);
}

function parseFaqSection(sectionText) {
  const lines = String(sectionText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items = [];
  let currentQuestion = "";
  let answerLines = [];

  const flush = () => {
    const question = currentQuestion.trim();
    const answer = answerLines.join("\n").trim();
    if (question && answer) {
      items.push({
        _type: "faqItem",
        _key: createKey("faq"),
        question,
        answer,
      });
    }
    currentQuestion = "";
    answerLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-*]\s*/, "").trim();
    const explicitQuestion = line.match(/^Q[:\-]\s*(.+)$/i);
    const explicitAnswer = line.match(/^A[:\-]\s*(.+)$/i);
    const question = explicitQuestion ? explicitQuestion[1].trim() : line;

    if (explicitQuestion || /\?$/.test(question)) {
      flush();
      currentQuestion = question;
      continue;
    }

    if (explicitAnswer) {
      answerLines.push(explicitAnswer[1].trim());
      continue;
    }

    if (currentQuestion) {
      answerLines.push(line);
    }
  }

  flush();
  return items;
}

function extractFaqFromBody(text) {
  let nextText = String(text || "");
  const faqItems = [];

  nextText = nextText.replace(/\[\s*\/\/\s*faq\s*\n([\s\S]*?)\n\]/gi, (_, section) => {
    faqItems.push(...parseFaqSection(section));
    return "";
  });

  if (faqItems.length > 0) {
    return { bodyText: nextText.trim(), faqItems };
  }

  const headingMatch = nextText.match(
    /(?:^|\n)(?:##+|#)?\s*(frequently asked questions|faq|sık sorulan sorular)\s*\n([\s\S]*)$/i
  );

  if (!headingMatch || typeof headingMatch.index !== "number") {
    return { bodyText: nextText.trim(), faqItems };
  }

  faqItems.push(...parseFaqSection(headingMatch[2]));
  return {
    bodyText: nextText.slice(0, headingMatch.index).trim(),
    faqItems,
  };
}

function normalizeBody(body) {
  if (Array.isArray(body) && body.every((block) => block && typeof block === "object" && block._type)) {
    return { blocks: body, faqItems: [] };
  }

  const rawBody = Array.isArray(body) ? body.map((item) => String(item || "")).join("\n\n") : String(body || "");
  const { bodyText, faqItems } = extractFaqFromBody(rawBody);
  const chunks = bodyText
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  const blocks = chunks.map((text, index) => {
    const h2Match = text.match(/^##\s+(.+)$/);
    if (h2Match) return createPortableTextBlock(h2Match[1].trim(), index + 1, "h2");

    const h3Match = text.match(/^###\s+(.+)$/);
    if (h3Match) return createPortableTextBlock(h3Match[1].trim(), index + 1, "h3");

    const quoteMatch = text.match(/^>\s+([\s\S]+)$/);
    if (quoteMatch) return createPortableTextBlock(quoteMatch[1].replace(/\n>\s*/g, "\n").trim(), index + 1, "blockquote");

    const tableBlock = parseMarkdownTableChunk(text, index + 1);
    if (tableBlock) return tableBlock;

    return createPortableTextBlock(text, index + 1);
  });

  return {
    blocks: blocks.filter(Boolean),
    faqItems,
  };
}

function extractBlockText(block) {
  if (!block || block._type !== "block") return "";
  return (block.children || [])
    .filter((child) => child && child._type === "span")
    .map((child) => child.text || "")
    .join("")
    .trim();
}

function getHeadingBlocks(body, style = "h2") {
  return body.filter((entry) => entry?._type === "block" && (entry.style || "normal") === style);
}

function normalizeKeyword(value, fallback = "") {
  const keyword = String(value || fallback || "")
    .replace(/\s+/g, " ")
    .trim();
  return keyword;
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

function createSectionImagePrompt({ title, summary, heading }) {
  const baseTitle = String(title || "").trim();
  const baseSummary = String(summary || "").trim();
  const baseHeading = String(heading || "").trim();
  const context = [baseTitle, baseHeading].filter(Boolean).join(" - ");
  const promptParts = [
    context || "Swiss travel editorial image",
    "editorial travel photography",
    "Switzerland",
    "landscape orientation",
    "realistic detail",
  ];

  if (baseSummary) {
    promptParts.splice(1, 0, baseSummary);
  }

  return promptParts.join(", ");
}

function normalizeSectionImagePlan(items = [], body = [], draft = {}) {
  const headingBlocks = getHeadingBlocks(body, "h2");
  const orderedHeadings = headingBlocks.map((block) => extractBlockText(block)).filter(Boolean);
  const normalized = [];
  const seenHeadings = new Set();
  const keyword = normalizeKeyword(draft.targetKeyword, draft.title);

  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== "object") continue;

    const heading = String(item.insertBeforeHeading || item.heading || "").trim();
    if (!heading) continue;

    const normalizedHeading = normalizeHeadingText(heading);
    if (!normalizedHeading || seenHeadings.has(normalizedHeading)) continue;

    normalized.push({
      _key: item._key || createKey("section-image-plan"),
      heading,
      headingStyle: item.headingStyle ? String(item.headingStyle).trim().toLowerCase() : "h2",
      alt: ensureKeywordInAltText(item.alt, keyword, `${draft.title || "SwissWayExplorer"} - ${heading}`),
      caption: String(item.caption || heading).trim(),
      prompt: String(
        item.prompt || createSectionImagePrompt({ title: draft.title, summary: draft.summary, heading })
      ).trim(),
    });
    seenHeadings.add(normalizedHeading);
  }

  const requiredHeadings = orderedHeadings.slice(0, 5);
  for (const heading of requiredHeadings) {
    const normalizedHeading = normalizeHeadingText(heading);
    if (seenHeadings.has(normalizedHeading)) continue;

    normalized.push({
      _key: createKey("section-image-plan"),
      heading,
      headingStyle: "h2",
      alt: ensureKeywordInAltText("", keyword, `${draft.title || "SwissWayExplorer"} - ${heading}`),
      caption: heading,
      prompt: createSectionImagePrompt({ title: draft.title, summary: draft.summary, heading }),
    });
    seenHeadings.add(normalizedHeading);
  }

  return normalized;
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

function normalizeHighlightTone(value) {
  const normalized = String(value || "tip")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (["protip", "expertip"].includes(normalized)) return "proTip";
  if (["important", "warning", "caution"].includes(normalized)) return normalized === "important" ? "important" : "warning";
  if (["budget", "route", "tip"].includes(normalized)) return normalized;
  return "tip";
}

function normalizeHighlightBoxes(items = [], proTips = []) {
  const combinedItems = [
    ...(Array.isArray(items) ? items : []),
    ...(Array.isArray(proTips)
      ? proTips.map((item) =>
          typeof item === "string"
            ? { tone: "proTip", body: item }
            : { ...item, tone: item?.tone || "proTip" }
        )
      : []),
  ];

  if (combinedItems.length === 0) return [];

  return combinedItems
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const body = String(item.body || "").trim();
      if (!body) return null;

      return {
        _type: "highlightBox",
        _key: item._key || createKey("highlight-box"),
        tone: normalizeHighlightTone(item.tone),
        title: item.title ? String(item.title).trim() : "",
        body,
        insertBeforeHeading: item.insertBeforeHeading ? String(item.insertBeforeHeading).trim() : "",
        headingStyle: item.headingStyle ? String(item.headingStyle).trim().toLowerCase() : "h2",
      };
    })
    .filter(Boolean);
}

function normalizeFaq(input, fallbackFaq = []) {
  const source = Array.isArray(input) ? input : Array.isArray(fallbackFaq) ? fallbackFaq : [];

  return source
    .map((item) => {
      if (!item) return null;

      if (typeof item === "string") {
        const [questionPart, ...answerParts] = item.split(/\?\s+/);
        const question = questionPart?.trim();
        const answer = answerParts.join("? ").trim();
        if (!question || !answer) return null;
        return {
          _type: "faqItem",
          _key: createKey("faq"),
          question: `${question}?`,
          answer,
        };
      }

      if (typeof item !== "object") return null;

      const question = String(item.question || "").trim();
      const answer = String(item.answer || "").trim();
      if (!question || !answer) return null;

      return {
        _type: "faqItem",
        _key: item._key || createKey("faq"),
        question,
        answer,
      };
    })
    .filter(Boolean);
}

function normalizeInfoTables(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const table = createInfoTableBlock(item, index + 1);
      if (!table) return null;
      return {
        ...table,
        insertBeforeHeading: item.insertBeforeHeading ? String(item.insertBeforeHeading).trim() : "",
        headingStyle: item.headingStyle ? String(item.headingStyle).trim().toLowerCase() : "h2",
      };
    })
    .filter(Boolean);
}

function defaultHighlightBoxes({ draft, documentType, title, body }) {
  const headings = body.filter((entry) => entry?._type === "block" && (entry.style || "normal") === "h2");
  const firstHeading = extractBlockText(headings[0]);
  const secondHeading = extractBlockText(headings[1]);
  const summary = String(draft.summary || "").trim();

  const firstBox = {
    _type: "highlightBox",
    _key: createKey("highlight-box"),
    tone: documentType === "guide" ? "important" : "route",
    title: documentType === "guide" ? "What this page helps you decide" : "How to use this destination page",
    body:
      summary ||
      (documentType === "guide"
        ? `Use this guide to compare the options in a practical way before you lock in your route, pace, and budget.`
        : `Use this page to decide whether ${title} fits the pace, routing, and style of trip you want in Switzerland.`),
    insertBeforeHeading: firstHeading,
    headingStyle: "h2",
  };

  const secondBox = {
    _type: "highlightBox",
    _key: createKey("highlight-box"),
    tone: documentType === "guide" ? "tip" : "budget",
    title: documentType === "guide" ? "Best way to read this guide" : "Planning note",
    body:
      documentType === "guide"
        ? `Focus on the route, cost, and tradeoff sections before making a final choice, especially if this is your first Switzerland trip.`
        : `Check this page against your route length, travel season, and onward stops so the destination fits naturally into the rest of your trip.`,
    insertBeforeHeading: secondHeading,
    headingStyle: "h2",
  };

  return [firstBox, secondBox];
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

function insertInfoTables(body, items) {
  const next = [...body];

  for (const item of items) {
    const block = {
      _type: "infoTable",
      _key: item._key || createKey("info-table"),
      eyebrow: item.eyebrow || "",
      title: item.title || "",
      columns: item.columns || [],
      rows: item.rows || [],
      caption: item.caption || "",
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
  const highlightBoxes = normalizeHighlightBoxes(draft.highlightBoxes, draft.proTips);
  const infoTables = normalizeInfoTables(draft.tables || draft.infoTables);
  const ensuredHighlightBoxes =
    highlightBoxes.length >= 2
      ? highlightBoxes
      : [...highlightBoxes, ...defaultHighlightBoxes({ draft, documentType, title: draft.title, body })].slice(0, 2);

  let next = insertQuickVerdict(body, quickVerdict);
  next = insertHighlightBoxes(next, ensuredHighlightBoxes);
  next = insertInfoTables(next, infoTables);
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
      proTips: input.sanityMapping.fields.proTips || input.contentPlan?.proTips,
      faq: input.sanityMapping.fields.faq || input.contentPlan?.faq,
      tables: input.sanityMapping.fields.tables || input.contentPlan?.tables,
      bodyImages: input.sanityMapping.fields.bodyImages || input.contentPlan?.bodyImages,
      sectionImagePlan: input.sanityMapping.fields.sectionImagePlan || input.contentPlan?.sectionImagePlan,
      targetKeyword:
        input.sanityMapping.fields.targetKeyword ||
        input.contentPlan?.targetKeyword ||
        input.seo?.targetKeyword ||
        input.meta?.targetKeyword,
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
  const { blocks: baseBody, faqItems: faqFromBody } = normalizeBody(draft.body || "");
  const faq = normalizeFaq(draft.faq || draft.faqItems, faqFromBody);
  const targetKeyword = normalizeKeyword(draft.targetKeyword, title);
  const sectionImagePlan = normalizeSectionImagePlan(
    draft.sectionImagePlan || draft.bodyImages || draft.inlineImages,
    baseBody,
    draft
  );
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
    imageAltSuggestion: ensureKeywordInAltText(draft.imageAltSuggestion || draft.imageAlt || "", targetKeyword, title),
    targetKeyword,
  };

  if (faq.length > 0) {
    document.faq = faq;
  }

  if (sectionImagePlan.length > 0) {
    document.sectionImagePlan = sectionImagePlan;
  }

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
