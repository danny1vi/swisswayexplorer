import { createClient } from "@sanity/client";

const projectId = import.meta.env.SANITY_PROJECT_ID || "";
const dataset = import.meta.env.SANITY_DATASET || "production";
const apiVersion = import.meta.env.SANITY_API_VERSION || "2025-01-01";
const token = import.meta.env.SANITY_READ_TOKEN || import.meta.env.SANITY_WRITE_TOKEN;
const useCdn = !token;

export const hasSanityConfig = Boolean(projectId);

const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn,
  token,
  perspective: "published",
});

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    const data = await client.fetch<T>(query, params);
    return (data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export { client as sanityClient };
