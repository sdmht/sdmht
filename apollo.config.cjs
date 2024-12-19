/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
module.exports = {
  client: {
    service: {
      name: 'sdmht',
      url: 'https://sdmht.star2000.work/api/',
      localSchemaFile: 'src/gen/schema.graphql',
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
    excludes: ['src/gen/*.ts'],
  },
}
