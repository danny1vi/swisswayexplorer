# Sanity -> Coolify Rebuild Webhook

SwissWayExplorer is still deployed as a static Astro build. Published Sanity content does not appear live until a new build runs.

This runbook wires Sanity publish events to the Coolify deploy webhook so the static site rebuilds automatically.

## 1. Coolify

In Coolify, open the SwissWayExplorer application and copy the deploy webhook URL.

Store it in local automation or VPS env as:

```bash
COOLIFY_DEPLOY_HOOK_URL=https://your-coolify-domain.example/api/v1/deploy?uuid=...
```

Optional local verification:

```bash
npm run deploy:webhook:check
npm run deploy:webhook:trigger
```

`deploy:webhook:check` only validates env and prints a redacted target. `deploy:webhook:trigger` sends the POST request.

## 2. Sanity Webhook

In Sanity Manage -> API -> Webhooks:

- Name: `SwissWayExplorer Coolify Rebuild`
- URL: paste the Coolify deploy webhook URL
- HTTP method: `POST`
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

- Keep the site static for now. The current content model and traffic profile do not justify SSR complexity yet.
- If rebuild latency becomes a real operational problem, then re-evaluate Astro SSR.
- `siteSettings` should be created in Sanity so global SEO stops relying on fallback config.
