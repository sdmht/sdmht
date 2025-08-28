import type { CodegenConfig } from '@graphql-codegen/cli'
const tls =
  process.env.BACKEND?.includes('127.0.0.') || process.env.BACKEND?.includes('localhost') ? '' : 's'
const domain = process.env.BACKEND || 'sdmht-origin.star2000.work'
const config: CodegenConfig = {
  overwrite: true,
  errorsOnly: true,
  schema: `http${tls}://${domain}/api/`,
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
