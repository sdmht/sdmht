/* eslint-disable */
import * as types from './graphql'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
  '\n      subscription heartbeat($uid: String!) {\n        heartbeat(uid: $uid)\n      }\n    ':
    types.HeartbeatDocument,
  '\n      subscription onlineCount {\n        onlineCount\n      }\n    ':
    types.OnlineCountDocument,
  '\n        subscription matchOpponent(\n          $uid: String!\n          $size: Int!\n          $version: String!\n        ) {\n          matchOpponent(uid: $uid, size: $size, version: $version)\n        }\n      ':
    types.MatchOpponentDocument,
  '\n                subscription sendData($to: String!, $data: JSON!) {\n                  sendData(to: $to, data: $data)\n                }\n              ':
    types.SendDataDocument,
  '\n              subscription listenAlive($uid: String!) {\n                listenAlive(uid: $uid)\n              }\n            ':
    types.ListenAliveDocument,
}

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n      subscription heartbeat($uid: String!) {\n        heartbeat(uid: $uid)\n      }\n    ',
): (typeof documents)['\n      subscription heartbeat($uid: String!) {\n        heartbeat(uid: $uid)\n      }\n    ']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n      subscription onlineCount {\n        onlineCount\n      }\n    ',
): (typeof documents)['\n      subscription onlineCount {\n        onlineCount\n      }\n    ']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n        subscription matchOpponent(\n          $uid: String!\n          $size: Int!\n          $version: String!\n        ) {\n          matchOpponent(uid: $uid, size: $size, version: $version)\n        }\n      ',
): (typeof documents)['\n        subscription matchOpponent(\n          $uid: String!\n          $size: Int!\n          $version: String!\n        ) {\n          matchOpponent(uid: $uid, size: $size, version: $version)\n        }\n      ']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n                subscription sendData($to: String!, $data: JSON!) {\n                  sendData(to: $to, data: $data)\n                }\n              ',
): (typeof documents)['\n                subscription sendData($to: String!, $data: JSON!) {\n                  sendData(to: $to, data: $data)\n                }\n              ']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n              subscription listenAlive($uid: String!) {\n                listenAlive(uid: $uid)\n              }\n            ',
): (typeof documents)['\n              subscription listenAlive($uid: String!) {\n                listenAlive(uid: $uid)\n              }\n            ']

export function gql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
