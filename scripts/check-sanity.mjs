import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_READ_TOKEN;

if (!projectId) {
  console.error("Missing SANITY_PROJECT_ID.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "published",
});

const [siteSettings, pageHome, destinations, guides] = await Promise.all([
  client.fetch(`count(*[_type == "siteSettings"])`),
  client.fetch(`count(*[_type == "pageHome"])`),
  client.fetch(`*[_type == "destination"] | order(title asc){title, "slug": slug.current}[0...10]`),
  client.fetch(`*[_type == "guide"] | order(title asc){title, "slug": slug.current}[0...10]`),
]);

console.log(
  JSON.stringify(
    {
      projectId,
      dataset,
      apiVersion,
      counts: {
        siteSettings,
        pageHome,
        destinations: destinations.length,
        guides: guides.length,
      },
      sampleDestinations: destinations,
      sampleGuides: guides,
    },
    null,
    2
  )
);
