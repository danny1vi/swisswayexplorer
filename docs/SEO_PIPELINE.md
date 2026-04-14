# SEO Pipeline

Updated: 2026-04-13

## Goal

Add a repeatable editorial workflow for SwissWayExplorer:

1. research a topic
2. turn research into a usable brief
3. draft content against the current Sanity schema
4. publish and rebuild

This pipeline treats `seo-research-mcp` as a research-only dependency. It does not become part of the Astro runtime, Sanity Studio runtime, or production deploy path.

## Scope

Use this pipeline for:

- new destination pages
- new practical guides
- refreshes of underperforming content
- topic prioritization before drafting

Do not use this pipeline to:

- inject live SEO calls into page rendering
- bypass current editorial review
- publish content without schema validation and sanity checks

## Architecture

The workflow lives in the content layer, not the web app layer.

- Research source: `seo-research-mcp`
- Brief generation: local repo scripts under `scripts/seo/`
- Working state: `memory/content-backlog.json`
- Content target: Sanity documents in `destination` and `guide`
- Publish path: existing Sanity publish plus rebuild webhook flow

## Workflow

### 1. Choose a seed topic

Start with:

- `seedKeyword`
- `contentType`: `destination` or `guide`
- target reader
- expected search intent

Examples:

- `lucerne in winter`
- `swiss travel pass vs half fare card`
- `best base in switzerland for first time visitors`

### 2. Run SEO research

Use `seo-research-mcp` to gather:

- keyword ideas
- traffic estimates
- keyword difficulty
- competitor pages
- backlink notes where helpful

Research output should answer:

- is this topic worth writing now
- what variant should be the primary keyword
- what competing pages define the SERP
- whether the piece should be a `destination` or `guide`

### 3. Generate the brief scaffold

Create a normalized brief:

```bash
npm run seo:brief -- --seed "swiss travel pass vs half fare card" --type guide
```

The script writes a paired JSON and Markdown brief under `memory/briefs/`.

Then fill in the research fields with verified `seo-research-mcp` output.

### 4. Validate the brief

Before queueing or drafting:

```bash
npm run seo:validate -- --brief memory/briefs/guide-swiss-travel-pass-vs-half-fare-card.json
```

Validation catches missing type, slug, outline, Sanity mapping, and other required fields.

### 5. Queue the topic

Once the brief is minimally complete:

```bash
npm run seo:queue -- --brief memory/briefs/guide-swiss-travel-pass-vs-half-fare-card.json
```

This updates `memory/content-backlog.json` so the topic has an editorial lifecycle state.

Allowed states:

- `idea`
- `researched`
- `briefed`
- `drafted`
- `reviewed`
- `published`
- `refreshed`

### 6. Draft for the current Sanity schema

Current target fields:

- `destination`: `title`, `slug`, `summary`, `body`, `image.alt`, `region`, `bestSeason`
- `guide`: `title`, `slug`, `summary`, `body`, `image.alt`, `category`

Schema references:

- `sanity/schemaTypes/destination.ts`
- `sanity/schemaTypes/guide.ts`

Short-term rule:

- use `summary` as both editorial summary and practical SEO description fallback

### 7. Import as a Sanity draft

Import the drafted JSON into Sanity as a draft document:

```bash
npm run sanity:import-draft -- --file memory/drafts/guide-swiss-travel-pass-vs-half-fare-card.json
```

See:

- `docs/SANITY_EDITORIAL_WORKFLOW.md`

### 8. Sanity QA + image enrichment

Before publish:

- run `npm run sanity:check`
- verify slug uniqueness
- verify category or destination metadata
- verify summary is concise and intent-aligned
- confirm internal links and FAQ are reflected in the body until schema extension lands
- add the final image in local Studio
- copy `imageAltSuggestion` into the real image alt field
- move `workflowStatus` to `review_ready`

### 9. Publish and rebuild

Use the existing rebuild runbook:

- `docs/SANITY_WEBHOOK_SETUP.md`

This keeps the content workflow aligned with the current static Astro deployment model.

## Current Commands

### `npm run seo:brief`

Creates a brief scaffold with:

- topic metadata
- research placeholders
- title options
- outline
- FAQ seed
- Sanity mapping

### `npm run seo:validate`

Validates a generated brief before queueing or drafting.

### `npm run seo:queue`

Adds or updates the topic in `memory/content-backlog.json`.

## Current Constraints

- `seo-research-mcp` is not installed locally yet
- current Sanity schemas do not include page-level SEO fields
- FAQ and internal-link planning still live in the brief/body rather than first-class schema fields
- compliance review is required before adopting an Ahrefs and CapSolver-backed tool operationally

## Recommended Next Engineering Step

After the research-only workflow is used successfully for a few topics:

1. extend `destination` and `guide` schemas with page-level SEO fields
2. add a draft import script for Sanity-ready JSON
3. wire internal-link suggestions against existing Sanity content
4. add a refresh workflow for older pages
