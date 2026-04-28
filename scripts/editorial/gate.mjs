import { parseArgs } from "./shared.mjs";
import { runEditorialCheck } from "./check.mjs";
import { runEditorialStyleCheck } from "./style.mjs";
import { pathToFileURL } from "node:url";

export async function runEditorialGate(filePath) {
  const check = await runEditorialCheck(filePath);
  const style = await runEditorialStyleCheck(filePath);
  const ok = check.ok && style.ok;

  return {
    ok,
    score: Math.round((check.score + style.score) / 2),
    check,
    style,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error("Missing --file path/to/draft.json");
    process.exit(1);
  }

  const result = await runEditorialGate(args.file);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
