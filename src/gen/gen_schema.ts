import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  errorsOnly: true,
  schema: 'https://sdmht.star2000.work/api/',
  generates: {
    'src/gen/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
