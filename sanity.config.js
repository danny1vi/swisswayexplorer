import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes/index.js";
import { structure } from "./sanity/structure.js";

export default defineConfig({
  projectId: "lxmhb5oh",
  dataset: "production",
  title: "swisswayexplorer",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
