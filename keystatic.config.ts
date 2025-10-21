// keystatic.config.ts
import { config, collection, fields } from '@keystatic/core';

// ❌ Remove the hasGithubEnvs branching (browser sees non-NEXT_PUBLIC envs as undefined)
// const hasGithubEnvs = ...

export default config({
  ui: {
    brand: { name: 'Lafaek CMS' },
  },

  // ✅ Always use GitHub storage; the UI will call /api/keystatic for auth
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.KEYSTATIC_GITHUB_OWNER!, // server env read by API
      name: process.env.KEYSTATIC_GITHUB_REPO!,   // server env read by API
    },
    branchPrefix: 'keystatic/',
    // (Optional) branch: 'main', // if you want to pin writes to main
  },

  collections: {
    our_team: collection({
      label: 'Our Team',
      path: 'content/our-team/*',
      format: { data: 'yaml' },
      slugField: 'name',
      schema: {
        name:     fields.text({ label: 'Name', validation: { isRequired: true } }),
        role:     fields.text({ label: 'Role (EN)', validation: { isRequired: true } }),
        roleTet:  fields.text({ label: 'Kargu (Tetun)' }),
        started:  fields.text({ label: 'Started (year)' }),
        photoUrl: fields.url({
          label: 'Photo URL (S3)',
          description: 'Use the uploader to get this URL',
          validation: { isRequired: true },
        }),
        sketchUrl: fields.url({ label: 'Sketch URL (S3)' }),
        bio:     fields.text({ label: 'Bio (EN)', multiline: true }),
        bioTet:  fields.text({ label: 'Bio (Tetun)', multiline: true }),
      },
    }),
  },
});
