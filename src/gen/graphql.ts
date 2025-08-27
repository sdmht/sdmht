/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DOMHighResTimeStamp: { input: any; output: any }
  JSON: { input: any; output: any }
  Time: { input: any; output: any }
  Void: { input: any; output: any }
}

export type Mutation = {
  __typename?: 'Mutation'
  addSubscription?: Maybe<Scalars['Void']['output']>
}

export type MutationAddSubscriptionArgs = {
  subscription: PushSubscription
}

export type PushSubscription = {
  endpoint: Scalars['String']['input']
  expirationTime?: InputMaybe<Scalars['DOMHighResTimeStamp']['input']>
  keys: PushSubscriptionKeys
}

export type PushSubscriptionKeys = {
  auth: Scalars['String']['input']
  p256dh: Scalars['String']['input']
}

export type Query = {
  __typename?: 'Query'
  time: Scalars['Time']['output']
}

export type Subscription = {
  __typename?: 'Subscription'
  heartbeat?: Maybe<Scalars['Void']['output']>
  listenAlive?: Maybe<Scalars['Void']['output']>
  matchOpponent: Scalars['JSON']['output']
  onlineCount: Scalars['Int']['output']
  sendData?: Maybe<Scalars['Void']['output']>
  time: Scalars['Time']['output']
}

export type SubscriptionHeartbeatArgs = {
  uid: Scalars['String']['input']
}

export type SubscriptionListenAliveArgs = {
  uid: Scalars['String']['input']
}

export type SubscriptionMatchOpponentArgs = {
  size?: Scalars['Int']['input']
  uid: Scalars['String']['input']
  version?: Scalars['String']['input']
}

export type SubscriptionSendDataArgs = {
  data: Scalars['JSON']['input']
  to: Scalars['String']['input']
}

export type HeartbeatSubscriptionVariables = Exact<{
  uid: Scalars['String']['input']
}>

export type HeartbeatSubscription = {
  __typename?: 'Subscription'
  heartbeat?: any | null
}

export type OnlineCountSubscriptionVariables = Exact<{ [key: string]: never }>

export type OnlineCountSubscription = {
  __typename?: 'Subscription'
  onlineCount: number
}

export type MatchOpponentSubscriptionVariables = Exact<{
  uid: Scalars['String']['input']
  size: Scalars['Int']['input']
  version: Scalars['String']['input']
}>

export type MatchOpponentSubscription = {
  __typename?: 'Subscription'
  matchOpponent: any
}

export type SendDataSubscriptionVariables = Exact<{
  to: Scalars['String']['input']
  data: Scalars['JSON']['input']
}>

export type SendDataSubscription = {
  __typename?: 'Subscription'
  sendData?: any | null
}

export type ListenAliveSubscriptionVariables = Exact<{
  uid: Scalars['String']['input']
}>

export type ListenAliveSubscription = {
  __typename?: 'Subscription'
  listenAlive?: any | null
}

export const HeartbeatDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'heartbeat' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'uid' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'heartbeat' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uid' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HeartbeatSubscription,
  HeartbeatSubscriptionVariables
>
export const OnlineCountDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'onlineCount' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'onlineCount' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OnlineCountSubscription,
  OnlineCountSubscriptionVariables
>
export const MatchOpponentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'matchOpponent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'uid' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'size' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'version' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'matchOpponent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uid' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'size' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'size' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'version' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'version' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MatchOpponentSubscription,
  MatchOpponentSubscriptionVariables
>
export const SendDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'sendData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'to' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'JSON' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sendData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'to' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'to' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SendDataSubscription,
  SendDataSubscriptionVariables
>
export const ListenAliveDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'listenAlive' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'uid' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listenAlive' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uid' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uid' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListenAliveSubscription,
  ListenAliveSubscriptionVariables
>
