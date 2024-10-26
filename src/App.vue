<template>
  <router-view />
  <span class="absolute-bottom bg-dark text-white" style="width: fit-content">
    当前版本：{{ packageInfo.version }}；在线人数：{{ 在线人数 }}
  </span>
  <pwa-install></pwa-install>
</template>

<script setup lang="ts">
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import '@khmyznikov/pwa-install'
import { provideApolloClient } from '@vue/apollo-composable'
import packageInfo from 'app/package.json'
import { Kind, OperationTypeNode } from 'graphql'
import { createClient } from 'graphql-ws'
import { 在线人数, 开始心跳, 订阅在线人数 } from 'src/utils/在线'

const httpLink = new HttpLink({
  uri: 'https://sdmht.star2000.work/api/',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://sdmht.star2000.work/api/',
  })
)
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    )
  },
  wsLink,
  httpLink
)
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
provideApolloClient(apolloClient)
开始心跳()
订阅在线人数()
defineOptions({
  name: 'App',
})
if ('serviceWorker' in navigator) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      location.reload()
      refreshing = true
    }
  })
}
</script>
