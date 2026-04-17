const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'lxmhb5oh',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN
});

client.fetch(`*[_type == 'guide' && !(_id match 'drafts.')] | order(title asc) {
  title,
  slug,
  category,
  body[_type == "block" && style == "h2"] { children[0].text }
}`).then(docs => {
  docs.forEach(d => console.log(JSON.stringify(d, null, 2)));
}).catch(e => console.error(e.message));
