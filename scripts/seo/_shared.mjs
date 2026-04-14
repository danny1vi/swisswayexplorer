import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, "..", "..");
export const backlogPath = path.join(repoRoot, "memory", "content-backlog.json");
export const briefsDir = path.join(repoRoot, "memory", "briefs");

export function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
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

export function normalizeContentType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "destination" || normalized === "guide") return normalized;
  throw new Error("Expected --type destination or --type guide.");
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function titleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isoNow() {
  return new Date().toISOString();
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJson(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${text.trimEnd()}\n`, "utf8");
}

export function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function defaultGuideOutline(seedKeyword) {
  return [
    {
      heading: "What travelers usually mean by this search",
      goal: `Define the real planning problem behind ${seedKeyword}.`,
    },
    {
      heading: "Who this option is best for",
      goal: "Match the advice to traveler type, trip length, and budget.",
    },
    {
      heading: "Costs, tradeoffs, and decision rules",
      goal: "Explain the practical decision logic without filler.",
    },
    {
      heading: "Sample scenarios",
      goal: "Show realistic trip examples a first-time visitor can map to.",
    },
    {
      heading: "Common mistakes and planning tips",
      goal: "Cover mistakes, caveats, and useful next steps.",
    },
  ];
}

function defaultDestinationOutline(seedKeyword) {
  return [
    {
      heading: "Why this destination belongs on a Swiss itinerary",
      goal: `Explain the traveler value of ${seedKeyword}.`,
    },
    {
      heading: "What to do and how long to stay",
      goal: "Set realistic expectations for trip planning.",
    },
    {
      heading: "Best season, pace, and trip style",
      goal: "Help readers decide when the destination fits best.",
    },
    {
      heading: "Where it fits in a wider itinerary",
      goal: "Connect the destination to nearby bases and routes.",
    },
    {
      heading: "Practical planning notes",
      goal: "Cover transport, timing, and common planning mistakes.",
    },
  ];
}

function defaultTitleOptions(contentType, seedKeyword) {
  const topic = titleCase(seedKeyword);
  if (contentType === "destination") {
    return [
      `${topic}: why it deserves a place on your Switzerland itinerary`,
      `${topic}: what to know before you build your Swiss trip around it`,
      `${topic}: how to decide if it fits your travel style`,
    ];
  }

  return [
    `${topic}: what first-time Switzerland travelers should know`,
    `${topic}: how to choose the right option for your trip`,
    `${topic}: the practical planning guide`,
  ];
}

function defaultCategory(seedKeyword) {
  const value = seedKeyword.toLowerCase();
  if (value.includes("pass") || value.includes("train") || value.includes("transport")) {
    return "transport";
  }
  if (value.includes("budget") || value.includes("cost")) {
    return "budget";
  }
  if (value.includes("itinerary") || value.includes("base")) {
    return "itinerary";
  }
  return "seasonal";
}

export function buildBrief({
  contentType,
  seedKeyword,
  audience = "first-time Switzerland travelers",
  locale = "en",
}) {
  const slug = slugify(`${contentType}-${seedKeyword}`);
  const createdAt = isoNow();
  const outline =
    contentType === "destination"
      ? defaultDestinationOutline(seedKeyword)
      : defaultGuideOutline(seedKeyword);

  const fields =
    contentType === "destination"
      ? {
          title: "",
          slug,
          summary: "",
          body: "",
          region: "",
          bestSeason: "",
          imageAlt: "",
        }
      : {
          title: "",
          slug,
          summary: "",
          body: "",
          category: defaultCategory(seedKeyword),
          imageAlt: "",
        };

  return {
    version: 1,
    createdAt,
    updatedAt: createdAt,
    meta: {
      contentType,
      seedKeyword,
      primaryKeyword: seedKeyword,
      secondaryKeywords: [],
      audience,
      locale,
      searchIntent: contentType === "destination" ? "destination research" : "planning research",
    },
    research: {
      sourceTool: "seo-research-mcp",
      status: "pending-enrichment",
      difficulty: null,
      trafficPotential: null,
      competitorPages: [],
      keywordIdeas: [],
      backlinkNotes: [],
      notes: [
        "Populate this section with verified seo-research-mcp output before drafting.",
      ],
    },
    contentPlan: {
      slug,
      titleOptions: defaultTitleOptions(contentType, seedKeyword),
      outline,
      faqQuestions: [],
      internalLinkTargets: [],
      imageBrief: `Editorial travel image for ${seedKeyword}.`,
    },
    sanityMapping: {
      documentType: contentType,
      targetSchemaFile: `sanity/schemaTypes/${contentType}.ts`,
      fields,
    },
    checklist: [
      "Confirm the primary keyword after research.",
      "Write the summary for both readers and snippet use.",
      "Check internal links before publishing.",
    ],
  };
}

export function briefToMarkdown(brief) {
  const outline = brief.contentPlan.outline
    .map((item) => `- ${item.heading}: ${item.goal}`)
    .join("\n");
  const titles = brief.contentPlan.titleOptions.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const sanityFields = Object.entries(brief.sanityMapping.fields)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");

  return `# Content Brief

## Meta
- Content type: ${brief.meta.contentType}
- Seed keyword: ${brief.meta.seedKeyword}
- Primary keyword: ${brief.meta.primaryKeyword}
- Audience: ${brief.meta.audience}
- Search intent: ${brief.meta.searchIntent}

## Research
- Source tool: ${brief.research.sourceTool}
- Status: ${brief.research.status}
- Difficulty: ${brief.research.difficulty ?? ""}
- Traffic potential: ${brief.research.trafficPotential ?? ""}

## Title Options
${titles}

## Slug
- ${brief.contentPlan.slug}

## Outline
${outline}

## FAQ
- Add FAQ questions after research.

## Internal Links
- Add internal link targets after reviewing existing Sanity content.

## Image Brief
- ${brief.contentPlan.imageBrief}

## Sanity Mapping
- Document type: ${brief.sanityMapping.documentType}
- Target schema: ${brief.sanityMapping.targetSchemaFile}
${sanityFields}
`;
}
