// keystatic.config.ts
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'Lafaek Editor' } },
  collections: {
    our_team: collection({
      label: 'Our Team',
      path: 'content/our-team/*',
      // Store ALL fields in front-matter (no file body)
      format: { data: 'yaml' },
      // Filenames/slugs come from this field
      slugField: 'name',
      schema: {
        name: fields.text({
          label: 'Name',
          validation: { isRequired: true },
        }),
        role: fields.text({
          label: 'Role (EN)',
          validation: { isRequired: true },
        }),
        roleTet: fields.text({
          label: 'Kargu (Tetun)',
        }),
        started: fields.text({
          label: 'Started (year)',
        }),
        photoUrl: fields.url({
          label: 'Photo URL (S3)',
          description:
            'Upload at /uploader (choose “our-team”), then paste the URL here.',
          validation: { isRequired: true },
        }),
        sketchUrl: fields.url({
          label: 'Sketch URL (S3)',
          description:
            'Optional. Upload at /uploader (choose “our-team”), then paste the URL here.',
        }),
        bio: fields.text({
          label: 'Bio (EN)',
          multiline: true,
        }),
        bioTet: fields.text({
          label: 'Bio (Tetun)',
          multiline: true,
        }),
      },
    }),
  },
});
