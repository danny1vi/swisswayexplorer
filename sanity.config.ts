import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  projectId: 'lxmhb5oh',
  dataset: 'production',
  title: 'swisswayexplorer',
  schema: {
    types: schemaTypes,
  },
})
