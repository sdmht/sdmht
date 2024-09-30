import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  watch: true,
  overwrite: true,
  schema: 'src/gen/introspection.json',
  documents: ['src/**/*.vue', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/gen/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
