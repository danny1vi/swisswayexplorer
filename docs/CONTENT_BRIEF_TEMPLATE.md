# Content Brief Template

Updated: 2026-04-13

Use this template after running SEO research and before drafting any SwissWayExplorer content.

## Required Fields

- `contentType`
- `seedKeyword`
- `primaryKeyword`
- `searchIntent`
- `slug`
- `titleOptions`
- `outline`
- `sanityMapping`

## Markdown Template

```md
# Content Brief

## Meta
- Content type:
- Seed keyword:
- Primary keyword:
- Secondary keywords:
- Audience:
- Search intent:
- Difficulty:
- Traffic potential:

## SERP Snapshot
- Competing pages:
- Common angle:
- Gaps we can cover:

## Title Options
1.
2.
3.

## Slug
- Proposed slug:

## Outline
- H2:
- H2:
- H2:

## FAQ
- Question:
- Question:
- Question:

## Internal Links
- Existing SwissWayExplorer page:
- Existing SwissWayExplorer page:

## Image Brief
- Hero image angle:
- Required alt text direction:

## Sanity Mapping
- Document type:
- Title:
- Slug:
- Summary:
- Extra fields:

## Draft Checklist
- Facts verified
- Search intent matched
- Summary written for both humans and SEO snippet use
- Body covers core comparison or planning questions
- Internal links included
```

## JSON Template

```json
{
  "version": 1,
  "createdAt": "2026-04-13T00:00:00.000Z",
  "updatedAt": "2026-04-13T00:00:00.000Z",
  "meta": {
    "contentType": "guide",
    "seedKeyword": "swiss travel pass vs half fare card",
    "primaryKeyword": "swiss travel pass vs half fare card",
    "secondaryKeywords": [],
    "audience": "first-time Switzerland travelers",
    "locale": "en",
    "searchIntent": "comparison"
  },
  "research": {
    "sourceTool": "seo-research-mcp",
    "status": "pending-enrichment",
    "difficulty": null,
    "trafficPotential": null,
    "competitorPages": [],
    "keywordIdeas": [],
    "backlinkNotes": [],
    "notes": []
  },
  "contentPlan": {
    "slug": "guide-swiss-travel-pass-vs-half-fare-card",
    "titleOptions": [
      "Swiss travel pass vs half fare card: what first-time Switzerland travelers should know",
      "Swiss travel pass vs half fare card: how to choose the right option for your trip",
      "Swiss travel pass vs half fare card: the practical planning guide"
    ],
    "outline": [
      {
        "heading": "What travelers usually mean by this search",
        "goal": "Define the real planning problem behind the query"
      },
      {
        "heading": "Who each option is best for",
        "goal": "Match advice to traveler type and trip style"
      }
    ],
    "faqQuestions": [],
    "internalLinkTargets": [],
    "imageBrief": "Editorial travel-planning image tied to Swiss rail decisions"
  },
  "sanityMapping": {
    "documentType": "guide",
    "targetSchemaFile": "sanity/schemaTypes/guide.ts",
    "fields": {
      "title": "",
      "slug": "guide-swiss-travel-pass-vs-half-fare-card",
      "summary": "",
      "body": "",
      "category": "transport",
      "imageAlt": ""
    }
  },
  "checklist": [
    "Confirm the primary keyword after research",
    "Write the summary in a snippet-friendly way",
    "Validate category and internal links before publishing"
  ]
}
```

## Mapping Rules

### `destination`

Use when the topic is place-led.

- target schema: `sanity/schemaTypes/destination.ts`
- extra fields: `region`, `bestSeason`

### `guide`

Use when the topic is planning-led.

- target schema: `sanity/schemaTypes/guide.ts`
- extra field: `category`

## Editorial Rules

- Keep the brief factual before writing the article
- Keep keyword research separate from final prose
- Use the brief to prevent cannibalization before drafting
- Prefer one clear intent per page
