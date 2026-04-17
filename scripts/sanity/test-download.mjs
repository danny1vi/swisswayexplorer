import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const SANITY_WRITE_TOKEN = env.match(/SANITY_WRITE_TOKEN=(.+)/)?.[1]?.trim();

const client = createClient({
  projectId: 'lxmhb5oh',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Test if we can upload a small test asset
const testImagePath = '/tmp/swissway-images/test.jpg';

// Try to download image
const imageUrls = [
  'http://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-15%2F5d073eb2-9d5c-4b55-9b76-6e39335732f7_aigc.jpeg',
];

for (const url of imageUrls) {
  console.log('Trying:', url);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    console.log('Status:', response.status, response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      console.log('Size:', buffer.length);
      // Try uploading to Sanity
      const asset = await client.assets.upload('image', buffer, { filename: 'lucerne-hero.jpg', contentType: 'image/jpeg' });
      console.log('Uploaded! Asset ID:', asset._id);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}