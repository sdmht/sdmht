import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  errorsOnly: true,
  schema: 'https://sdmht.star2000.work/api/',
  generates: {
    'src/gen/introspection.json': {
      plugins: ['introspection'],
    },
    'src/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        includeIntrospectionTypes: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
