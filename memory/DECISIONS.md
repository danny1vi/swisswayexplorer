# Decisions Log

## 2026-04-05
- Adopted reusable Astro scaffold as the pilot baseline.
- Deferred Sanity integration to the next phase.
- Kept dependencies unchanged for a low-risk rollout.
- Kept `swisswayexplorer.com` as the pilot domain.
- Standardized the target stack as `Astro + Sanity + Coolify`.
- Applied the Cloudflare cutover.
- Set the apex `A` record to `46.224.174.32`.
- Pointed `www` to the apex domain with `CNAME`.
- Removed the `AAAA` record.
- Verified SSL/TLS mode as `Full (strict)`.
- Kept `Always Use HTTPS` enabled.
- Added a dedicated `www` route on the Coolify and Traefik side.
- Removed WordPress and Hostinger from the web origin path.
- Kept mail records on the Hostinger side as `DNS only`.

## 2026-04-13
- Decided to integrate `seo-research-mcp` as a research-only editorial input, not as a production runtime dependency.
- Added a local SEO brief pipeline scaffold under `docs/`, `memory/`, and `scripts/seo/`.
- Kept the first integration phase schema-compatible with the current `destination` and `guide` Sanity documents.

## 2026-04-14
- Switched SwissWayExplorer content-bearing routes from static generation to Astro Node SSR with `prerender = false` on Sanity-backed pages.
- Kept informational utility pages prerendered.
- Made request-time Sanity reads bypass the CDN to reduce propagation lag after publish.
- Docker runtime now serves the Astro Node server instead of nginx static files.

## 2026-04-15
- Rejected Coolify Dockerfile deployment for production because Coolify's BuildKit invocation fails with `--network coolify` on this server.
- Standardized the production runtime target as `Nixpacks + Astro Node SSR` with `npm run start` serving `dist/server/entry.mjs`.
- Standardized Sanity editorial ingestion on a shared script that supports both `draft` and direct `publish` modes from the same JSON contract.
- Extended `guide` and `destination` content models to support gallery images and inline body image blocks, plus a URL-to-Sanity asset upload helper script.
