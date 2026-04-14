# Sanity Editorial Workflow

Updated: 2026-04-14

## Goal

Use AI to create draft content in Sanity, then finish visuals manually in Studio.

Target flow:

1. Generate brief
2. Generate draft JSON
3. Import draft into Sanity
4. Open Studio locally
5. Add image and copy the alt suggestion
6. Publish
7. The live site reads the new published content on the next request

## Current Setup

- Hermes on the VPS already has a configured `sanity` MCP server in `~/.hermes/config.yaml`
- Local repo now supports draft import through:
  - `npm run sanity:import-draft`
- Studio now has editorial queue lists:
  - `Image Pending`
  - `Review Ready`
  - `Published Queue`

## Required Env

Add these to local `.env`:

```bash
SANITY_PROJECT_ID=lxmhb5oh
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_READ_TOKEN=
SANITY_WRITE_TOKEN=
```

`SANITY_WRITE_TOKEN` must have write access to `production`.
`SANITY_READ_TOKEN` should be present in the live app environment so the Astro server can read published content at request time.

## Draft JSON Shape

Minimum example:

```json
{
  "documentType": "guide",
  "title": "Swiss Travel Pass vs Half Fare Card",
  "slug": "swiss-travel-pass-vs-half-fare-card",
  "summary": "A practical comparison for first-time Switzerland travelers.",
  "body": "Start with what each pass is for.\n\nThen compare who saves more with each option.",
  "category": "transport",
  "imageAltSuggestion": "Swiss train moving past alpine scenery in Switzerland"
}
```

The importer creates a draft document id like:

```text
drafts.guide.swiss-travel-pass-vs-half-fare-card
```

Default workflow status:

```text
image_pending
```

## Import Command

Dry run:

```bash
npm run sanity:import-draft -- --file memory/drafts/guide-swiss-pass.json --dry-run
```

Write draft:

```bash
npm run sanity:import-draft -- --file memory/drafts/guide-swiss-pass.json
```

Optional overrides:

```bash
npm run sanity:import-draft -- --file memory/drafts/guide-swiss-pass.json --status review_ready --generated-by minimax
```

## Studio Workflow

1. Run `npx sanity dev`
2. Open local Studio
3. Go to `Image Pending`
4. Open the new draft
5. Upload the image
6. Copy `Image alt suggestion` into the real image alt field
7. Change `Workflow status` to `review_ready` or `published`
8. Publish

## Publish Behavior

SwissWayExplorer now uses Astro's Node adapter for request-time rendering on Sanity-backed routes.

Publishing in Sanity updates the live homepage, guides, and destinations on the next request.

The rebuild webhook is no longer required for normal content edits.
Keep it only if you later decide to trigger full app redeploys from content operations or other infrastructure events.

- `docs/SANITY_WEBHOOK_SETUP.md`

## Recommended AI Prompt Contract

Ask MiniMax or Codex to return:

- `documentType`
- `title`
- `slug`
- `summary`
- `body`
- `category` or `region` / `bestSeason`
- `imageAltSuggestion`
- optional `generatedBy`

Do not ask the model to publish directly.
The model should stop at a Sanity-ready draft JSON file.
