import { loadDraftFromFile, normalizeWhitespace, parseArgs } from "./shared.mjs";
import { pathToFileURL } from "node:url";

const FILLER_PHRASES = [
  "it is worth noting",
  "generally speaking",
  "in today's article",
  "overall,",
  "simply put",
  "without a doubt",
  "needless to say",
  "in conclusion,",
];

function splitSentences(bodyText) {
  return normalizeWhitespace(bodyText)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function sentenceStartKey(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
}

export async function runEditorialStyleCheck(filePath) {
  const normalized = await loadDraftFromFile(filePath);
  const sentences = splitSentences(normalized.bodyText);
  const fillerHits = [];
  const passiveHits = [];
  const repeatedStarts = [];
  const sentenceLengths = sentences.map((sentence) => sentence.split(/\s+/).filter(Boolean).length);
  const averageSentenceLength =
    sentenceLengths.length > 0
      ? Math.round(sentenceLengths.reduce((sum, value) => sum + value, 0) / sentenceLengths.length)
      : 0;

  for (const phrase of FILLER_PHRASES) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = normalized.bodyText.match(regex) || [];
    if (matches.length > 0) {
      fillerHits.push({ phrase, count: matches.length });
    }
  }

  for (const sentence of sentences) {
    if (/\b(is|are|was|were|be|been|being)\s+\w+(ed|en)\b/i.test(sentence)) {
      passiveHits.push(sentence);
    }
  }

  const startCounts = new Map();
  for (const sentence of sentences) {
    const key = sentenceStartKey(sentence);
    if (!key) continue;
    startCounts.set(key, (startCounts.get(key) || 0) + 1);
  }

  for (const [start, count] of startCounts.entries()) {
    if (count >= 3) {
      repeatedStarts.push({ start, count });
    }
  }

  const issues = [];
  if (fillerHits.reduce((sum, item) => sum + item.count, 0) >= 4) {
    issues.push({
      severity: "critical",
      code: "filler-phrases",
      message: "Too many filler phrases make the article feel generic",
      fillerHits,
    });
  } else if (fillerHits.length > 0) {
    issues.push({
      severity: "warning",
      code: "filler-phrases",
      message: "Some filler phrases should be tightened",
      fillerHits,
    });
  }

  const passiveRatio = sentences.length > 0 ? passiveHits.length / sentences.length : 0;
  if (passiveRatio > 0.3) {
    issues.push({
      severity: "critical",
      code: "passive-voice",
      message: "Passive voice is too common for an editorial travel article",
      passiveRatio,
    });
  } else if (passiveHits.length >= 4) {
    issues.push({
      severity: "warning",
      code: "passive-voice",
      message: "Consider tightening passive sentences",
      passiveRatio,
    });
  }

  if (repeatedStarts.length > 0) {
    issues.push({
      severity: repeatedStarts.some((item) => item.count >= 4) ? "critical" : "warning",
      code: "repeated-starts",
      message: "Several sentences start with the same pattern",
      repeatedStarts,
    });
  }

  if (averageSentenceLength > 28) {
    issues.push({
      severity: "warning",
      code: "sentence-length",
      message: "Average sentence length is long; readability may suffer",
      averageSentenceLength,
    });
  }

  const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const score = Math.max(0, 100 - criticalCount * 20 - warningCount * 7);

  return {
    ok: criticalCount === 0,
    score,
    criticals: issues.filter((issue) => issue.severity === "critical"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
    summary: {
      sentenceCount: sentences.length,
      averageSentenceLength,
      passiveSentenceCount: passiveHits.length,
      fillerPhraseCount: fillerHits.reduce((sum, item) => sum + item.count, 0),
      repeatedStartPatterns: repeatedStarts.length,
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error("Missing --file path/to/draft.json");
    process.exit(1);
  }

  const result = await runEditorialStyleCheck(args.file);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
