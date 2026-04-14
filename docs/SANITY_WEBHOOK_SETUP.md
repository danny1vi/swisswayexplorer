# Sanity -> Coolify Rebuild Webhook

Deprecated for normal content edits as of 2026-04-14.

SwissWayExplorer now uses Astro's Node adapter for request-time rendering on Sanity-backed routes. Published Sanity content should appear on the next request without a rebuild.

This runbook is only needed if you explicitly want Sanity changes to trigger a full Coolify redeploy anyway.

## 1. Coolify

In Coolify, open the SwissWayExplorer application and copy the deploy webhook URL.

Store it in local automation or VPS env as:

```bash
COOLIFY_DEPLOY_HOOK_URL=https://your-coolify-domain.example/api/v1/deploy?uuid=...
COOLIFY_API_TOKEN=your-coolify-api-token
```

The Coolify API endpoint requires bearer authentication. Create the token in `Keys & Tokens -> API tokens` in Coolify and use it as `COOLIFY_API_TOKEN`.

I infer the token should have write-capable permissions because deployment is not a read-only operation. If you want the least ambiguity, create a token with broad app-management access.

Optional local verification:

```bash
npm run deploy:webhook:check
npm run deploy:webhook:trigger
```

`deploy:webhook:check` validates env and prints a redacted target plus whether bearer auth is configured. `deploy:webhook:trigger` sends the POST request with `Authorization: Bearer ...` when `COOLIFY_API_TOKEN` is set.

## 2. Sanity Webhook

In Sanity Manage -> API -> Webhooks:

- Name: `SwissWayExplorer Coolify Rebuild`
- URL: paste the Coolify deploy webhook URL
- HTTP method: `POST`
- Header: `Authorization: Bearer <COOLIFY_API_TOKEN>`
- Dataset: `production`
- Trigger on:
  - Create
  - Update
  - Delete
- Filter:

```groq
_type in ["pageHome", "destination", "guide", "siteSettings"]
```

- Projection:

```json
{
  "_id": _id,
  "_type": _type,
  "slug": slug.current,
  "updatedAt": _updatedAt
}
```

## 3. Validation

After saving the webhook:

1. Publish a small change in Sanity.
2. Confirm Coolify starts a new deployment.
3. Run `npm run sanity:check` on the VPS if the rebuild looks suspicious.
4. Confirm the changed page returns the updated HTML after deploy completes.

## 4. Scope Notes

- The primary site content path is now SSR for Sanity-backed routes.
- Use this webhook only for infrastructure-level redeploy automation, not for routine title, body, or image edits.
- `siteSettings` should be created in Sanity so global SEO stops relying on fallback config.
