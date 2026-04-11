# Swiss Editorial Roadmap

## Goal

Move SwissWayExplorer from a clean scaffold into a distinctive editorial travel product with stronger hierarchy, richer long-form patterns, and a CMS model that supports those layouts without manual code edits per story.

## Target Direction

The target visual/product direction is:

- editorial magazine hierarchy
- premium but restrained palette
- serif-led headings with highly readable sans body copy
- photography-first storytelling
- strong route-planning utility, not generic inspiration content

## Recommended Design System

This recommendation combines the current product needs, the user-supplied visual references, and a `ui-ux-pro-max` pass.

### Layout language

- Base pattern: editorial grid / magazine
- Structural discipline: Swiss modern grid logic
- Interaction tone: restrained motion, not animation-heavy

### Typography

- Heading: `Playfair Display`
- Body/UI: `Inter`
- Rationale: this matches the desired premium editorial feel better than the current system-sans stack

### Palette

- Primary deep green: `#1A3C34`
- Warm background: `#FAF8F6`
- Gold accent: `#C9A84C`
- Text dark: `#1C1917`
- Muted copy: `#5F6B66`

### Motion

- card hover: subtle lift and shadow only
- header: shrink on scroll
- sections: light fade/reveal only
- mobile: no heavy motion dependency

## Current Gap Audit

The repo is already functional, but it is still structurally closer to a pilot scaffold than the target experience.

### Homepage

Current state:

- hero
- featured destination grid
- CTA block

Missing versus target:

- category grid
- editorial split feature block
- 2x2 destination grid with stronger hierarchy
- itinerary teaser rail

### Destination pages

Current state:

- top image
- text body
- small metadata row

Missing versus target:

- sidebar metadata rail
- richer article rhythm
- full-width media blocks inside story flow
- related destinations section

### Guide pages

Current state:

- top image
- text body

Missing versus target:

- sticky table of contents
- structured step/waypoint blocks
- more obvious scannability for decision-oriented content

### CMS model

Current state:

- Sanity supports basic homepage fields
- destinations/guides support summary, image, and portable text body

Missing versus target:

- reusable homepage section objects
- editorial split block
- itinerary teaser block
- richer destination metadata
- guide TOC and waypoint structures

## Recommended Implementation Order

### Phase 1: Design system pass

- replace global tokens in `BaseLayout.astro`
- update type stack to serif heading + sans body
- tighten spacing scale and section rhythm
- refactor header/footer to fit the editorial direction

### Phase 2: Homepage editorial pass

- rebuild hero to feel more immersive and premium
- add 3-column category grid: `Destinations`, `Guides`, `Stories/Planning`
- add reusable editorial split block
- replace current featured area with stronger 2x2 destination grid
- add itinerary teaser section

### Phase 3: Destination page pass

- add left or right metadata sidebar
- improve article typography rhythm
- support full-bleed or wide media insertions between content sections
- add related destinations block

### Phase 4: Guide page pass

- add sticky table of contents
- add guide section anchors
- add waypoint / decision cards
- improve reading hierarchy for long-form practical guides

### Phase 5: CMS model pass

- extend `pageHome` schema with section arrays and editorial split objects
- extend `destination` schema with richer metadata and modular content blocks
- extend `guide` schema with structured section and TOC support
- add `siteSettings` document content in Sanity for global SEO and brand values

### Phase 6: Automation and QA pass

- add Sanity publish -> deploy webhook
- update runbook for webhook and cache behavior
- run browser QA after layouts stabilize
- keep Astro static build unless rebuild latency becomes a real problem

## Delivery Strategy

Use the following execution model for SwissWayExplorer:

1. Design tokens and reusable components first
2. Homepage composition second
3. Detail page structure third
4. Sanity schema changes in parallel with component needs
5. Automation after the content model settles

Do not move to SSR yet. The site is a strong fit for static generation plus webhook-triggered rebuilds.

## First Sprint Recommendation

The next sprint should do only these items:

1. Lock the editorial design system in code
2. Add homepage section schemas for category grid, editorial split, and itinerary teaser
3. Implement the redesigned homepage against those schemas
4. Create the missing `siteSettings` document in Sanity

This keeps the scope tight while moving the product meaningfully toward the target.
