// keystatic.config.ts
import { config, collection, fields } from '@keystatic/core';

const hasGithubEnvs =
  !!process.env.KEYSTATIC_GITHUB_OWNER &&
  !!process.env.KEYSTATIC_GITHUB_REPO &&
  !!process.env.KEYSTATIC_SECRET &&
  !!process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

export default config({
  ui: {
    brand: { name: 'Lafaek CMS' },
  },

  // Prod: GitHub (OAuth handled via /api/keystatic route + envs)
  // Dev:  Local (so the UI always renders)
  storage: hasGithubEnvs
    ? {
        kind: 'github',
        repo: {
          owner: process.env.KEYSTATIC_GITHUB_OWNER!,
          name: process.env.KEYSTATIC_GITHUB_REPO!,
        },
        branchPrefix: 'keystatic/',
      }
    : { kind: 'local' },

  // ── UPDATED: match live fields/labels and YAML data files ───────────────────
  collections: {
    our_team: collection({
      label: 'Our Team',
      path: 'content/our-team/*',
      format: { data: 'yaml' }, // live site uses YAML for entries
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
