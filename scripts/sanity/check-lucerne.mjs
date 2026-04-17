import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const raw = readFileSync('scripts/sanity/lucerne-images-input.json', 'utf8');
const payload = JSON.parse(raw);
const documentId = payload.documentId;

// Extract token from .env manually
const env = readFileSync('.env', 'utf8');
const SANITY_WRITE_TOKEN = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();
const SANITY_PROJECT_ID = env.match(/SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Check document
const result = await client.fetch(`*[_id == $id]{_id, _type, title, slug}`, { id: documentId });
console.log('Document:', JSON.stringify(result, null, 2));

// Fetch list of all destinations
const all = await client.fetch(`*[_type == "destination"][0...5]{_id, title, slug}`);
console.log('All destinations:', JSON.stringify(all, null, 2));