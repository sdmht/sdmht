import { InMemoryCache } from '@apollo/client/cache/index.js'
import type { ApolloClientOptions } from '@apollo/client/core'
import { split } from '@apollo/client/link/core'
import { createHttpLink } from '@apollo/client/link/http/index.js'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { Kind, OperationTypeNode } from 'graphql'
import { createClient } from 'graphql-ws'

export /* async */ function getClientOptions() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /* {app, router, ...} options?: Partial<BootFileParams> ,*/
  let domain = 'sdmht.star2000.work'
  try {
    if (process.env.BACKEND) domain = process.env.BACKEND
  } catch {}
  const tls =
    domain.includes('127.0.0.') || domain.includes('localhost') ? '' : 's'
  const httpLink = createHttpLink({
    uri:
      // Change to your graphql endpoint.
      `http${tls}://${domain}/api/`,
  })

  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url:
        // Change to your graphql endpoint.
        `ws${tls}://${domain}/api/`,
      // If you have authentication, you can utilize connectionParams:
      /*
      connectionParams: () => {
        const session = getSession(); // Change to your way of getting the session.
        if (!session) {
          return {};
        }

        return {
          Authorization: `Bearer ${session.token}`,
        };
      },
      */
    })
  )

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      )
    },
    subscriptionLink,
    httpLink
  )

  return <ApolloClientOptions<unknown>>Object.assign(
    // General options.
    <ApolloClientOptions<unknown>>{
      link,

      cache: new InMemoryCache(),
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
