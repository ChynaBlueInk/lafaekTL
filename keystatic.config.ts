// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  ui: {
    // No `path` here — your Next.js page at /keystatic controls the route
    brand: { name: 'Lafaek Admin' },
  },

  // --- GitHub storage via GitHub App (OAuth) ---
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.KEYSTATIC_GITHUB_OWNER || 'ChynaBlueInk',
      name: process.env.KEYSTATIC_GITHUB_REPO || 'lafaekTL',
    },
    // NOTE: do NOT add `branch` here; your installed types don't include it.

    // Expected object shape: { envName, value }
    appSlug: {
      envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
      value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG, // e.g., "lafaek-keystatic" (lowercase)
    },
    clientId: {
      envName: 'KEYSTATIC_GITHUB_CLIENT_ID',
      value: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    },
    clientSecret: {
      envName: 'KEYSTATIC_GITHUB_CLIENT_SECRET',
      value: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    },
    // Optional PAT fallback (leave commented while using OAuth):
    // token: {
    //   envName: 'KEYSTATIC_GITHUB_PAT',
    //   value: process.env.KEYSTATIC_GITHUB_PAT,
    // },
  },

  // --- Collections ---
  collections: {
    'our-team': collection({
      label: 'Our Team',
      path: 'content/our-team/*',

      // REQUIRED by your current @keystatic/core types:
      slugField: 'name',

      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        bio: fields.document({
          label: 'Bio',
          formatting: true,
          links: true,
          dividers: true,
        }),
        photo: fields.image({
          label: 'Photo',
          directory: 'public/uploads/our-team',
        }),
        order: fields.integer({ label: 'Sort Order', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible', defaultValue: true }),
      },
    }),
  },
});
