import { readFile } from "node:fs/promises";

export function parseArgs(argv) {
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

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeKeyword(value, fallback = "") {
  return normalizeWhitespace(value || fallback);
}

export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(value) {
  const text = normalizeWhitespace(value);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function blockToText(block) {
  if (!block || block._type !== "block") return "";
  return (Array.isArray(block.children) ? block.children : [])
    .map((child) => child?.text || "")
    .join("")
    .trim();
}

export function bodyToMarkdown(body) {
  if (typeof body === "string") return normalizeWhitespace(body);

  if (Array.isArray(body)) {
    const pieces = [];
    for (const item of body) {
      if (!item) continue;
      if (typeof item === "string") {
        pieces.push(item.trim());
        continue;
      }
      if (item._type === "block") {
        const text = blockToText(item);
        if (!text) continue;
        const style = item.style || "normal";
        if (style === "h2") {
          pieces.push(`## ${text}`);
        } else if (style === "h3") {
          pieces.push(`### ${text}`);
        } else {
          pieces.push(text);
        }
        continue;
      }
      if (item._type === "image" && item.alt) {
        pieces.push(`![${item.alt}]()`);
      }
    }
    return normalizeWhitespace(pieces.join("\n\n"));
  }

  return normalizeWhitespace(body);
}

export function extractMarkdownHeadings(bodyText, depth = 2) {
  const prefix = "#".repeat(depth);
  const regex = new RegExp(`^${prefix}\\s+(.+)$`, "gm");
  const headings = [];
  let match;
  while ((match = regex.exec(bodyText)) !== null) {
    headings.push({
      heading: match[1].trim(),
      index: match.index,
    });
  }
  return headings;
}

export function splitMarkdownSections(bodyText) {
  const normalized = normalizeWhitespace(bodyText);
  const headings = extractMarkdownHeadings(normalized, 2);

  if (headings.length === 0) {
    return {
      intro: normalized,
      sections: [],
    };
  }

  const intro = normalized.slice(0, headings[0].index).trim();
  const sections = headings.map((entry, index) => {
    const nextIndex = headings[index + 1]?.index ?? normalized.length;
    const rawSection = normalized.slice(entry.index, nextIndex).trim();
    const content = rawSection.replace(/^##\s+.+$/m, "").trim();
    return {
      heading: entry.heading,
      content,
      wordCount: countWords(content),
    };
  });

  return { intro, sections };
}

export function extractMarkdownLinks(bodyText) {
  const matches = [...String(bodyText || "").matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
  return matches.map((match) => ({
    text: match[1].trim(),
    href: match[2].trim(),
  }));
}

function parseFaqFromBody(bodyText) {
  const match = String(bodyText || "").match(/\[\s*\/\/\s*faq\s*\n([\s\S]*?)\]/i);
  if (!match) return [];

  const lines = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items = [];
  let question = "";
  let answerLines = [];

  const flush = () => {
    const safeQuestion = question.trim();
    const safeAnswer = answerLines.join(" ").trim();
    if (safeQuestion && safeAnswer) {
      items.push({ question: safeQuestion, answer: safeAnswer });
    }
    question = "";
    answerLines = [];
  };

  for (const line of lines) {
    const questionMatch = line.match(/^Q[:\-]\s*(.+)$/i);
    const answerMatch = line.match(/^A[:\-]\s*(.+)$/i);
    if (questionMatch) {
      flush();
      question = questionMatch[1].trim();
      continue;
    }
    if (answerMatch) {
      answerLines.push(answerMatch[1].trim());
      continue;
    }
    if (question) {
      answerLines.push(line);
    }
  }

  flush();
  return items;
}

function normalizeFaqItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const [questionPart, ...answerParts] = item.split(/\?\s+/);
        const question = questionPart?.trim();
        const answer = answerParts.join("? ").trim();
        if (!question || !answer) return null;
        return { question: `${question}?`, answer };
      }
      if (typeof item !== "object") return null;
      const question = normalizeWhitespace(item.question);
      const answer = normalizeWhitespace(item.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);
}

function normalizeHighlightItems(highlightBoxes, proTips) {
  const boxes = Array.isArray(highlightBoxes) ? highlightBoxes : [];
  const tips = Array.isArray(proTips)
    ? proTips.map((item) =>
        typeof item === "string"
          ? { tone: "proTip", body: item }
          : { ...item, tone: item?.tone || "proTip" }
      )
    : [];

  return [...boxes, ...tips]
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        tone: normalizeWhitespace(item.tone || "tip"),
        title: normalizeWhitespace(item.title),
        body: normalizeWhitespace(item.body),
        insertBeforeHeading: normalizeWhitespace(item.insertBeforeHeading || item.heading),
      };
    })
    .filter((item) => item?.body);
}

function normalizeSectionImagePlan(items) {
  const source = Array.isArray(items) ? items : [];
  return source
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return {
        heading: normalizeWhitespace(item.heading || item.insertBeforeHeading),
        headingStyle: normalizeWhitespace(item.headingStyle || "h2") || "h2",
        alt: normalizeWhitespace(item.alt),
        caption: normalizeWhitespace(item.caption),
        prompt: normalizeWhitespace(item.prompt),
      };
    })
    .filter(Boolean);
}

export function pickDraftShape(input) {
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

  return input || {};
}

export async function loadDraftFromFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  const input = JSON.parse(raw);
  return normalizeDraft(input);
}

export function normalizeDraft(input) {
  const draft = pickDraftShape(input);
  const title = normalizeWhitespace(draft.title);
  const summary = normalizeWhitespace(draft.summary);
  const targetKeyword = normalizeKeyword(draft.targetKeyword, title);
  const bodyText = bodyToMarkdown(draft.body);
  const { intro, sections } = splitMarkdownSections(bodyText);
  const h2Headings = sections.map((section) => section.heading);
  const links = extractMarkdownLinks(bodyText);
  const faqItems = normalizeFaqItems(draft.faq).length > 0 ? normalizeFaqItems(draft.faq) : parseFaqFromBody(bodyText);
  const highlightItems = normalizeHighlightItems(draft.highlightBoxes, draft.proTips);
  const sectionImagePlan = normalizeSectionImagePlan(
    draft.sectionImagePlan || draft.bodyImages || draft.inlineImages
  );

  return {
    input,
    draft,
    documentType: normalizeWhitespace(draft.documentType || draft._type),
    title,
    slug: slugify(draft.slug?.current || draft.slug || title),
    summary,
    targetKeyword,
    quickVerdict: draft.quickVerdict || null,
    imageAltSuggestion: normalizeWhitespace(draft.imageAltSuggestion || draft.imageAlt),
    bodyText,
    intro,
    sections,
    h2Headings,
    faqItems,
    highlightItems,
    sectionImagePlan,
    links,
    wordCount: countWords(bodyText),
  };
}

export function keywordInText(text, keyword) {
  const normalizedKeyword = normalizeText(keyword);
  const normalizedValue = normalizeText(text);
  if (!normalizedKeyword || !normalizedValue) return false;
  return normalizedValue.includes(normalizedKeyword);
}

export function firstWords(text, limit = 100) {
  return normalizeWhitespace(text)
    .split(/\s+/)
    .slice(0, limit)
    .join(" ");
}
