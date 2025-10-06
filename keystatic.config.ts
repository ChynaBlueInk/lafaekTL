// keystatic.config.ts
import { config, collection, fields } from '@keystatic/core';

const isProd = process.env.NODE_ENV === 'production';

export default config({
  // Local files in dev; GitHub in production (token comes from env)
  storage: isProd
    ? {
        kind: 'github',
        repo: {
          owner: process.env.KEYSTATIC_GITHUB_OWNER!, // "ChynaBlueInk"
          name: process.env.KEYSTATIC_GITHUB_REPO!,   // "lafaekTL"
        },
        // no 'token' or 'branch' here; Keystatic reads KEYSTATIC_GITHUB_TOKEN and uses the repo's default branch
      }
    : { kind: 'local' },

  ui: { brand: { name: 'Lafaek Editor' } },

  collections: {
    our_team: collection({
      label: 'Our Team',
      path: 'content/our-team/*',
      format: { data: 'yaml' }, // store all fields in YAML frontmatter
      slugField: 'name',
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        role: fields.text({ label: 'Role (EN)', validation: { isRequired: true } }),
        roleTet: fields.text({ label: 'Kargu (Tetun)' }),
        started: fields.text({ label: 'Started (year)' }),
        photoUrl: fields.url({
          label: 'Photo URL (S3)',
          description: 'Use “Upload to S3” (drawer) then paste / auto-fill.',
          validation: { isRequired: true },
        }),
        sketchUrl: fields.url({
          label: 'Sketch URL (S3)',
          description: 'Optional.',
        }),
        bio: fields.text({ label: 'Bio (EN)', multiline: true }),
        bioTet: fields.text({ label: 'Bio (Tetun)', multiline: true }),
      },
    }),
  },
});
