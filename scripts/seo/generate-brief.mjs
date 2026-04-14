import path from "node:path";
import {
  briefsDir,
  buildBrief,
  briefToMarkdown,
  normalizeContentType,
  parseArgs,
  repoRoot,
  toRepoRelative,
  writeJson,
  writeText,
} from "./_shared.mjs";

function printHelp() {
  console.log(`Usage:
  npm run seo:brief -- --seed "swiss travel pass vs half fare card" --type guide

Options:
  --seed       Required seed keyword
  --type       destination | guide
  --audience   Optional audience override
  --locale     Optional locale override (default: en)
  --output     Optional JSON output path relative to repo root
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

if (!args.seed) {
  console.error("Missing required --seed value.");
  printHelp();
  process.exit(1);
}

const contentType = normalizeContentType(args.type);
const brief = buildBrief({
  contentType,
  seedKeyword: String(args.seed).trim(),
  audience: args.audience,
  locale: args.locale,
});

const jsonPath = args.output
  ? path.resolve(repoRoot, args.output)
  : path.join(briefsDir, `${brief.contentPlan.slug}.json`);
const markdownPath = jsonPath.replace(/\.json$/i, ".md");

await writeJson(jsonPath, brief);
await writeText(markdownPath, briefToMarkdown(brief));

console.log(
  JSON.stringify(
    {
      briefPath: toRepoRelative(jsonPath),
      markdownPath: toRepoRelative(markdownPath),
      contentType: brief.meta.contentType,
      seedKeyword: brief.meta.seedKeyword,
      slug: brief.contentPlan.slug,
    },
    null,
    2
  )
);
