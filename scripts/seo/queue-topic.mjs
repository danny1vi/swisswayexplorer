import path from "node:path";
import {
  backlogPath,
  isoNow,
  normalizeContentType,
  parseArgs,
  readJson,
  repoRoot,
  slugify,
  toRepoRelative,
  writeJson,
} from "./_shared.mjs";

function printHelp() {
  console.log(`Usage:
  npm run seo:queue -- --brief memory/briefs/guide-swiss-travel-pass-vs-half-fare-card.json

Alternative:
  npm run seo:queue -- --seed "lucerne in winter" --type destination
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

let brief = null;
let briefRelativePath = null;

if (args.brief) {
  const briefPath = path.resolve(repoRoot, args.brief);
  brief = await readJson(briefPath);
  if (!brief) {
    console.error(`Brief not found: ${args.brief}`);
    process.exit(1);
  }
  briefRelativePath = toRepoRelative(briefPath);
} else {
  if (!args.seed || !args.type) {
    console.error("Provide either --brief or both --seed and --type.");
    printHelp();
    process.exit(1);
  }

  const contentType = normalizeContentType(args.type);
  const seedKeyword = String(args.seed).trim();
  const slug = slugify(`${contentType}-${seedKeyword}`);

  brief = {
    meta: {
      contentType,
      seedKeyword,
      primaryKeyword: seedKeyword,
    },
    contentPlan: {
      slug,
      titleOptions: [],
    },
    research: {
      sourceTool: "seo-research-mcp",
    },
  };
}

const now = isoNow();
const backlog = (await readJson(backlogPath, null)) || {
  version: 1,
  updatedAt: now,
  allowedStatuses: ["idea", "researched", "briefed", "drafted", "reviewed", "published", "refreshed"],
  items: [],
};

const item = {
  id: brief.contentPlan.slug,
  status: args.status || "briefed",
  contentType: brief.meta.contentType,
  seedKeyword: brief.meta.seedKeyword,
  primaryKeyword: brief.meta.primaryKeyword || brief.meta.seedKeyword,
  slug: brief.contentPlan.slug,
  title: brief.contentPlan.titleOptions?.[0] || "",
  sourceTool: brief.research?.sourceTool || "seo-research-mcp",
  briefPath: briefRelativePath,
  updatedAt: now,
};

const existingIndex = backlog.items.findIndex((entry) => entry.id === item.id);
if (existingIndex >= 0) {
  backlog.items[existingIndex] = { ...backlog.items[existingIndex], ...item };
} else {
  backlog.items.push(item);
}

backlog.updatedAt = now;

await writeJson(backlogPath, backlog);

console.log(
  JSON.stringify(
    {
      backlogPath: toRepoRelative(backlogPath),
      item,
      totalItems: backlog.items.length,
    },
    null,
    2
  )
);
