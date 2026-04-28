# Editorial QA Gate

Updated: 2026-04-28

## Goal

Block weak articles before they are published to Sanity.

This gate is deterministic. It does not rely on a chat model to decide whether a draft is publishable.

## Commands

```bash
npm run editorial:check -- --file memory/drafts/example.json
npm run editorial:style -- --file memory/drafts/example.json
npm run editorial:gate -- --file memory/drafts/example.json
```

`sanity:publish` now runs the same gate automatically before writing to the live document.

Unsafe bypass remains available:

```bash
npm run sanity:publish:unsafe -- --file memory/drafts/example.json
```

## What The Gate Checks

### Editorial contract

- `documentType` present and valid
- `title`, `summary`, `body`, `targetKeyword` present
- at least 5 `h2` sections
- `quickVerdict` present
- 2-4 highlight or pro-tip blocks
- 4-6 FAQ items
- at least 5 `sectionImagePlan` or `bodyImages` entries

### SEO and image rules

- target keyword appears in the first 100 words
- image alt suggestion includes the target keyword
- every section image alt includes the target keyword
- every section image points to a real `h2`

### Flow and usefulness

- intro is not empty
- sections are not too thin
- final section looks like a conclusion or decision section
- internal and external link coverage is warned on when thin

### Style heuristics

- filler phrase density
- passive voice overuse
- repeated sentence openings
- overly long sentence averages

## Why This Exists

We already have prompt-based review in the content pipeline, but prompt review is not enough for:

- FAQ presence
- image planning completeness
- keyword-aware alt text
- enforceable publish blocking

This gate fills that gap.
