#!/usr/bin/env node
import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('./.env', 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k,...v] = l.split('='); return [k, v.join('=')]; })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  token: env.SANITY_WRITE_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
});

const guideId = 'drafts.geneva-guide-001';
const publishedId = 'geneva-guide-001';
const G = '✈️';

// 1. Fetch the draft
console.log(`${G} Fetching draft: ${guideId}`);
const draft = await client.getDocument(guideId);
if (!draft) {
  console.error('Draft not found! Run sanity-geneva.mjs first.');
  process.exit(1);
}
console.log(`  Title: ${draft.title}`);
console.log(`  Body blocks: ${draft.body?.length || 0}`);

// 2. Create the PUBLISHED version (remove "drafts." prefix)
// Also remove _createdAt, _updatedAt, _rev which are draft-specific
const published = {
  _id: publishedId,
  _type: draft._type,
  title: draft.title,
  slug: draft.slug,
  destination: draft.destination,
  category: draft.category,
  difficultyLevel: draft.difficultyLevel,
  status: 'published',
  excerpt: draft.excerpt,
  body: draft.body,
  seo: draft.seo,
  publishedAt: new Date().toISOString(),
  relatedGuides: draft.relatedGuides,
};

console.log(`\n${G} Creating published version: ${publishedId}`);
await client.createOrReplace(published);
console.log(`  Created/published: ${publishedId}`);

// 3. Delete the draft
console.log(`\n${G} Deleting draft: ${guideId}`);
await client.delete(guideId);
console.log(`  Draft deleted`);

// 4. Verify
const verified = await client.getDocument(publishedId);
console.log(`\n${G} Verified: ${verified.title}`);
console.log(`  Status: ${verified.status}`);
console.log(`  URL: https://swisswayexplorer.com/guides/${verified.slug.current}`);
console.log(`\n✅ Geneva guide LIVE!`);
