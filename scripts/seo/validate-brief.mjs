import path from "node:path";
import { parseArgs, readJson, repoRoot, toRepoRelative } from "./_shared.mjs";

function printHelp() {
  console.log(`Usage:
  npm run seo:validate -- --brief memory/briefs/guide-swiss-travel-pass-vs-half-fare-card.json
`);
}

function pushIfMissing(condition, message, list) {
  if (!condition) list.push(message);
}

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

if (!args.brief) {
  console.error("Missing required --brief value.");
  printHelp();
  process.exit(1);
}

const briefPath = path.resolve(repoRoot, args.brief);
const brief = await readJson(briefPath);

if (!brief) {
  console.error(`Brief not found: ${args.brief}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

pushIfMissing(brief.meta?.contentType, "meta.contentType is required.", errors);
pushIfMissing(brief.meta?.seedKeyword, "meta.seedKeyword is required.", errors);
pushIfMissing(brief.meta?.primaryKeyword, "meta.primaryKeyword is required.", errors);
pushIfMissing(brief.meta?.searchIntent, "meta.searchIntent is required.", errors);
pushIfMissing(brief.contentPlan?.slug, "contentPlan.slug is required.", errors);
pushIfMissing(
  Array.isArray(brief.contentPlan?.titleOptions) && brief.contentPlan.titleOptions.length > 0,
  "contentPlan.titleOptions must contain at least one title.",
  errors
);
pushIfMissing(
  Array.isArray(brief.contentPlan?.outline) && brief.contentPlan.outline.length > 0,
  "contentPlan.outline must contain at least one section.",
  errors
);
pushIfMissing(brief.sanityMapping?.documentType, "sanityMapping.documentType is required.", errors);
pushIfMissing(brief.sanityMapping?.targetSchemaFile, "sanityMapping.targetSchemaFile is required.", errors);
pushIfMissing(brief.sanityMapping?.fields, "sanityMapping.fields is required.", errors);

if (!brief.research?.sourceTool) {
  warnings.push("research.sourceTool is empty.");
}

if (!Array.isArray(brief.research?.keywordIdeas) || brief.research.keywordIdeas.length === 0) {
  warnings.push("research.keywordIdeas is still empty.");
}

if (!Array.isArray(brief.research?.competitorPages) || brief.research.competitorPages.length === 0) {
  warnings.push("research.competitorPages is still empty.");
}

if (
  brief.meta?.contentType &&
  brief.sanityMapping?.documentType &&
  brief.meta.contentType !== brief.sanityMapping.documentType
) {
  errors.push("meta.contentType and sanityMapping.documentType do not match.");
}

const result = {
  briefPath: toRepoRelative(briefPath),
  valid: errors.length === 0,
  errors,
  warnings,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length > 0) {
  process.exit(1);
}
