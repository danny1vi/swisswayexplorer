# Architecture Overview

## Stack
- Framework: Astro
- Runtime target: Static output served by Nginx container
- Content source (later phase): Sanity
- Orchestration: Coolify + Traefik

## Current App Layers
1. `src/config` for site-level configuration and seed data
2. `src/layouts` for shared page chrome
3. `src/components/shared` for common UI parts
4. `src/components/sections` for homepage blocks
5. `src/pages` for route entrypoints

## Reusability Rule
- Generic UI and data contracts stay stable
- Brand/content values are swapped through `src/config/site.ts`

## Next Architecture Step
- Add `src/lib/sanity/*` and map page sections to Sanity documents
