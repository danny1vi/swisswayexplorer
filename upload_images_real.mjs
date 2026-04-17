import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const token = "skreJV9rW8qt3Z54Me3d3xdXWL1vEhhtZGg3oZl6mRFLxdMh1bSHkNyf9BctPInRaSbkqb8IkOVP2NB4NrL0fGdpg124a45owaubNRQrAYmTLMwTx2MTan79QSnq7rIkk8H4FbHa64j56nBZa0jXRli9l7iLqP0XjpmnS4T1Se5TkqwaHrPq";
const projectId = "lxmhb5oh";
const dataset = "production";
const apiVersion = "2025-01-01";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const files = [
  { path: "/tmp/geneva_hero.jpg", title: "Geneva Hero Image", base: "hero" },
  { path: "/tmp/geneva_map.jpg", title: "Geneva Location Map", base: "map" },
  { path: "/tmp/geneva_best.jpg", title: "What Geneva Is Best For", base: "best" },
  { path: "/tmp/geneva_who.jpg", title: "Who Should Stay in Geneva", base: "who" },
  { path: "/tmp/geneva_itinerary.jpg", title: "How Geneva Fits Into Switzerland Itinerary", base: "itinerary" },
];

const results = {};

for (const { path, title, base } of files) {
  try {
    const bytes = await readFile(path);
    const ext = path.endsWith(".png") ? "png" : "jpg";
    const contentType = ext === "png" ? "image/png" : "image/jpeg";
    const asset = await client.assets.upload("image", bytes, {
      filename: `${base}.${ext}`,
      contentType,
      title,
    });
    results[base] = asset._id;
    console.log(`OK ${base} -> ${asset._id}`);
  } catch (e) {
    console.error(`FAIL ${base}: ${e.message}`);
  }
}

console.log(JSON.stringify(results, null, 2));
