import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  watch: true,
  schema: 'src/gen/schema.graphql',
  documents: ['src/**/*.vue', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/gen/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
