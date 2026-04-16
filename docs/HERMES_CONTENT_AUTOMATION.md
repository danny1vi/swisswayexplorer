# Hermes Content Automation

Updated: 2026-04-15

## Goal

Allow Hermes to generate SwissWayExplorer content in two modes:

- `draft`: write to Sanity as a draft for later image/manual review
- `publish`: write directly to the published document so it is live on the next request

## Mode Phrases

Use plain-language intents in Telegram:

- `Draft a guide for SwissWayExplorer about Lucerne vs Interlaken`
- `Write and publish a guide live on SwissWayExplorer about Lucerne vs Interlaken`
- `Draft a destination page for Lucerne on SwissWayExplorer`
- `Write and publish a destination page for Zermatt on SwissWayExplorer`

## Internal Output Contract

Hermes should normalize the article into this JSON shape before calling the Sanity script:

```json
{
  "documentType": "guide",
  "title": "Lucerne vs Interlaken for First-Time Visitors",
  "slug": "lucerne-vs-interlaken-for-first-time-visitors",
  "summary": "A practical comparison to help first-time Switzerland travelers choose the better base.",
  "quickVerdict": {
    "eyebrow": "Quick verdict",
    "title": "Choose Lucerne for ease, Interlaken for mountain days",
    "body": "Lucerne is usually the better first base if you want a smoother, lower-friction trip. Interlaken works better if your priority is packing in Jungfrau-region mountain outings."
  },
  "highlightBoxes": [
    {
      "tone": "important",
      "title": "Best for first-timers",
      "body": "Lucerne is usually easier for first-time visitors who want a cleaner mix of lake, town, and simple onward travel.",
      "insertBeforeHeading": "Which is better for first-time visitors",
      "headingStyle": "h2"
    },
    {
      "tone": "route",
      "title": "When Interlaken makes more sense",
      "body": "Choose Interlaken if your itinerary is built around Jungfrau Region mountain days rather than city atmosphere.",
      "insertBeforeHeading": "Mountain access and scenic experience",
      "headingStyle": "h2"
    }
  ],
  "body": "Paragraph one.\n\nParagraph two.",
  "category": "itinerary",
  "imageAltSuggestion": "Lake Lucerne and Interlaken mountain scenery split comparison",
  "generatedBy": "hermes-minimax"
}
```

For `destination` documents, replace `category` with:

- `region`
- `bestSeason`

## Editorial Blocks Rule

For every SwissWayExplorer article Hermes generates:

- include exactly one `quickVerdict`
- include at least two `highlightBoxes`
- prefer `important`, `route`, or `budget` tones when they genuinely help the reader decide
- attach each `highlightBox` to a real heading with `insertBeforeHeading` when possible

If the operator does not mention these blocks explicitly, Hermes should still include them as part of the internal JSON.

## Local Commands

Draft:

```bash
npm run sanity:import-draft -- --file memory/drafts/example.json --generated-by hermes-minimax
```

Direct publish:

```bash
npm run sanity:publish -- --file memory/drafts/example.json --generated-by hermes-minimax
```

Attach generated images from URLs:

```bash
npm run sanity:attach-images -- --file memory/drafts/example-images.json
```

Example image payload:

```json
{
  "documentType": "guide",
  "slug": "lucerne-vs-interlaken-for-first-time-visitors",
  "heroImage": {
    "url": "https://example.com/hero.jpg",
    "alt": "Lucerne and Interlaken comparison hero image"
  },
  "gallery": [
    {
      "url": "https://example.com/gallery-1.jpg",
      "alt": "Lucerne waterfront"
    },
    {
      "url": "https://example.com/gallery-2.jpg",
      "alt": "Interlaken valley and mountains"
    }
  ],
  "bodyImages": [
    {
      "url": "https://example.com/body-1.jpg",
      "alt": "Train journey through the Bernese Oberland",
      "caption": "A sample inline article image",
      "insertBeforeHeading": "Mountain access and scenic experience",
      "headingStyle": "h2"
    }
  ]
}
```

H2-aware insertion:

- add `insertBeforeHeading` to a `bodyImages` item to place it immediately before that heading
- `headingStyle` defaults to `h2`
- heading text must match the Sanity body heading text
- if no heading is provided, the image is appended to the end of the body

## Important Rule

Hermes should not return free-form markdown first and leave the operator to manually restructure it.

The writing flow should be:

1. understand whether the user wants `guide` or `destination`
2. understand whether the operator intent is `draft` or `publish`
3. generate the article content
4. generate one `quickVerdict` and at least two `highlightBoxes`
5. normalize everything into the Sanity JSON contract
6. call the correct Sanity write command
7. return the resulting slug and live URL
