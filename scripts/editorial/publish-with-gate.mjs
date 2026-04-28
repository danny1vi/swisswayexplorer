import { spawnSync } from "node:child_process";
import { parseArgs } from "./shared.mjs";
import { runEditorialGate } from "./gate.mjs";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error("Missing --file path/to/draft.json");
    process.exit(1);
  }

  const gate = await runEditorialGate(args.file);
  if (!gate.ok) {
    console.error(JSON.stringify(gate, null, 2));
    console.error("Publish blocked by editorial gate.");
    process.exit(1);
  }

  const child = spawnSync(
    process.execPath,
    ["--env-file=.env", "scripts/sanity/import-draft.mjs", "--mode", "publish", ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    }
  );

  process.exit(child.status ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
