# REMEMBERME

Updated: 2026-04-11

If a future session starts with "baglan" or "connect", read this file first after `TOOLS_REGISTRY.md`.

## Project

- Pilot project: `SwissWayExplorer`
- VPS repo: `/opt/fabrika/swisswayexplorer`
- Local working repo: `C:\Users\Hp\swisswayexplorer_live`
- Domain: `https://swisswayexplorer.com/`

## Confirmed Production State

- Cloudflare is active and routing correctly
- `https://swisswayexplorer.com/` returns `200`
- `https://www.swisswayexplorer.com/` redirects to apex
- Sanity production content is live in the build pipeline
- Homepage editorial redesign is live

## Canonical Repo State

- VPS repo branch: `main`
- GitHub remote: `https://github.com/danny1vi/swisswayexplorer.git`
- VPS + GitHub synced commit after tool activation: `b7017df`
- Live container image currently runs the stabilized editorial app image lineage from commit `af45a72`
- The later `b7017df` change is tooling/registry related, not a user-visible frontend change

## Active VPS Tool Stack

Active now:
- `get-shit-done`
- `ui-ux-pro-max-skill`
- `superpowers`
- `agent-browser`

Reference only:
- `kalfa`
- `kalfa-core`
- `gsd-2`

Deferred:
- `autoskills`
- `chatwoot`

## Installed VPS Wrapper Commands

Use these before ad hoc operations:

```bash
site-factory-design /opt/fabrika/swisswayexplorer
site-factory-deploy /opt/fabrika/swisswayexplorer
site-factory-qa /opt/fabrika/swisswayexplorer https://swisswayexplorer.com/ --browser-smoke
```

## CMS / Sanity Status

- Sanity connection is working on VPS
- Published content is used during static build
- `siteSettings` document is still missing in Sanity
- Result: global SEO fallback is still active
- Webhook script/docs exist, but the Sanity publish -> rebuild flow should still be treated as pending unless explicitly re-verified

## Current UX / Design Status

Already live:
- Editorial homepage shell
- Hero + category routing + editorial split + destination comparison + itinerary teaser structure

Prepared locally but NOT deployed yet:
- Curated design-system files aligned to the "Swiss Editorial" brief
- New destination detail layout
- New guide detail layout
- Improved `PortableText` styling
- New content section parser

Local files with the not-yet-deployed redesign:
- `design-system/swisswayexplorer/MASTER.md`
- `design-system/swisswayexplorer/pages/home.md`
- `design-system/swisswayexplorer/pages/destination.md`
- `design-system/swisswayexplorer/pages/guide.md`
- `src/pages/destinations/[slug].astro`
- `src/pages/guides/[slug].astro`
- `src/lib/contentStructure.ts`
- `src/components/shared/PortableText.astro`

Local redesign build status:
- `npm run build` passed on 2026-04-11

## Recommended Next Step

If the user wants the new UX live:

1. Sync the local redesign from `C:\Users\Hp\swisswayexplorer_live` to `/opt/fabrika/swisswayexplorer`
2. Build on VPS
3. Rebuild / redeploy the Coolify app image
4. Run `site-factory-qa ... --browser-smoke`

## Important VPS Paths

- Hermes soul: `/root/.hermes/SOUL.md`
- Project registry: `/opt/fabrika/swisswayexplorer/TOOLS_REGISTRY.md`
- Coolify app dir: `/data/coolify/applications/cnhqr11tb6zi9ee5d4iushmu`
- Backups: `/root/.hermes/backups`

## Notes

- When resuming, do not assume the local redesign is already on VPS/live.
- Check this file, then compare local repo status vs VPS repo status before deploying.

## Maintenance Rule

Update this file whenever one of these changes happens:

- live deployment or rollback
- VPS tool stack or wrapper command change
- Cloudflare / DNS / routing change
- Sanity schema, content flow, or webhook state change
- repo baseline or canonical commit change
- the "recommended next step" is no longer accurate

If a change affects current working state and `REMEMBERME.md` was not updated, treat the resume data as stale until re-verified.
