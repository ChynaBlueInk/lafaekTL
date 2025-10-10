// keystatic.config.ts
import { config, collection, fields, type Config } from "@keystatic/core";

// Read all GitHub OAuth envs Keystatic needs for "github" storage:
const owner = process.env.KEYSTATIC_GITHUB_OWNER;
const repo = process.env.KEYSTATIC_GITHUB_REPO;
const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
const appSecret = process.env.KEYSTATIC_SECRET;

// Check if all GitHub-related environment variables are available
const githubReady =
  !!owner && !!repo && !!clientId && !!clientSecret && !!appSecret;

// Switch between GitHub storage (for live) and local (for dev)
const storage: Config["storage"] = githubReady
  ? {
      kind: "github",
      repo: { owner: owner!, name: repo! },
      // no branch here; Keystatic uses the repo's default branch
    }
  : { kind: "local" };


export default config({
  storage,
  ui: {
    brand: {
      name: "Lafaek CMS",
    },
  },
  collections: {
    our_team: collection({
      label: "Our Team",
      path: "content/our-team/*",
      format: { data: "yaml" },
      slugField: "name",
      schema: {
        name: fields.text({ label: "Name", validation: { isRequired: true } }),
        role: fields.text({
          label: "Role (EN)",
          validation: { isRequired: true },
        }),
        roleTet: fields.text({ label: "Kargu (Tetun)" }),
        started: fields.text({ label: "Started (year)" }),
        photoUrl: fields.url({
          label: "Photo URL (S3)",
          description: "Use the uploader to get this URL",
          validation: { isRequired: true },
        }),
        sketchUrl: fields.url({ label: "Sketch URL (S3)" }),
        bio: fields.text({ label: "Bio (EN)", multiline: true }),
        bioTet: fields.text({ label: "Bio (Tetun)", multiline: true }),
      },
    }),
  },
});
