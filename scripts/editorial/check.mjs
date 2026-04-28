import {
  countWords,
  firstWords,
  keywordInText,
  loadDraftFromFile,
  normalizeText,
  parseArgs,
} from "./shared.mjs";
import { pathToFileURL } from "node:url";

function addIssue(collection, severity, code, message, details = {}) {
  collection.push({ severity, code, message, ...details });
}

export async function runEditorialCheck(filePath) {
  const normalized = await loadDraftFromFile(filePath);
  const issues = [];

  if (!normalized.documentType || !["guide", "destination"].includes(normalized.documentType)) {
    addIssue(issues, "error", "document-type", "documentType must be guide or destination");
  }

  if (!normalized.title) {
    addIssue(issues, "error", "title", "Title is required");
  }

  if (!normalized.summary) {
    addIssue(issues, "error", "summary", "Summary is required");
  }

  if (!normalized.targetKeyword) {
    addIssue(issues, "error", "target-keyword", "targetKeyword is required for SEO and image alt text checks");
  }

  if (!normalized.bodyText) {
    addIssue(issues, "error", "body", "Body content is required");
  }

  if (!normalized.intro || countWords(normalized.intro) < 60) {
    addIssue(issues, "warning", "intro", "Introduction is short; target at least 60 words of orientation and context");
  }

  if (normalized.sections.length < 5) {
    addIssue(issues, "error", "h2-count", "Article should contain at least 5 H2 sections");
  }

  normalized.sections.forEach((section) => {
    if (section.wordCount < 80) {
      addIssue(issues, "warning", "thin-section", `Section "${section.heading}" is thin (${section.wordCount} words)`);
    }
  });

  const lastHeading = normalized.sections.at(-1)?.heading || "";
  const looksLikeConclusion = /(conclusion|final|verdict|takeaway|should you choose)/i.test(lastHeading);
  if (!looksLikeConclusion) {
    addIssue(issues, "warning", "conclusion-heading", "Last H2 does not look like a conclusion or final decision section");
  }

  const first100 = firstWords(`${normalized.title}\n\n${normalized.intro}`, 100);
  if (!keywordInText(first100, normalized.targetKeyword)) {
    addIssue(issues, "error", "keyword-first-100", "targetKeyword must appear in the first 100 words");
  }

  const keywordHeadingCount = normalized.h2Headings.filter((heading) => keywordInText(heading, normalized.targetKeyword)).length;
  if (keywordHeadingCount < 1) {
    addIssue(issues, "warning", "keyword-h2", "No H2 heading contains the targetKeyword");
  }

  if (normalized.faqItems.length < 4 || normalized.faqItems.length > 6) {
    addIssue(issues, "error", "faq-count", "FAQ must contain 4-6 items");
  }

  if (normalized.faqItems.some((item) => countWords(item.answer) < 12)) {
    addIssue(issues, "warning", "faq-depth", "Some FAQ answers are too short to be useful");
  }

  if (!normalized.quickVerdict) {
    addIssue(issues, "error", "quick-verdict", "quickVerdict block is required");
  }

  if (normalized.highlightItems.length < 2 || normalized.highlightItems.length > 4) {
    addIssue(issues, "error", "highlight-count", "Article must include 2-4 highlight/proTip blocks");
  }

  const proTipCount = normalized.highlightItems.filter((item) => normalizeText(item.tone) === "protip").length;
  if (proTipCount < 1) {
    addIssue(issues, "warning", "pro-tip", "At least one proTip-style highlight is recommended");
  }

  if (normalized.sectionImagePlan.length < 5) {
    addIssue(issues, "error", "image-plan-count", "Article must define at least 5 section image briefs");
  }

  normalized.sectionImagePlan.forEach((item, index) => {
    if (!item.heading) {
      addIssue(issues, "error", "image-heading", `Section image brief ${index + 1} is missing a target heading`);
    }
    if (!item.alt) {
      addIssue(issues, "error", "image-alt", `Section image brief ${index + 1} is missing alt text`);
    }
    if (!item.prompt) {
      addIssue(issues, "error", "image-prompt", `Section image brief ${index + 1} is missing an image prompt`);
    }
    if (item.alt && normalized.targetKeyword && !keywordInText(item.alt, normalized.targetKeyword)) {
      addIssue(
        issues,
        "error",
        "image-alt-keyword",
        `Section image alt text must include targetKeyword: "${item.heading}"`
      );
    }
    if (item.heading && !normalized.h2Headings.some((heading) => normalizeText(heading) === normalizeText(item.heading))) {
      addIssue(
        issues,
        "error",
        "image-heading-match",
        `Section image heading does not match any H2: "${item.heading}"`
      );
    }
  });

  if (normalized.imageAltSuggestion && normalized.targetKeyword && !keywordInText(normalized.imageAltSuggestion, normalized.targetKeyword)) {
    addIssue(issues, "error", "hero-alt-keyword", "imageAltSuggestion must include targetKeyword");
  }

  const internalLinks = normalized.links.filter((link) => /^\/(guides|destinations|about|contact)\//.test(link.href)).length;
  const externalLinks = normalized.links.filter((link) => /^https?:\/\//.test(link.href)).length;

  if (internalLinks < 2) {
    addIssue(issues, "warning", "internal-links", "At least 2 internal SwissWayExplorer links are recommended");
  }

  if (externalLinks < 1) {
    addIssue(issues, "warning", "external-links", "At least 1 external official-source link is recommended");
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const score = Math.max(0, 100 - errorCount * 15 - warningCount * 4);

  return {
    ok: errorCount === 0,
    score,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
    summary: {
      documentType: normalized.documentType,
      title: normalized.title,
      slug: normalized.slug,
      targetKeyword: normalized.targetKeyword,
      wordCount: normalized.wordCount,
      h2Count: normalized.h2Headings.length,
      faqCount: normalized.faqItems.length,
      highlightCount: normalized.highlightItems.length,
      sectionImageCount: normalized.sectionImagePlan.length,
      internalLinks,
      externalLinks,
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error("Missing --file path/to/draft.json");
    process.exit(1);
  }

  const result = await runEditorialCheck(args.file);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
