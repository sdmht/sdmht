/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
const tls =
  process.env.BACKEND?.includes('127.0.0.') || process.env.BACKEND?.includes('localhost') ? '' : 's'
const domain = process.env.BACKEND || 'sdmht-origin.star2000.work'
module.exports = {
  client: {
    service: {
      name: 'sdmht',
      url: `http${tls}://${domain}/api/`,
      localSchemaFile: 'src/schema.graphql',
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
    excludes: ['src/gen/*.ts'],
  },
}
