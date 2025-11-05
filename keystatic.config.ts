import { config, fields, collection } from '@keystatic/core';

export default config({
  ui: {
    // where the admin UI lives
    path: '/keystatic',
    brand: {
      name: 'Lafaek Admin',
    },
  },
  storage: {
    kind: 'github',
    // e.g. "ChynaBlueInk/lafaekTL"
    repo: `${process.env.KEYSTATIC_GITHUB_OWNER || 'ChynaBlueInk'}/${process.env.KEYSTATIC_GITHUB_REPO || 'lafaekTL'}`,
    branch: process.env.KEYSTATIC_GITHUB_BRANCH || 'main',

    // OAuth via GitHub App:
    appSlug: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,

    // Local PAT fallback (optional):
    // token: process.env.KEYSTATIC_GITHUB_PAT,
  },

  // --- Collections ---
  collections: {
    'our-team': collection({
      label: 'Our Team',
      path: 'content/our-team/*',
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        bio: fields.document({
          label: 'Bio',
          formatting: true,
          links: true,
          dividers: true,
        }),
        photo: fields.image({ label: 'Photo', directory: 'public/uploads/our-team' }),
        order: fields.integer({ label: 'Sort Order', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible', defaultValue: true })
      }
    }),

    // Add more collections when ready:
    // news, impact stories, gallery, pdfs, etc.
  },
});
