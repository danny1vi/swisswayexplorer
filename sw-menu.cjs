const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'lxmhb5oh',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN
});

const slugs = [
  '7-day-switzerland-route-basics',
  'lucerne-vs-interlaken-choosing-your-switzerland-base',
  'seasonal-planning-spring-vs-summer',
  'swiss-transport-pass-quick-decision-guide'
];

async function main() {
  for (const s of slugs) {
    const doc = await client.fetch(
      '*[_type=="guide" && slug.current==$s && !(_id match "drafts.")][0]{title}',
      { s }
    );
    const headings = await client.fetch(
      '*[_type=="guide" && slug.current==$s && !(_id match "drafts.")][0].body[style=="h2"].children[0].text',
      { s }
    );
    console.log(JSON.stringify({ title: doc ? doc.title : s, headings }));
  }
}
main().catch(e => console.error(e.message));
