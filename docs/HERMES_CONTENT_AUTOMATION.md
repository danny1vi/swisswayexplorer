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
  "body": "Paragraph one.\n\nParagraph two.",
  "category": "itinerary",
  "imageAltSuggestion": "Lake Lucerne and Interlaken mountain scenery split comparison",
  "generatedBy": "hermes-minimax"
}
```

For `destination` documents, replace `category` with:

- `region`
- `bestSeason`

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
      "caption": "A sample inline article image"
    }
  ]
}
```

## Important Rule

Hermes should not return free-form markdown first and leave the operator to manually restructure it.

The writing flow should be:

1. understand whether the user wants `guide` or `destination`
2. understand whether the operator intent is `draft` or `publish`
3. generate the article content
4. normalize it into the Sanity JSON contract
5. call the correct Sanity write command
6. return the resulting slug and live URL
