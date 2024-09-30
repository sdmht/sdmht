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
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any }
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  GlobalID: { input: any; output: any }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf). */
  JSON: { input: any; output: any }
  Upload: { input: any; output: any }
  /** Represents NULL values */
  Void: { input: any; output: any }
}

export type BoolBaseFilterLookup = {
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['Boolean']['input']>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['Boolean']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
}

export type ChangeSetFilter = {
  AND?: InputMaybe<ChangeSetFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<ChangeSetFilter>
  OR?: InputMaybe<ChangeSetFilter>
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeFilter>
  /** 创建日期 */
  createdDate?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 对象编号 */
  objectId?: InputMaybe<StrFilterLookup>
  /** 软删除记录 */
  softDeleteRecords?: InputMaybe<SoftDeleteRecordFilter>
}

export type ChangeSetInput = {
  /** 所属内容类型 */
  contentTypeId: ContentTypePartialInputOneToManyInput
  /** 创建日期 */
  createdDate?: InputMaybe<Scalars['DateTime']['input']>
  /** 对象编号 */
  objectId: Scalars['String']['input']
  /** 软删除记录 */
  softDeleteRecords?: InputMaybe<SoftDeleteRecordPartialInputManyToOneInput>
}

/** 修改集 */
export type ChangeSetNode = Node & {
  __typename?: 'ChangeSetNode'
  _Str__: Scalars['String']['output']
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建日期 */
  createdDate: Scalars['DateTime']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 对象编号 */
  objectId: Scalars['String']['output']
  /** 软删除记录 */
  softDeleteRecords: SoftDeleteRecordNodeConnection
}

/** 修改集 */
export type ChangeSetNodeSoftDeleteRecordsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<SoftDeleteRecordFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<SoftDeleteRecordOrder>
}

/** A connection to a list of items. */
export type ChangeSetNodeConnection = {
  __typename?: 'ChangeSetNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<ChangeSetNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type ChangeSetNodeEdge = {
  __typename?: 'ChangeSetNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: ChangeSetNode
}

export type ChangeSetOrder = {
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeOrder>
  /** 创建日期 */
  createdDate?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 对象编号 */
  objectId?: InputMaybe<Ordering>
  /** 软删除记录 */
  softDeleteRecords?: InputMaybe<SoftDeleteRecordOrder>
}

export type ChangeSetPartialInput = {
  /** 所属内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** 创建日期 */
  createdDate?: InputMaybe<Scalars['DateTime']['input']>
  /** 对象编号 */
  objectId?: InputMaybe<Scalars['String']['input']>
  /** 软删除记录 */
  softDeleteRecords?: InputMaybe<SoftDeleteRecordPartialInputManyToOneInput>
}

export type ChangeSetPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<ChangeSetPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<ChangeSetPartialInput>>
}

export type ChangeSetPartialInputOneToManyInput = {
  set?: InputMaybe<Scalars['ID']['input']>
  setObject?: InputMaybe<ChangeSetPartialInput>
}

/** 修改集 */
export type ChangeSetType = {
  __typename?: 'ChangeSetType'
  _Str__: Scalars['String']['output']
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建日期 */
  createdDate: Scalars['DateTime']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 对象编号 */
  objectId: Scalars['String']['output']
  /** 软删除记录 */
  softDeleteRecords: Array<SoftDeleteRecordType>
}

/** 修改集 */
export type ChangeSetTypeSoftDeleteRecordsArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
  order?: InputMaybe<SoftDeleteRecordOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type ContentTypeFilter = {
  AND?: InputMaybe<ContentTypeFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<ContentTypeFilter>
  OR?: InputMaybe<ContentTypeFilter>
  /** app label */
  appLabel?: InputMaybe<StrFilterLookup>
  /** 修改集 */
  changeset?: InputMaybe<ChangeSetFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 日志 */
  log?: InputMaybe<LogFilter>
  /** 日志记录 */
  logentry?: InputMaybe<LogEntryFilter>
  /** python 模型类名 */
  model?: InputMaybe<StrFilterLookup>
  /** 权限 */
  permission?: InputMaybe<PermissionFilter>
  /** 软删除记录 */
  softdeleterecord?: InputMaybe<SoftDeleteRecordFilter>
}

export type ContentTypeInput = {
  /** app label */
  appLabel: Scalars['String']['input']
  /** 修改集 */
  changesetSet?: InputMaybe<ChangeSetPartialInputManyToOneInput>
  /** 日志 */
  logSet?: InputMaybe<LogPartialInputManyToOneInput>
  /** 日志记录 */
  logentrySet?: InputMaybe<LogEntryPartialInputManyToOneInput>
  /** python 模型类名 */
  model: Scalars['String']['input']
  /** 权限 */
  permissionSet?: InputMaybe<PermissionPartialInputManyToOneInput>
  /** 软删除记录 */
  softdeleterecordSet?: InputMaybe<SoftDeleteRecordPartialInputManyToOneInput>
}

/** 内容类型 */
export type ContentTypeNode = Node & {
  __typename?: 'ContentTypeNode'
  _Str__: Scalars['String']['output']
  /** app label */
  appLabel: Scalars['String']['output']
  /** 修改集 */
  changesetSet: ChangeSetNodeConnection
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 日志 */
  logSet: LogNodeConnection
  /** 日志记录 */
  logentrySet: LogEntryNodeConnection
  /** python 模型类名 */
  model: Scalars['String']['output']
  /** 权限 */
  permissionSet: PermissionNodeConnection
  /** 软删除记录 */
  softdeleterecordSet: SoftDeleteRecordNodeConnection
}

/** 内容类型 */
export type ContentTypeNodeChangesetSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<ChangeSetFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ChangeSetOrder>
}

/** 内容类型 */
export type ContentTypeNodeLogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogOrder>
}

/** 内容类型 */
export type ContentTypeNodeLogentrySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogEntryFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogEntryOrder>
}

/** 内容类型 */
export type ContentTypeNodePermissionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<PermissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<PermissionOrder>
}

/** 内容类型 */
export type ContentTypeNodeSoftdeleterecordSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<SoftDeleteRecordFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<SoftDeleteRecordOrder>
}

/** A connection to a list of items. */
export type ContentTypeNodeConnection = {
  __typename?: 'ContentTypeNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<ContentTypeNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type ContentTypeNodeEdge = {
  __typename?: 'ContentTypeNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: ContentTypeNode
}

export type ContentTypeOrder = {
  /** app label */
  appLabel?: InputMaybe<Ordering>
  /** 修改集 */
  changeset?: InputMaybe<ChangeSetOrder>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 日志 */
  log?: InputMaybe<LogOrder>
  /** 日志记录 */
  logentry?: InputMaybe<LogEntryOrder>
  /** python 模型类名 */
  model?: InputMaybe<Ordering>
  /** 权限 */
  permission?: InputMaybe<PermissionOrder>
  /** 软删除记录 */
  softdeleterecord?: InputMaybe<SoftDeleteRecordOrder>
}

export type ContentTypePartialInput = {
  /** app label */
  appLabel?: InputMaybe<Scalars['String']['input']>
  /** 修改集 */
  changesetSet?: InputMaybe<ChangeSetPartialInputManyToOneInput>
  /** 日志 */
  logSet?: InputMaybe<LogPartialInputManyToOneInput>
  /** 日志记录 */
  logentrySet?: InputMaybe<LogEntryPartialInputManyToOneInput>
  /** python 模型类名 */
  model?: InputMaybe<Scalars['String']['input']>
  /** 权限 */
  permissionSet?: InputMaybe<PermissionPartialInputManyToOneInput>
  /** 软删除记录 */
  softdeleterecordSet?: InputMaybe<SoftDeleteRecordPartialInputManyToOneInput>
}

export type ContentTypePartialInputOneToManyInput = {
  set?: InputMaybe<Scalars['ID']['input']>
  setObject?: InputMaybe<ContentTypePartialInput>
}

/** 内容类型 */
export type ContentTypeType = {
  __typename?: 'ContentTypeType'
  _Str__: Scalars['String']['output']
  /** app label */
  appLabel: Scalars['String']['output']
  /** 修改集 */
  changesetSet: Array<ChangeSetType>
  /** ID */
  id: Scalars['ID']['output']
  /** 日志 */
  logSet: Array<LogType>
  /** 日志记录 */
  logentrySet: Array<LogEntryType>
  /** python 模型类名 */
  model: Scalars['String']['output']
  /** 权限 */
  permissionSet: Array<PermissionType>
  /** 软删除记录 */
  softdeleterecordSet: Array<SoftDeleteRecordType>
}

/** 内容类型 */
export type ContentTypeTypeChangesetSetArgs = {
  filters?: InputMaybe<ChangeSetFilter>
  order?: InputMaybe<ChangeSetOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 内容类型 */
export type ContentTypeTypeLogSetArgs = {
  filters?: InputMaybe<LogFilter>
  order?: InputMaybe<LogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 内容类型 */
export type ContentTypeTypeLogentrySetArgs = {
  filters?: InputMaybe<LogEntryFilter>
  order?: InputMaybe<LogEntryOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 内容类型 */
export type ContentTypeTypePermissionSetArgs = {
  filters?: InputMaybe<PermissionFilter>
  order?: InputMaybe<PermissionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 内容类型 */
export type ContentTypeTypeSoftdeleterecordSetArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
  order?: InputMaybe<SoftDeleteRecordOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type DatetimeDatetimeFilterLookup = {
  date?: InputMaybe<IntComparisonFilterLookup>
  day?: InputMaybe<IntComparisonFilterLookup>
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['DateTime']['input']>
  /** Greater than. Filter will be skipped on `null` value */
  gt?: InputMaybe<Scalars['DateTime']['input']>
  /** Greater than or equal to. Filter will be skipped on `null` value */
  gte?: InputMaybe<Scalars['DateTime']['input']>
  hour?: InputMaybe<IntComparisonFilterLookup>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['DateTime']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  isoWeekDay?: InputMaybe<IntComparisonFilterLookup>
  isoYear?: InputMaybe<IntComparisonFilterLookup>
  /** Less than. Filter will be skipped on `null` value */
  lt?: InputMaybe<Scalars['DateTime']['input']>
  /** Less than or equal to. Filter will be skipped on `null` value */
  lte?: InputMaybe<Scalars['DateTime']['input']>
  minute?: InputMaybe<IntComparisonFilterLookup>
  month?: InputMaybe<IntComparisonFilterLookup>
  quarter?: InputMaybe<IntComparisonFilterLookup>
  /** Inclusive range test (between) */
  range?: InputMaybe<DatetimeRangeLookup>
  second?: InputMaybe<IntComparisonFilterLookup>
  time?: InputMaybe<IntComparisonFilterLookup>
  week?: InputMaybe<IntComparisonFilterLookup>
  weekDay?: InputMaybe<IntComparisonFilterLookup>
  year?: InputMaybe<IntComparisonFilterLookup>
}

export type DatetimeRangeLookup = {
  end?: InputMaybe<Scalars['DateTime']['input']>
  start?: InputMaybe<Scalars['DateTime']['input']>
}

export type DjangoImageType = {
  __typename?: 'DjangoImageType'
  height: Scalars['Int']['output']
  name: Scalars['String']['output']
  path: Scalars['String']['output']
  size: Scalars['Int']['output']
  url: Scalars['String']['output']
  width: Scalars['Int']['output']
}

export type DynamicConfigurationFilter = {
  AND?: InputMaybe<DynamicConfigurationFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<DynamicConfigurationFilter>
  OR?: InputMaybe<DynamicConfigurationFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 删除日期 */
  deletedAt?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 是否公开 */
  isPublic?: InputMaybe<BoolBaseFilterLookup>
  /** 名称 */
  name?: InputMaybe<StrFilterLookup>
  /** 修改时间 */
  updatedTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 文本 */
  value?: InputMaybe<StrFilterLookup>
}

export type DynamicConfigurationInput = {
  /** 是否公开 */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>
  /** 名称 */
  name: Scalars['String']['input']
  /** 文本 */
  value: Scalars['String']['input']
}

/** 动态配置 */
export type DynamicConfigurationNode = Node & {
  __typename?: 'DynamicConfigurationNode'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 是否公开 */
  isPublic: Scalars['Boolean']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 文本 */
  value: Scalars['String']['output']
}

/** A connection to a list of items. */
export type DynamicConfigurationNodeConnection = {
  __typename?: 'DynamicConfigurationNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<DynamicConfigurationNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type DynamicConfigurationNodeEdge = {
  __typename?: 'DynamicConfigurationNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: DynamicConfigurationNode
}

export type DynamicConfigurationOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 删除日期 */
  deletedAt?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 是否公开 */
  isPublic?: InputMaybe<Ordering>
  /** 名称 */
  name?: InputMaybe<Ordering>
  /** 修改时间 */
  updatedTime?: InputMaybe<Ordering>
  /** 文本 */
  value?: InputMaybe<Ordering>
}

export type DynamicConfigurationPartialInput = {
  /** 是否公开 */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 文本 */
  value?: InputMaybe<Scalars['String']['input']>
}

/** 动态配置 */
export type DynamicConfigurationType = {
  __typename?: 'DynamicConfigurationType'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** ID */
  id: Scalars['ID']['output']
  /** 是否公开 */
  isPublic: Scalars['Boolean']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 文本 */
  value: Scalars['String']['output']
}

export type FailedExceptionMailFilter = {
  AND?: InputMaybe<FailedExceptionMailFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<FailedExceptionMailFilter>
  OR?: InputMaybe<FailedExceptionMailFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 失败原因 */
  failReason?: InputMaybe<StrFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 消息 */
  message?: InputMaybe<StrFilterLookup>
  /** 主题 */
  subject?: InputMaybe<StrFilterLookup>
}

export type FailedExceptionMailInput = {
  /** 失败原因 */
  failReason: Scalars['String']['input']
  /** 消息 */
  message: Scalars['String']['input']
  /** 主题 */
  subject: Scalars['String']['input']
}

/** 发送失败的报错邮件 */
export type FailedExceptionMailNode = Node & {
  __typename?: 'FailedExceptionMailNode'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 失败原因 */
  failReason: Scalars['String']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 消息 */
  message: Scalars['String']['output']
  /** 主题 */
  subject: Scalars['String']['output']
}

/** A connection to a list of items. */
export type FailedExceptionMailNodeConnection = {
  __typename?: 'FailedExceptionMailNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<FailedExceptionMailNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type FailedExceptionMailNodeEdge = {
  __typename?: 'FailedExceptionMailNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: FailedExceptionMailNode
}

export type FailedExceptionMailOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 失败原因 */
  failReason?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 消息 */
  message?: InputMaybe<Ordering>
  /** 主题 */
  subject?: InputMaybe<Ordering>
}

export type FailedExceptionMailPartialInput = {
  /** 失败原因 */
  failReason?: InputMaybe<Scalars['String']['input']>
  /** 消息 */
  message?: InputMaybe<Scalars['String']['input']>
  /** 主题 */
  subject?: InputMaybe<Scalars['String']['input']>
}

/** 发送失败的报错邮件 */
export type FailedExceptionMailType = {
  __typename?: 'FailedExceptionMailType'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 失败原因 */
  failReason: Scalars['String']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 消息 */
  message: Scalars['String']['output']
  /** 主题 */
  subject: Scalars['String']['output']
}

export type GroupFilter = {
  AND?: InputMaybe<GroupFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<GroupFilter>
  OR?: InputMaybe<GroupFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 名称 */
  name?: InputMaybe<StrFilterLookup>
  /** 权限 */
  permissions?: InputMaybe<PermissionFilter>
  /** 角色 */
  role?: InputMaybe<RoleFilter>
}

export type GroupInput = {
  /** 名称 */
  name: Scalars['String']['input']
  /** 权限 */
  permissions?: InputMaybe<PermissionPartialInputManyToManyInput>
  /** 角色 */
  roleSet?: InputMaybe<RolePartialInputManyToManyInput>
}

/** 权限组 */
export type GroupNode = Node & {
  __typename?: 'GroupNode'
  _Str__: Scalars['String']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 权限 */
  permissions: PermissionNodeConnection
  /** 角色 */
  roleSet: RoleNodeConnection
}

/** 权限组 */
export type GroupNodePermissionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<PermissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<PermissionOrder>
}

/** 权限组 */
export type GroupNodeRoleSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<RoleOrder>
}

/** A connection to a list of items. */
export type GroupNodeConnection = {
  __typename?: 'GroupNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<GroupNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type GroupNodeEdge = {
  __typename?: 'GroupNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: GroupNode
}

export type GroupOrder = {
  /** ID */
  id?: InputMaybe<Ordering>
  /** 名称 */
  name?: InputMaybe<Ordering>
  /** 权限 */
  permissions?: InputMaybe<PermissionOrder>
  /** 角色 */
  role?: InputMaybe<RoleOrder>
}

export type GroupPartialInput = {
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 权限 */
  permissions?: InputMaybe<PermissionPartialInputManyToManyInput>
  /** 角色 */
  roleSet?: InputMaybe<RolePartialInputManyToManyInput>
}

export type GroupPartialInputManyToManyInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<GroupPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<GroupPartialInput>>
}

/** 权限组 */
export type GroupType = {
  __typename?: 'GroupType'
  _Str__: Scalars['String']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 权限 */
  permissions: Array<PermissionType>
  /** 角色 */
  roleSet: Array<RoleType>
}

/** 权限组 */
export type GroupTypePermissionsArgs = {
  filters?: InputMaybe<PermissionFilter>
  order?: InputMaybe<PermissionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 权限组 */
export type GroupTypeRoleSetArgs = {
  filters?: InputMaybe<RoleFilter>
  order?: InputMaybe<RoleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type IdBaseFilterLookup = {
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['ID']['input']>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['ID']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
}

export type IntComparisonFilterLookup = {
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['Int']['input']>
  /** Greater than. Filter will be skipped on `null` value */
  gt?: InputMaybe<Scalars['Int']['input']>
  /** Greater than or equal to. Filter will be skipped on `null` value */
  gte?: InputMaybe<Scalars['Int']['input']>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['Int']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than. Filter will be skipped on `null` value */
  lt?: InputMaybe<Scalars['Int']['input']>
  /** Less than or equal to. Filter will be skipped on `null` value */
  lte?: InputMaybe<Scalars['Int']['input']>
  /** Inclusive range test (between) */
  range?: InputMaybe<IntRangeLookup>
}

export type IntRangeLookup = {
  end?: InputMaybe<Scalars['Int']['input']>
  start?: InputMaybe<Scalars['Int']['input']>
}

export type JsonFilterLookup = {
  /** Case-sensitive containment test. Filter will be skipped on `null` value */
  contains?: InputMaybe<Scalars['JSON']['input']>
  /** Case-sensitive ends-with. Filter will be skipped on `null` value */
  endsWith?: InputMaybe<Scalars['JSON']['input']>
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['JSON']['input']>
  /** Case-insensitive containment test. Filter will be skipped on `null` value */
  iContains?: InputMaybe<Scalars['JSON']['input']>
  /** Case-insensitive ends-with. Filter will be skipped on `null` value */
  iEndsWith?: InputMaybe<Scalars['JSON']['input']>
  /** Case-insensitive exact match. Filter will be skipped on `null` value */
  iExact?: InputMaybe<Scalars['JSON']['input']>
  /** Case-insensitive regular expression match. Filter will be skipped on `null` value */
  iRegex?: InputMaybe<Scalars['JSON']['input']>
  /** Case-insensitive starts-with. Filter will be skipped on `null` value */
  iStartsWith?: InputMaybe<Scalars['JSON']['input']>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['JSON']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Case-sensitive regular expression match. Filter will be skipped on `null` value */
  regex?: InputMaybe<Scalars['JSON']['input']>
  /** Case-sensitive starts-with. Filter will be skipped on `null` value */
  startsWith?: InputMaybe<Scalars['JSON']['input']>
}

/** CREATE:创建,UPDATE:更新,DELETE:删除 */
export enum LogActionEnum {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE',
}

export type LogActionEnumFilterLookup = {
  contains?: InputMaybe<LogActionEnum>
  endsWith?: InputMaybe<LogActionEnum>
  exact?: InputMaybe<LogActionEnum>
  gt?: InputMaybe<LogActionEnum>
  gte?: InputMaybe<LogActionEnum>
  iContains?: InputMaybe<LogActionEnum>
  iEndsWith?: InputMaybe<LogActionEnum>
  iExact?: InputMaybe<LogActionEnum>
  iRegex?: InputMaybe<Scalars['String']['input']>
  iStartsWith?: InputMaybe<LogActionEnum>
  inList?: InputMaybe<Array<LogActionEnum>>
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  lt?: InputMaybe<LogActionEnum>
  lte?: InputMaybe<LogActionEnum>
  range?: InputMaybe<Array<LogActionEnum>>
  regex?: InputMaybe<Scalars['String']['input']>
  startsWith?: InputMaybe<LogActionEnum>
}

/** ADDITION:添加,CHANGE:修改,DELETION:删除 */
export enum LogEntryActionFlagEnum {
  Addition = 'ADDITION',
  Change = 'CHANGE',
  Deletion = 'DELETION',
}

export type LogEntryActionFlagEnumFilterLookup = {
  contains?: InputMaybe<LogEntryActionFlagEnum>
  endsWith?: InputMaybe<LogEntryActionFlagEnum>
  exact?: InputMaybe<LogEntryActionFlagEnum>
  gt?: InputMaybe<LogEntryActionFlagEnum>
  gte?: InputMaybe<LogEntryActionFlagEnum>
  iContains?: InputMaybe<LogEntryActionFlagEnum>
  iEndsWith?: InputMaybe<LogEntryActionFlagEnum>
  iExact?: InputMaybe<LogEntryActionFlagEnum>
  iRegex?: InputMaybe<Scalars['String']['input']>
  iStartsWith?: InputMaybe<LogEntryActionFlagEnum>
  inList?: InputMaybe<Array<LogEntryActionFlagEnum>>
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  lt?: InputMaybe<LogEntryActionFlagEnum>
  lte?: InputMaybe<LogEntryActionFlagEnum>
  range?: InputMaybe<Array<LogEntryActionFlagEnum>>
  regex?: InputMaybe<Scalars['String']['input']>
  startsWith?: InputMaybe<LogEntryActionFlagEnum>
}

export type LogEntryFilter = {
  AND?: InputMaybe<LogEntryFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<LogEntryFilter>
  OR?: InputMaybe<LogEntryFilter>
  /** 动作标志 */
  actionFlag?: InputMaybe<LogEntryActionFlagEnumFilterLookup>
  /** 操作时间 */
  actionTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 修改消息 */
  changeMessage?: InputMaybe<StrFilterLookup>
  /** 内容类型 */
  contentType?: InputMaybe<ContentTypeFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 对象id */
  objectId?: InputMaybe<StrFilterLookup>
  /** 对象表示 */
  objectRepr?: InputMaybe<StrFilterLookup>
  /** 用户 */
  user?: InputMaybe<UserFilter>
}

export type LogEntryInput = {
  /** 动作标志 */
  actionFlag: LogEntryActionFlagEnum
  /** 修改消息 */
  changeMessage?: InputMaybe<Scalars['String']['input']>
  /** 内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** 对象id */
  objectId?: InputMaybe<Scalars['String']['input']>
  /** 对象表示 */
  objectRepr: Scalars['String']['input']
  /** 用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

/** 日志记录 */
export type LogEntryNode = Node & {
  __typename?: 'LogEntryNode'
  _Str__: Scalars['String']['output']
  /** 动作标志 */
  actionFlag: LogEntryActionFlagEnum
  /** 操作时间 */
  actionTime: Scalars['DateTime']['output']
  /** 修改消息 */
  changeMessage: Scalars['String']['output']
  /** 内容类型 */
  contentType?: Maybe<ContentTypeType>
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 对象id */
  objectId?: Maybe<Scalars['String']['output']>
  /** 对象表示 */
  objectRepr: Scalars['String']['output']
  /** 用户 */
  user: UserType
}

/** A connection to a list of items. */
export type LogEntryNodeConnection = {
  __typename?: 'LogEntryNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<LogEntryNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type LogEntryNodeEdge = {
  __typename?: 'LogEntryNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: LogEntryNode
}

export type LogEntryOrder = {
  /** 动作标志 */
  actionFlag?: InputMaybe<Ordering>
  /** 操作时间 */
  actionTime?: InputMaybe<Ordering>
  /** 修改消息 */
  changeMessage?: InputMaybe<Ordering>
  /** 内容类型 */
  contentType?: InputMaybe<ContentTypeOrder>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 对象id */
  objectId?: InputMaybe<Ordering>
  /** 对象表示 */
  objectRepr?: InputMaybe<Ordering>
  /** 用户 */
  user?: InputMaybe<UserOrder>
}

export type LogEntryPartialInput = {
  /** 动作标志 */
  actionFlag?: InputMaybe<LogEntryActionFlagEnum>
  /** 修改消息 */
  changeMessage?: InputMaybe<Scalars['String']['input']>
  /** 内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** 对象id */
  objectId?: InputMaybe<Scalars['String']['input']>
  /** 对象表示 */
  objectRepr?: InputMaybe<Scalars['String']['input']>
  /** 用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

export type LogEntryPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<LogEntryPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<LogEntryPartialInput>>
}

/** 日志记录 */
export type LogEntryType = {
  __typename?: 'LogEntryType'
  _Str__: Scalars['String']['output']
  /** 动作标志 */
  actionFlag: LogEntryActionFlagEnum
  /** 操作时间 */
  actionTime: Scalars['DateTime']['output']
  /** 修改消息 */
  changeMessage: Scalars['String']['output']
  /** 内容类型 */
  contentType?: Maybe<ContentTypeType>
  /** ID */
  id: Scalars['ID']['output']
  /** 对象id */
  objectId?: Maybe<Scalars['String']['output']>
  /** 对象表示 */
  objectRepr: Scalars['String']['output']
  /** 用户 */
  user: UserType
}

export type LogFilter = {
  AND?: InputMaybe<LogFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<LogFilter>
  OR?: InputMaybe<LogFilter>
  /** 操作 */
  action?: InputMaybe<LogActionEnumFilterLookup>
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** IP地址 */
  ip?: InputMaybe<StrFilterLookup>
  /** 操作对象 */
  objectRepr?: InputMaybe<StrFilterLookup>
  /** 所属用户 */
  user?: InputMaybe<UserFilter>
}

export type LogInput = {
  /** 操作 */
  action: LogActionEnum
  /** 所属内容类型 */
  contentTypeId: ContentTypePartialInputOneToManyInput
  /** IP地址 */
  ip: Scalars['String']['input']
  /** 操作对象 */
  objectRepr: Scalars['String']['input']
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

/** 日志 */
export type LogNode = Node & {
  __typename?: 'LogNode'
  _Str__: Scalars['String']['output']
  /** 操作 */
  action: LogActionEnum
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** IP地址 */
  ip: Scalars['String']['output']
  /** 操作对象 */
  objectRepr: Scalars['String']['output']
  /** 所属用户 */
  user: UserType
}

/** A connection to a list of items. */
export type LogNodeConnection = {
  __typename?: 'LogNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<LogNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type LogNodeEdge = {
  __typename?: 'LogNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: LogNode
}

export type LogOrder = {
  /** 操作 */
  action?: InputMaybe<Ordering>
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeOrder>
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** IP地址 */
  ip?: InputMaybe<Ordering>
  /** 操作对象 */
  objectRepr?: InputMaybe<Ordering>
  /** 所属用户 */
  user?: InputMaybe<UserOrder>
}

export type LogPartialInput = {
  /** 操作 */
  action?: InputMaybe<LogActionEnum>
  /** 所属内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** IP地址 */
  ip?: InputMaybe<Scalars['String']['input']>
  /** 操作对象 */
  objectRepr?: InputMaybe<Scalars['String']['input']>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

export type LogPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<LogPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<LogPartialInput>>
}

/** 日志 */
export type LogType = {
  __typename?: 'LogType'
  _Str__: Scalars['String']['output']
  /** 操作 */
  action: LogActionEnum
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** IP地址 */
  ip: Scalars['String']['output']
  /** 操作对象 */
  objectRepr: Scalars['String']['output']
  /** 所属用户 */
  user: UserType
}

export type Mutation = {
  __typename?: 'Mutation'
  createChangeSet: ChangeSetType
  createChangeSets: Array<ChangeSetType>
  createContentType: ContentTypeType
  createContentTypes: Array<ContentTypeType>
  createDynamicConfiguration: DynamicConfigurationType
  createDynamicConfigurations: Array<DynamicConfigurationType>
  createFailedExceptionMail: FailedExceptionMailType
  createFailedExceptionMails: Array<FailedExceptionMailType>
  createGroup: GroupType
  createGroups: Array<GroupType>
  createLog: LogType
  createLogEntry: LogEntryType
  createLogEntrys: Array<LogEntryType>
  createLogs: Array<LogType>
  createMutationLog: MutationLogType
  createMutationLogs: Array<MutationLogType>
  createMutationThrottle: MutationThrottleType
  createMutationThrottles: Array<MutationThrottleType>
  createPermission: PermissionType
  createPermissions: Array<PermissionType>
  createQueryContent: QueryContentType
  createQueryContents: Array<QueryContentType>
  createQueryLog: QueryLogType
  createQueryLogs: Array<QueryLogType>
  createRole: RoleType
  createRoles: Array<RoleType>
  createSession: SessionType
  createSessions: Array<SessionType>
  createSoftDeleteRecord: SoftDeleteRecordType
  createSoftDeleteRecords: Array<SoftDeleteRecordType>
  createUser: UserType
  createUsers: Array<UserType>
  createVerificationCode: VerificationCodeType
  createVerificationCodes: Array<VerificationCodeType>
  deleteChangeSets: Array<ChangeSetType>
  deleteContentTypes: Array<ContentTypeType>
  deleteDynamicConfigurations: Array<DynamicConfigurationType>
  deleteFailedExceptionMails: Array<FailedExceptionMailType>
  deleteGroups: Array<GroupType>
  deleteLogEntrys: Array<LogEntryType>
  deleteLogs: Array<LogType>
  deleteMutationLogs: Array<MutationLogType>
  deleteMutationThrottles: Array<MutationThrottleType>
  deletePermissions: Array<PermissionType>
  deleteQueryContents: Array<QueryContentType>
  deleteQueryLogs: Array<QueryLogType>
  deleteRoles: Array<RoleType>
  deleteSessions: Array<SessionType>
  deleteSoftDeleteRecords: Array<SoftDeleteRecordType>
  deleteUsers: Array<UserType>
  deleteVerificationCodes: Array<VerificationCodeType>
  login?: Maybe<UserType>
  logout: Scalars['Boolean']['output']
  sendVerificationEmail: Scalars['Boolean']['output']
  su: UserType
  updateChangeSets: Array<ChangeSetType>
  updateContentTypes: Array<ContentTypeType>
  updateDynamicConfigurations: Array<DynamicConfigurationType>
  updateFailedExceptionMails: Array<FailedExceptionMailType>
  updateGroups: Array<GroupType>
  updateLogEntrys: Array<LogEntryType>
  updateLogs: Array<LogType>
  updateMutationLogs: Array<MutationLogType>
  updateMutationThrottles: Array<MutationThrottleType>
  updatePermissions: Array<PermissionType>
  updateQueryContents: Array<QueryContentType>
  updateQueryLogs: Array<QueryLogType>
  updateRoles: Array<RoleType>
  updateSessions: Array<SessionType>
  updateSoftDeleteRecords: Array<SoftDeleteRecordType>
  updateUsers: Array<UserType>
  updateVerificationCodes: Array<VerificationCodeType>
  verificationEmailAuth: Scalars['Boolean']['output']
}

export type MutationCreateChangeSetArgs = {
  data: ChangeSetInput
}

export type MutationCreateChangeSetsArgs = {
  data: Array<ChangeSetInput>
  filters?: InputMaybe<ChangeSetFilter>
}

export type MutationCreateContentTypeArgs = {
  data: ContentTypeInput
}

export type MutationCreateContentTypesArgs = {
  data: Array<ContentTypeInput>
  filters?: InputMaybe<ContentTypeFilter>
}

export type MutationCreateDynamicConfigurationArgs = {
  data: DynamicConfigurationInput
}

export type MutationCreateDynamicConfigurationsArgs = {
  data: Array<DynamicConfigurationInput>
  filters?: InputMaybe<DynamicConfigurationFilter>
}

export type MutationCreateFailedExceptionMailArgs = {
  data: FailedExceptionMailInput
}

export type MutationCreateFailedExceptionMailsArgs = {
  data: Array<FailedExceptionMailInput>
  filters?: InputMaybe<FailedExceptionMailFilter>
}

export type MutationCreateGroupArgs = {
  data: GroupInput
}

export type MutationCreateGroupsArgs = {
  data: Array<GroupInput>
  filters?: InputMaybe<GroupFilter>
}

export type MutationCreateLogArgs = {
  data: LogInput
}

export type MutationCreateLogEntryArgs = {
  data: LogEntryInput
}

export type MutationCreateLogEntrysArgs = {
  data: Array<LogEntryInput>
  filters?: InputMaybe<LogEntryFilter>
}

export type MutationCreateLogsArgs = {
  data: Array<LogInput>
  filters?: InputMaybe<LogFilter>
}

export type MutationCreateMutationLogArgs = {
  data: MutationLogInput
}

export type MutationCreateMutationLogsArgs = {
  data: Array<MutationLogInput>
  filters?: InputMaybe<MutationLogFilter>
}

export type MutationCreateMutationThrottleArgs = {
  data: MutationThrottleInput
}

export type MutationCreateMutationThrottlesArgs = {
  data: Array<MutationThrottleInput>
  filters?: InputMaybe<MutationThrottleFilter>
}

export type MutationCreatePermissionArgs = {
  data: PermissionInput
}

export type MutationCreatePermissionsArgs = {
  data: Array<PermissionInput>
  filters?: InputMaybe<PermissionFilter>
}

export type MutationCreateQueryContentArgs = {
  data: QueryContentInput
}

export type MutationCreateQueryContentsArgs = {
  data: Array<QueryContentInput>
  filters?: InputMaybe<QueryContentFilter>
}

export type MutationCreateQueryLogArgs = {
  data: QueryLogInput
}

export type MutationCreateQueryLogsArgs = {
  data: Array<QueryLogInput>
  filters?: InputMaybe<QueryLogFilter>
}

export type MutationCreateRoleArgs = {
  data: RoleInput
}

export type MutationCreateRolesArgs = {
  data: Array<RoleInput>
  filters?: InputMaybe<RoleFilter>
}

export type MutationCreateSessionArgs = {
  data: SessionInput
}

export type MutationCreateSessionsArgs = {
  data: Array<SessionInput>
  filters?: InputMaybe<SessionFilter>
}

export type MutationCreateSoftDeleteRecordArgs = {
  data: SoftDeleteRecordInput
}

export type MutationCreateSoftDeleteRecordsArgs = {
  data: Array<SoftDeleteRecordInput>
  filters?: InputMaybe<SoftDeleteRecordFilter>
}

export type MutationCreateUserArgs = {
  data: UserInput
}

export type MutationCreateUsersArgs = {
  data: Array<UserInput>
  filters?: InputMaybe<UserFilter>
}

export type MutationCreateVerificationCodeArgs = {
  data: VerificationCodeInput
}

export type MutationCreateVerificationCodesArgs = {
  data: Array<VerificationCodeInput>
  filters?: InputMaybe<VerificationCodeFilter>
}

export type MutationDeleteChangeSetsArgs = {
  filters?: InputMaybe<ChangeSetFilter>
}

export type MutationDeleteContentTypesArgs = {
  filters?: InputMaybe<ContentTypeFilter>
}

export type MutationDeleteDynamicConfigurationsArgs = {
  filters?: InputMaybe<DynamicConfigurationFilter>
}

export type MutationDeleteFailedExceptionMailsArgs = {
  filters?: InputMaybe<FailedExceptionMailFilter>
}

export type MutationDeleteGroupsArgs = {
  filters?: InputMaybe<GroupFilter>
}

export type MutationDeleteLogEntrysArgs = {
  filters?: InputMaybe<LogEntryFilter>
}

export type MutationDeleteLogsArgs = {
  filters?: InputMaybe<LogFilter>
}

export type MutationDeleteMutationLogsArgs = {
  filters?: InputMaybe<MutationLogFilter>
}

export type MutationDeleteMutationThrottlesArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
}

export type MutationDeletePermissionsArgs = {
  filters?: InputMaybe<PermissionFilter>
}

export type MutationDeleteQueryContentsArgs = {
  filters?: InputMaybe<QueryContentFilter>
}

export type MutationDeleteQueryLogsArgs = {
  filters?: InputMaybe<QueryLogFilter>
}

export type MutationDeleteRolesArgs = {
  filters?: InputMaybe<RoleFilter>
}

export type MutationDeleteSessionsArgs = {
  filters?: InputMaybe<SessionFilter>
}

export type MutationDeleteSoftDeleteRecordsArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
}

export type MutationDeleteUsersArgs = {
  filters?: InputMaybe<UserFilter>
}

export type MutationDeleteVerificationCodesArgs = {
  filters?: InputMaybe<VerificationCodeFilter>
}

export type MutationLoginArgs = {
  password: Scalars['String']['input']
  username: Scalars['String']['input']
}

export type MutationSendVerificationEmailArgs = {
  email: Scalars['String']['input']
}

export type MutationSuArgs = {
  username: Scalars['String']['input']
}

export type MutationUpdateChangeSetsArgs = {
  data: ChangeSetPartialInput
  filters?: InputMaybe<ChangeSetFilter>
}

export type MutationUpdateContentTypesArgs = {
  data: ContentTypePartialInput
  filters?: InputMaybe<ContentTypeFilter>
}

export type MutationUpdateDynamicConfigurationsArgs = {
  data: DynamicConfigurationPartialInput
  filters?: InputMaybe<DynamicConfigurationFilter>
}

export type MutationUpdateFailedExceptionMailsArgs = {
  data: FailedExceptionMailPartialInput
  filters?: InputMaybe<FailedExceptionMailFilter>
}

export type MutationUpdateGroupsArgs = {
  data: GroupPartialInput
  filters?: InputMaybe<GroupFilter>
}

export type MutationUpdateLogEntrysArgs = {
  data: LogEntryPartialInput
  filters?: InputMaybe<LogEntryFilter>
}

export type MutationUpdateLogsArgs = {
  data: LogPartialInput
  filters?: InputMaybe<LogFilter>
}

export type MutationUpdateMutationLogsArgs = {
  data: MutationLogPartialInput
  filters?: InputMaybe<MutationLogFilter>
}

export type MutationUpdateMutationThrottlesArgs = {
  data: MutationThrottlePartialInput
  filters?: InputMaybe<MutationThrottleFilter>
}

export type MutationUpdatePermissionsArgs = {
  data: PermissionPartialInput
  filters?: InputMaybe<PermissionFilter>
}

export type MutationUpdateQueryContentsArgs = {
  data: QueryContentPartialInput
  filters?: InputMaybe<QueryContentFilter>
}

export type MutationUpdateQueryLogsArgs = {
  data: QueryLogPartialInput
  filters?: InputMaybe<QueryLogFilter>
}

export type MutationUpdateRolesArgs = {
  data: RolePartialInput
  filters?: InputMaybe<RoleFilter>
}

export type MutationUpdateSessionsArgs = {
  data: SessionPartialInput
  filters?: InputMaybe<SessionFilter>
}

export type MutationUpdateSoftDeleteRecordsArgs = {
  data: SoftDeleteRecordPartialInput
  filters?: InputMaybe<SoftDeleteRecordFilter>
}

export type MutationUpdateUsersArgs = {
  data: UserPartialInput
  filters?: InputMaybe<UserFilter>
}

export type MutationUpdateVerificationCodesArgs = {
  data: VerificationCodePartialInput
  filters?: InputMaybe<VerificationCodeFilter>
}

export type MutationVerificationEmailAuthArgs = {
  code: Scalars['String']['input']
  email: Scalars['String']['input']
  password?: InputMaybe<Scalars['String']['input']>
}

export type MutationLogFilter = {
  AND?: InputMaybe<MutationLogFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<MutationLogFilter>
  OR?: InputMaybe<MutationLogFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 域名 */
  domain?: InputMaybe<StrFilterLookup>
  /** 错误 */
  errors?: InputMaybe<StrFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** IP */
  ip?: InputMaybe<StrFilterLookup>
  /** 所属查询内容 */
  queryContent?: InputMaybe<QueryContentFilter>
  /** 所属用户 */
  user?: InputMaybe<UserFilter>
  /** 变量 */
  variables?: InputMaybe<JsonFilterLookup>
}

export type MutationLogInput = {
  /** 域名 */
  domain: Scalars['String']['input']
  /** 错误 */
  errors?: InputMaybe<Scalars['String']['input']>
  /** IP */
  ip: Scalars['String']['input']
  /** 所属查询内容 */
  queryContentId?: InputMaybe<QueryContentPartialInputOneToManyInput>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
  /** 变量 */
  variables?: InputMaybe<Scalars['JSON']['input']>
}

/** 突变日志 */
export type MutationLogNode = Node & {
  __typename?: 'MutationLogNode'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 错误 */
  errors?: Maybe<Scalars['String']['output']>
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 所属查询内容 */
  queryContent?: Maybe<QueryContentType>
  /** 所属用户 */
  user?: Maybe<UserType>
  /** 变量 */
  variables?: Maybe<Scalars['JSON']['output']>
}

/** A connection to a list of items. */
export type MutationLogNodeConnection = {
  __typename?: 'MutationLogNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<MutationLogNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type MutationLogNodeEdge = {
  __typename?: 'MutationLogNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: MutationLogNode
}

export type MutationLogOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 域名 */
  domain?: InputMaybe<Ordering>
  /** 错误 */
  errors?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** IP */
  ip?: InputMaybe<Ordering>
  /** 所属查询内容 */
  queryContent?: InputMaybe<QueryContentOrder>
  /** 所属用户 */
  user?: InputMaybe<UserOrder>
  /** 变量 */
  variables?: InputMaybe<Ordering>
}

export type MutationLogPartialInput = {
  /** 域名 */
  domain?: InputMaybe<Scalars['String']['input']>
  /** 错误 */
  errors?: InputMaybe<Scalars['String']['input']>
  /** IP */
  ip?: InputMaybe<Scalars['String']['input']>
  /** 所属查询内容 */
  queryContentId?: InputMaybe<QueryContentPartialInputOneToManyInput>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
  /** 变量 */
  variables?: InputMaybe<Scalars['JSON']['input']>
}

export type MutationLogPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<MutationLogPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<MutationLogPartialInput>>
}

/** 突变日志 */
export type MutationLogType = {
  __typename?: 'MutationLogType'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 错误 */
  errors?: Maybe<Scalars['String']['output']>
  /** ID */
  id: Scalars['ID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 所属查询内容 */
  queryContent?: Maybe<QueryContentType>
  /** 所属用户 */
  user?: Maybe<UserType>
  /** 变量 */
  variables?: Maybe<Scalars['JSON']['output']>
}

export type MutationThrottleFilter = {
  AND?: InputMaybe<MutationThrottleFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<MutationThrottleFilter>
  OR?: InputMaybe<MutationThrottleFilter>
  /** 域名 */
  domain?: InputMaybe<StrFilterLookup>
  /** 字段名称 */
  fieldName?: InputMaybe<StrFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** IP */
  ip?: InputMaybe<StrFilterLookup>
  /** 参数 */
  kwargs?: InputMaybe<StrFilterLookup>
  /** MD5 */
  md5?: InputMaybe<StrFilterLookup>
  /** 时间 */
  time?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 时间1 */
  time1?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 所属用户 */
  user?: InputMaybe<UserFilter>
}

export type MutationThrottleInput = {
  /** 域名 */
  domain: Scalars['String']['input']
  /** 字段名称 */
  fieldName: Scalars['String']['input']
  /** IP */
  ip: Scalars['String']['input']
  /** 参数 */
  kwargs: Scalars['String']['input']
  /** MD5 */
  md5: Scalars['String']['input']
  /** 时间 */
  time: Scalars['DateTime']['input']
  /** 时间1 */
  time1?: InputMaybe<Scalars['DateTime']['input']>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

/** 突变节流 */
export type MutationThrottleNode = Node & {
  __typename?: 'MutationThrottleNode'
  _Str__: Scalars['String']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 字段名称 */
  fieldName: Scalars['String']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 参数 */
  kwargs: Scalars['String']['output']
  /** MD5 */
  md5: Scalars['String']['output']
  /** 时间 */
  time: Scalars['DateTime']['output']
  /** 时间1 */
  time1?: Maybe<Scalars['DateTime']['output']>
  /** 所属用户 */
  user?: Maybe<UserType>
}

/** A connection to a list of items. */
export type MutationThrottleNodeConnection = {
  __typename?: 'MutationThrottleNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<MutationThrottleNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type MutationThrottleNodeEdge = {
  __typename?: 'MutationThrottleNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: MutationThrottleNode
}

export type MutationThrottleOrder = {
  /** 域名 */
  domain?: InputMaybe<Ordering>
  /** 字段名称 */
  fieldName?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** IP */
  ip?: InputMaybe<Ordering>
  /** 参数 */
  kwargs?: InputMaybe<Ordering>
  /** MD5 */
  md5?: InputMaybe<Ordering>
  /** 时间 */
  time?: InputMaybe<Ordering>
  /** 时间1 */
  time1?: InputMaybe<Ordering>
  /** 所属用户 */
  user?: InputMaybe<UserOrder>
}

export type MutationThrottlePartialInput = {
  /** 域名 */
  domain?: InputMaybe<Scalars['String']['input']>
  /** 字段名称 */
  fieldName?: InputMaybe<Scalars['String']['input']>
  /** IP */
  ip?: InputMaybe<Scalars['String']['input']>
  /** 参数 */
  kwargs?: InputMaybe<Scalars['String']['input']>
  /** MD5 */
  md5?: InputMaybe<Scalars['String']['input']>
  /** 时间 */
  time?: InputMaybe<Scalars['DateTime']['input']>
  /** 时间1 */
  time1?: InputMaybe<Scalars['DateTime']['input']>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
}

export type MutationThrottlePartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<MutationThrottlePartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<MutationThrottlePartialInput>>
}

/** 突变节流 */
export type MutationThrottleType = {
  __typename?: 'MutationThrottleType'
  _Str__: Scalars['String']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 字段名称 */
  fieldName: Scalars['String']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 参数 */
  kwargs: Scalars['String']['output']
  /** MD5 */
  md5: Scalars['String']['output']
  /** 时间 */
  time: Scalars['DateTime']['output']
  /** 时间1 */
  time1?: Maybe<Scalars['DateTime']['output']>
  /** 所属用户 */
  user?: Maybe<UserType>
}

/** An object with a Globally Unique ID */
export type Node = {
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
}

export type OffsetPaginationInput = {
  limit?: Scalars['Int']['input']
  offset?: Scalars['Int']['input']
}

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST',
}

/** Information to aid in pagination. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>
}

export type PermissionFilter = {
  AND?: InputMaybe<PermissionFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<PermissionFilter>
  OR?: InputMaybe<PermissionFilter>
  /** 代码名称 */
  codename?: InputMaybe<StrFilterLookup>
  /** 内容类型 */
  contentType?: InputMaybe<ContentTypeFilter>
  /** 权限组 */
  group?: InputMaybe<GroupFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 名称 */
  name?: InputMaybe<StrFilterLookup>
  /** 角色 */
  role?: InputMaybe<RoleFilter>
}

export type PermissionInput = {
  /** 代码名称 */
  codename: Scalars['String']['input']
  /** 内容类型 */
  contentTypeId: ContentTypePartialInputOneToManyInput
  /** 权限组 */
  groupSet?: InputMaybe<GroupPartialInputManyToManyInput>
  /** 名称 */
  name: Scalars['String']['input']
  /** 角色 */
  roleSet?: InputMaybe<RolePartialInputManyToManyInput>
}

/** 权限 */
export type PermissionNode = Node & {
  __typename?: 'PermissionNode'
  _Str__: Scalars['String']['output']
  /** 代码名称 */
  codename: Scalars['String']['output']
  /** 内容类型 */
  contentType: ContentTypeType
  /** 权限组 */
  groupSet: GroupNodeConnection
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 角色 */
  roleSet: RoleNodeConnection
}

/** 权限 */
export type PermissionNodeGroupSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<GroupFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<GroupOrder>
}

/** 权限 */
export type PermissionNodeRoleSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<RoleOrder>
}

/** A connection to a list of items. */
export type PermissionNodeConnection = {
  __typename?: 'PermissionNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<PermissionNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type PermissionNodeEdge = {
  __typename?: 'PermissionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: PermissionNode
}

export type PermissionOrder = {
  /** 代码名称 */
  codename?: InputMaybe<Ordering>
  /** 内容类型 */
  contentType?: InputMaybe<ContentTypeOrder>
  /** 权限组 */
  group?: InputMaybe<GroupOrder>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 名称 */
  name?: InputMaybe<Ordering>
  /** 角色 */
  role?: InputMaybe<RoleOrder>
}

export type PermissionPartialInput = {
  /** 代码名称 */
  codename?: InputMaybe<Scalars['String']['input']>
  /** 内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** 权限组 */
  groupSet?: InputMaybe<GroupPartialInputManyToManyInput>
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 角色 */
  roleSet?: InputMaybe<RolePartialInputManyToManyInput>
}

export type PermissionPartialInputManyToManyInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<PermissionPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<PermissionPartialInput>>
}

export type PermissionPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<PermissionPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<PermissionPartialInput>>
}

/** 权限 */
export type PermissionType = {
  __typename?: 'PermissionType'
  _Str__: Scalars['String']['output']
  /** 代码名称 */
  codename: Scalars['String']['output']
  /** 内容类型 */
  contentType: ContentTypeType
  /** 权限组 */
  groupSet: Array<GroupType>
  /** ID */
  id: Scalars['ID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 角色 */
  roleSet: Array<RoleType>
}

/** 权限 */
export type PermissionTypeGroupSetArgs = {
  filters?: InputMaybe<GroupFilter>
  order?: InputMaybe<GroupOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 权限 */
export type PermissionTypeRoleSetArgs = {
  filters?: InputMaybe<RoleFilter>
  order?: InputMaybe<RoleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type Query = {
  __typename?: 'Query'
  ChangeSet: ChangeSetType
  ChangeSetConnection: ChangeSetNodeConnection
  ChangeSets: Array<ChangeSetType>
  ChangeSetsCount: Scalars['Int']['output']
  ContentType: ContentTypeType
  ContentTypeConnection: ContentTypeNodeConnection
  ContentTypes: Array<ContentTypeType>
  ContentTypesCount: Scalars['Int']['output']
  DynamicConfiguration: DynamicConfigurationType
  DynamicConfigurationConnection: DynamicConfigurationNodeConnection
  DynamicConfigurations: Array<DynamicConfigurationType>
  DynamicConfigurationsCount: Scalars['Int']['output']
  FailedExceptionMail: FailedExceptionMailType
  FailedExceptionMailConnection: FailedExceptionMailNodeConnection
  FailedExceptionMails: Array<FailedExceptionMailType>
  FailedExceptionMailsCount: Scalars['Int']['output']
  Group: GroupType
  GroupConnection: GroupNodeConnection
  Groups: Array<GroupType>
  GroupsCount: Scalars['Int']['output']
  Log: LogType
  LogConnection: LogNodeConnection
  LogEntry: LogEntryType
  LogEntryConnection: LogEntryNodeConnection
  LogEntrys: Array<LogEntryType>
  LogEntrysCount: Scalars['Int']['output']
  Logs: Array<LogType>
  LogsCount: Scalars['Int']['output']
  MutationLog: MutationLogType
  MutationLogConnection: MutationLogNodeConnection
  MutationLogs: Array<MutationLogType>
  MutationLogsCount: Scalars['Int']['output']
  MutationThrottle: MutationThrottleType
  MutationThrottleConnection: MutationThrottleNodeConnection
  MutationThrottles: Array<MutationThrottleType>
  MutationThrottlesCount: Scalars['Int']['output']
  Permission: PermissionType
  PermissionConnection: PermissionNodeConnection
  Permissions: Array<PermissionType>
  PermissionsCount: Scalars['Int']['output']
  QueryContent: QueryContentType
  QueryContentConnection: QueryContentNodeConnection
  QueryContents: Array<QueryContentType>
  QueryContentsCount: Scalars['Int']['output']
  QueryLog: QueryLogType
  QueryLogConnection: QueryLogNodeConnection
  QueryLogs: Array<QueryLogType>
  QueryLogsCount: Scalars['Int']['output']
  Role: RoleType
  RoleConnection: RoleNodeConnection
  Roles: Array<RoleType>
  RolesCount: Scalars['Int']['output']
  Session: SessionType
  SessionConnection: SessionNodeConnection
  Sessions: Array<SessionType>
  SessionsCount: Scalars['Int']['output']
  SoftDeleteRecord: SoftDeleteRecordType
  SoftDeleteRecordConnection: SoftDeleteRecordNodeConnection
  SoftDeleteRecords: Array<SoftDeleteRecordType>
  SoftDeleteRecordsCount: Scalars['Int']['output']
  User: UserType
  UserConnection: UserNodeConnection
  Users: Array<UserType>
  UsersCount: Scalars['Int']['output']
  VerificationCode: VerificationCodeType
  VerificationCodeConnection: VerificationCodeNodeConnection
  VerificationCodes: Array<VerificationCodeType>
  VerificationCodesCount: Scalars['Int']['output']
  me?: Maybe<UserType>
  myPermissions: Array<Scalars['String']['output']>
  node: Node
}

export type QueryChangeSetArgs = {
  pk: Scalars['ID']['input']
}

export type QueryChangeSetConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<ChangeSetFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ChangeSetOrder>
}

export type QueryChangeSetsArgs = {
  filters?: InputMaybe<ChangeSetFilter>
  order?: InputMaybe<ChangeSetOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryChangeSetsCountArgs = {
  filters?: InputMaybe<ChangeSetFilter>
}

export type QueryContentTypeArgs = {
  pk: Scalars['ID']['input']
}

export type QueryContentTypeConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<ContentTypeFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ContentTypeOrder>
}

export type QueryContentTypesArgs = {
  filters?: InputMaybe<ContentTypeFilter>
  order?: InputMaybe<ContentTypeOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryContentTypesCountArgs = {
  filters?: InputMaybe<ContentTypeFilter>
}

export type QueryDynamicConfigurationArgs = {
  pk: Scalars['ID']['input']
}

export type QueryDynamicConfigurationConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<DynamicConfigurationFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<DynamicConfigurationOrder>
}

export type QueryDynamicConfigurationsArgs = {
  filters?: InputMaybe<DynamicConfigurationFilter>
  order?: InputMaybe<DynamicConfigurationOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryDynamicConfigurationsCountArgs = {
  filters?: InputMaybe<DynamicConfigurationFilter>
}

export type QueryFailedExceptionMailArgs = {
  pk: Scalars['ID']['input']
}

export type QueryFailedExceptionMailConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<FailedExceptionMailFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<FailedExceptionMailOrder>
}

export type QueryFailedExceptionMailsArgs = {
  filters?: InputMaybe<FailedExceptionMailFilter>
  order?: InputMaybe<FailedExceptionMailOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryFailedExceptionMailsCountArgs = {
  filters?: InputMaybe<FailedExceptionMailFilter>
}

export type QueryGroupArgs = {
  pk: Scalars['ID']['input']
}

export type QueryGroupConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<GroupFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<GroupOrder>
}

export type QueryGroupsArgs = {
  filters?: InputMaybe<GroupFilter>
  order?: InputMaybe<GroupOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryGroupsCountArgs = {
  filters?: InputMaybe<GroupFilter>
}

export type QueryLogArgs = {
  pk: Scalars['ID']['input']
}

export type QueryLogConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogOrder>
}

export type QueryLogEntryArgs = {
  pk: Scalars['ID']['input']
}

export type QueryLogEntryConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogEntryFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogEntryOrder>
}

export type QueryLogEntrysArgs = {
  filters?: InputMaybe<LogEntryFilter>
  order?: InputMaybe<LogEntryOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryLogEntrysCountArgs = {
  filters?: InputMaybe<LogEntryFilter>
}

export type QueryLogsArgs = {
  filters?: InputMaybe<LogFilter>
  order?: InputMaybe<LogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryLogsCountArgs = {
  filters?: InputMaybe<LogFilter>
}

export type QueryMutationLogArgs = {
  pk: Scalars['ID']['input']
}

export type QueryMutationLogConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<MutationLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<MutationLogOrder>
}

export type QueryMutationLogsArgs = {
  filters?: InputMaybe<MutationLogFilter>
  order?: InputMaybe<MutationLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryMutationLogsCountArgs = {
  filters?: InputMaybe<MutationLogFilter>
}

export type QueryMutationThrottleArgs = {
  pk: Scalars['ID']['input']
}

export type QueryMutationThrottleConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<MutationThrottleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<MutationThrottleOrder>
}

export type QueryMutationThrottlesArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
  order?: InputMaybe<MutationThrottleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryMutationThrottlesCountArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
}

export type QueryPermissionArgs = {
  pk: Scalars['ID']['input']
}

export type QueryPermissionConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<PermissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<PermissionOrder>
}

export type QueryPermissionsArgs = {
  filters?: InputMaybe<PermissionFilter>
  order?: InputMaybe<PermissionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryPermissionsCountArgs = {
  filters?: InputMaybe<PermissionFilter>
}

export type QueryQueryContentArgs = {
  pk: Scalars['ID']['input']
}

export type QueryQueryContentConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<QueryContentFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<QueryContentOrder>
}

export type QueryQueryContentsArgs = {
  filters?: InputMaybe<QueryContentFilter>
  order?: InputMaybe<QueryContentOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryQueryContentsCountArgs = {
  filters?: InputMaybe<QueryContentFilter>
}

export type QueryQueryLogArgs = {
  pk: Scalars['ID']['input']
}

export type QueryQueryLogConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<QueryLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<QueryLogOrder>
}

export type QueryQueryLogsArgs = {
  filters?: InputMaybe<QueryLogFilter>
  order?: InputMaybe<QueryLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryQueryLogsCountArgs = {
  filters?: InputMaybe<QueryLogFilter>
}

export type QueryRoleArgs = {
  pk: Scalars['ID']['input']
}

export type QueryRoleConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<RoleOrder>
}

export type QueryRolesArgs = {
  filters?: InputMaybe<RoleFilter>
  order?: InputMaybe<RoleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryRolesCountArgs = {
  filters?: InputMaybe<RoleFilter>
}

export type QuerySessionArgs = {
  pk: Scalars['ID']['input']
}

export type QuerySessionConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<SessionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<SessionOrder>
}

export type QuerySessionsArgs = {
  filters?: InputMaybe<SessionFilter>
  order?: InputMaybe<SessionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QuerySessionsCountArgs = {
  filters?: InputMaybe<SessionFilter>
}

export type QuerySoftDeleteRecordArgs = {
  pk: Scalars['ID']['input']
}

export type QuerySoftDeleteRecordConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<SoftDeleteRecordFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<SoftDeleteRecordOrder>
}

export type QuerySoftDeleteRecordsArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
  order?: InputMaybe<SoftDeleteRecordOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QuerySoftDeleteRecordsCountArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
}

export type QueryUserArgs = {
  pk: Scalars['ID']['input']
}

export type QueryUserConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<UserFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<UserOrder>
}

export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilter>
  order?: InputMaybe<UserOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryUsersCountArgs = {
  filters?: InputMaybe<UserFilter>
}

export type QueryVerificationCodeArgs = {
  pk: Scalars['ID']['input']
}

export type QueryVerificationCodeConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<VerificationCodeFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<VerificationCodeOrder>
}

export type QueryVerificationCodesArgs = {
  filters?: InputMaybe<VerificationCodeFilter>
  order?: InputMaybe<VerificationCodeOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryVerificationCodesCountArgs = {
  filters?: InputMaybe<VerificationCodeFilter>
}

export type QueryMyPermissionsArgs = {
  regex?: InputMaybe<Scalars['String']['input']>
}

export type QueryNodeArgs = {
  id: Scalars['GlobalID']['input']
}

export type QueryContentFilter = {
  AND?: InputMaybe<QueryContentFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<QueryContentFilter>
  OR?: InputMaybe<QueryContentFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 突变日志 */
  mutationlog?: InputMaybe<MutationLogFilter>
  /** 查询日志 */
  querylog?: InputMaybe<QueryLogFilter>
  /** 文本 */
  text?: InputMaybe<StrFilterLookup>
}

export type QueryContentInput = {
  /** 突变日志 */
  mutationlogSet?: InputMaybe<MutationLogPartialInputManyToOneInput>
  /** 查询日志 */
  querylogSet?: InputMaybe<QueryLogPartialInputManyToOneInput>
  /** 文本 */
  text: Scalars['String']['input']
}

/** 查询内容 */
export type QueryContentNode = Node & {
  __typename?: 'QueryContentNode'
  _Str__: Scalars['String']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 突变日志 */
  mutationlogSet: MutationLogNodeConnection
  /** 查询日志 */
  querylogSet: QueryLogNodeConnection
  /** 文本 */
  text: Scalars['String']['output']
}

/** 查询内容 */
export type QueryContentNodeMutationlogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<MutationLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<MutationLogOrder>
}

/** 查询内容 */
export type QueryContentNodeQuerylogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<QueryLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<QueryLogOrder>
}

/** A connection to a list of items. */
export type QueryContentNodeConnection = {
  __typename?: 'QueryContentNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<QueryContentNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type QueryContentNodeEdge = {
  __typename?: 'QueryContentNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: QueryContentNode
}

export type QueryContentOrder = {
  /** ID */
  id?: InputMaybe<Ordering>
  /** 突变日志 */
  mutationlog?: InputMaybe<MutationLogOrder>
  /** 查询日志 */
  querylog?: InputMaybe<QueryLogOrder>
  /** 文本 */
  text?: InputMaybe<Ordering>
}

export type QueryContentPartialInput = {
  /** 突变日志 */
  mutationlogSet?: InputMaybe<MutationLogPartialInputManyToOneInput>
  /** 查询日志 */
  querylogSet?: InputMaybe<QueryLogPartialInputManyToOneInput>
  /** 文本 */
  text?: InputMaybe<Scalars['String']['input']>
}

export type QueryContentPartialInputOneToManyInput = {
  set?: InputMaybe<Scalars['ID']['input']>
  setObject?: InputMaybe<QueryContentPartialInput>
}

/** 查询内容 */
export type QueryContentType = {
  __typename?: 'QueryContentType'
  _Str__: Scalars['String']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 突变日志 */
  mutationlogSet: Array<MutationLogType>
  /** 查询日志 */
  querylogSet: Array<QueryLogType>
  /** 文本 */
  text: Scalars['String']['output']
}

/** 查询内容 */
export type QueryContentTypeMutationlogSetArgs = {
  filters?: InputMaybe<MutationLogFilter>
  order?: InputMaybe<MutationLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 查询内容 */
export type QueryContentTypeQuerylogSetArgs = {
  filters?: InputMaybe<QueryLogFilter>
  order?: InputMaybe<QueryLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type QueryLogFilter = {
  AND?: InputMaybe<QueryLogFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<QueryLogFilter>
  OR?: InputMaybe<QueryLogFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 域名 */
  domain?: InputMaybe<StrFilterLookup>
  /** 错误 */
  errors?: InputMaybe<StrFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** IP */
  ip?: InputMaybe<StrFilterLookup>
  /** 所属查询内容 */
  queryContent?: InputMaybe<QueryContentFilter>
  /** 所属用户 */
  user?: InputMaybe<UserFilter>
  /** 变量 */
  variables?: InputMaybe<JsonFilterLookup>
}

export type QueryLogInput = {
  /** 域名 */
  domain: Scalars['String']['input']
  /** 错误 */
  errors?: InputMaybe<Scalars['String']['input']>
  /** IP */
  ip: Scalars['String']['input']
  /** 所属查询内容 */
  queryContentId?: InputMaybe<QueryContentPartialInputOneToManyInput>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
  /** 变量 */
  variables?: InputMaybe<Scalars['JSON']['input']>
}

/** 查询日志 */
export type QueryLogNode = Node & {
  __typename?: 'QueryLogNode'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 错误 */
  errors?: Maybe<Scalars['String']['output']>
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 所属查询内容 */
  queryContent?: Maybe<QueryContentType>
  /** 所属用户 */
  user?: Maybe<UserType>
  /** 变量 */
  variables?: Maybe<Scalars['JSON']['output']>
}

/** A connection to a list of items. */
export type QueryLogNodeConnection = {
  __typename?: 'QueryLogNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<QueryLogNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type QueryLogNodeEdge = {
  __typename?: 'QueryLogNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: QueryLogNode
}

export type QueryLogOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 域名 */
  domain?: InputMaybe<Ordering>
  /** 错误 */
  errors?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** IP */
  ip?: InputMaybe<Ordering>
  /** 所属查询内容 */
  queryContent?: InputMaybe<QueryContentOrder>
  /** 所属用户 */
  user?: InputMaybe<UserOrder>
  /** 变量 */
  variables?: InputMaybe<Ordering>
}

export type QueryLogPartialInput = {
  /** 域名 */
  domain?: InputMaybe<Scalars['String']['input']>
  /** 错误 */
  errors?: InputMaybe<Scalars['String']['input']>
  /** IP */
  ip?: InputMaybe<Scalars['String']['input']>
  /** 所属查询内容 */
  queryContentId?: InputMaybe<QueryContentPartialInputOneToManyInput>
  /** 所属用户 */
  userId?: InputMaybe<Scalars['ID']['input']>
  /** 变量 */
  variables?: InputMaybe<Scalars['JSON']['input']>
}

export type QueryLogPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<QueryLogPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<QueryLogPartialInput>>
}

/** 查询日志 */
export type QueryLogType = {
  __typename?: 'QueryLogType'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 域名 */
  domain: Scalars['String']['output']
  /** 错误 */
  errors?: Maybe<Scalars['String']['output']>
  /** ID */
  id: Scalars['ID']['output']
  /** IP */
  ip: Scalars['String']['output']
  /** 所属查询内容 */
  queryContent?: Maybe<QueryContentType>
  /** 所属用户 */
  user?: Maybe<UserType>
  /** 变量 */
  variables?: Maybe<Scalars['JSON']['output']>
}

export type RoleFilter = {
  AND?: InputMaybe<RoleFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<RoleFilter>
  OR?: InputMaybe<RoleFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 删除日期 */
  deletedAt?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 权限组 */
  groups?: InputMaybe<GroupFilter>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 名称 */
  name?: InputMaybe<StrFilterLookup>
  /** 权限 */
  permissions?: InputMaybe<PermissionFilter>
  /** 修改时间 */
  updatedTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 用户 */
  user?: InputMaybe<UserFilter>
}

export type RoleInput = {
  /** 权限组 */
  groups?: InputMaybe<GroupPartialInputManyToManyInput>
  /** 名称 */
  name: Scalars['String']['input']
  /** 权限 */
  permissions?: InputMaybe<PermissionPartialInputManyToManyInput>
  /** 用户 */
  userSet?: InputMaybe<UserPartialInputManyToManyInput>
}

/** 角色 */
export type RoleNode = Node & {
  __typename?: 'RoleNode'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** 权限组 */
  groups: GroupNodeConnection
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 权限 */
  permissions: PermissionNodeConnection
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 用户 */
  userSet: UserNodeConnection
}

/** 角色 */
export type RoleNodeGroupsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<GroupFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<GroupOrder>
}

/** 角色 */
export type RoleNodePermissionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<PermissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<PermissionOrder>
}

/** 角色 */
export type RoleNodeUserSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<UserFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<UserOrder>
}

/** A connection to a list of items. */
export type RoleNodeConnection = {
  __typename?: 'RoleNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<RoleNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type RoleNodeEdge = {
  __typename?: 'RoleNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: RoleNode
}

export type RoleOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 删除日期 */
  deletedAt?: InputMaybe<Ordering>
  /** 权限组 */
  groups?: InputMaybe<GroupOrder>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 名称 */
  name?: InputMaybe<Ordering>
  /** 权限 */
  permissions?: InputMaybe<PermissionOrder>
  /** 修改时间 */
  updatedTime?: InputMaybe<Ordering>
  /** 用户 */
  user?: InputMaybe<UserOrder>
}

export type RolePartialInput = {
  /** 权限组 */
  groups?: InputMaybe<GroupPartialInputManyToManyInput>
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 权限 */
  permissions?: InputMaybe<PermissionPartialInputManyToManyInput>
  /** 用户 */
  userSet?: InputMaybe<UserPartialInputManyToManyInput>
}

export type RolePartialInputManyToManyInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<RolePartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<RolePartialInput>>
}

/** 角色 */
export type RoleType = {
  __typename?: 'RoleType'
  _Str__: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** 权限组 */
  groups: Array<GroupType>
  /** ID */
  id: Scalars['ID']['output']
  /** 名称 */
  name: Scalars['String']['output']
  /** 权限 */
  permissions: Array<PermissionType>
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 用户 */
  userSet: Array<UserType>
}

/** 角色 */
export type RoleTypeGroupsArgs = {
  filters?: InputMaybe<GroupFilter>
  order?: InputMaybe<GroupOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 角色 */
export type RoleTypePermissionsArgs = {
  filters?: InputMaybe<PermissionFilter>
  order?: InputMaybe<PermissionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 角色 */
export type RoleTypeUserSetArgs = {
  filters?: InputMaybe<UserFilter>
  order?: InputMaybe<UserOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SessionFilter = {
  AND?: InputMaybe<SessionFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<SessionFilter>
  OR?: InputMaybe<SessionFilter>
  /** 过期时间 */
  expireDate?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 会话数据 */
  sessionData?: InputMaybe<StrFilterLookup>
  /** 会话密钥 */
  sessionKey?: InputMaybe<StrFilterLookup>
}

export type SessionInput = {
  /** 过期时间 */
  expireDate: Scalars['DateTime']['input']
  /** 会话数据 */
  sessionData: Scalars['String']['input']
  /** 会话密钥 */
  sessionKey: Scalars['String']['input']
}

/** 会话 */
export type SessionNode = Node & {
  __typename?: 'SessionNode'
  _Str__: Scalars['String']['output']
  /** 过期时间 */
  expireDate: Scalars['DateTime']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 会话数据 */
  sessionData: Scalars['String']['output']
}

/** A connection to a list of items. */
export type SessionNodeConnection = {
  __typename?: 'SessionNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<SessionNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type SessionNodeEdge = {
  __typename?: 'SessionNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: SessionNode
}

export type SessionOrder = {
  /** 过期时间 */
  expireDate?: InputMaybe<Ordering>
  /** 会话数据 */
  sessionData?: InputMaybe<Ordering>
  /** 会话密钥 */
  sessionKey?: InputMaybe<Ordering>
}

export type SessionPartialInput = {
  /** 过期时间 */
  expireDate?: InputMaybe<Scalars['DateTime']['input']>
  /** 会话数据 */
  sessionData?: InputMaybe<Scalars['String']['input']>
  /** 会话密钥 */
  sessionKey?: InputMaybe<Scalars['String']['input']>
}

/** 会话 */
export type SessionType = {
  __typename?: 'SessionType'
  _Str__: Scalars['String']['output']
  /** 过期时间 */
  expireDate: Scalars['DateTime']['output']
  /** 会话数据 */
  sessionData: Scalars['String']['output']
  /** 会话密钥 */
  sessionKey: Scalars['String']['output']
}

export type SoftDeleteRecordFilter = {
  AND?: InputMaybe<SoftDeleteRecordFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<SoftDeleteRecordFilter>
  OR?: InputMaybe<SoftDeleteRecordFilter>
  /** 所属修改集 */
  changeset?: InputMaybe<ChangeSetFilter>
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeFilter>
  /** 创建日期 */
  createdDate?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 对象编号 */
  objectId?: InputMaybe<StrFilterLookup>
}

export type SoftDeleteRecordInput = {
  /** 所属修改集 */
  changesetId: ChangeSetPartialInputOneToManyInput
  /** 所属内容类型 */
  contentTypeId: ContentTypePartialInputOneToManyInput
  /** 创建日期 */
  createdDate?: InputMaybe<Scalars['DateTime']['input']>
  /** 对象编号 */
  objectId: Scalars['String']['input']
}

/** 软删除记录 */
export type SoftDeleteRecordNode = Node & {
  __typename?: 'SoftDeleteRecordNode'
  _Str__: Scalars['String']['output']
  /** 所属修改集 */
  changeset: ChangeSetType
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建日期 */
  createdDate: Scalars['DateTime']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 对象编号 */
  objectId: Scalars['String']['output']
}

/** A connection to a list of items. */
export type SoftDeleteRecordNodeConnection = {
  __typename?: 'SoftDeleteRecordNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<SoftDeleteRecordNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type SoftDeleteRecordNodeEdge = {
  __typename?: 'SoftDeleteRecordNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: SoftDeleteRecordNode
}

export type SoftDeleteRecordOrder = {
  /** 所属修改集 */
  changeset?: InputMaybe<ChangeSetOrder>
  /** 所属内容类型 */
  contentType?: InputMaybe<ContentTypeOrder>
  /** 创建日期 */
  createdDate?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 对象编号 */
  objectId?: InputMaybe<Ordering>
}

export type SoftDeleteRecordPartialInput = {
  /** 所属修改集 */
  changesetId?: InputMaybe<ChangeSetPartialInputOneToManyInput>
  /** 所属内容类型 */
  contentTypeId?: InputMaybe<ContentTypePartialInputOneToManyInput>
  /** 创建日期 */
  createdDate?: InputMaybe<Scalars['DateTime']['input']>
  /** 对象编号 */
  objectId?: InputMaybe<Scalars['String']['input']>
}

export type SoftDeleteRecordPartialInputManyToOneInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<SoftDeleteRecordPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<SoftDeleteRecordPartialInput>>
}

/** 软删除记录 */
export type SoftDeleteRecordType = {
  __typename?: 'SoftDeleteRecordType'
  _Str__: Scalars['String']['output']
  /** 所属修改集 */
  changeset: ChangeSetType
  /** 所属内容类型 */
  contentType: ContentTypeType
  /** 创建日期 */
  createdDate: Scalars['DateTime']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 对象编号 */
  objectId: Scalars['String']['output']
}

export type StrFilterLookup = {
  /** Case-sensitive containment test. Filter will be skipped on `null` value */
  contains?: InputMaybe<Scalars['String']['input']>
  /** Case-sensitive ends-with. Filter will be skipped on `null` value */
  endsWith?: InputMaybe<Scalars['String']['input']>
  /** Exact match. Filter will be skipped on `null` value */
  exact?: InputMaybe<Scalars['String']['input']>
  /** Case-insensitive containment test. Filter will be skipped on `null` value */
  iContains?: InputMaybe<Scalars['String']['input']>
  /** Case-insensitive ends-with. Filter will be skipped on `null` value */
  iEndsWith?: InputMaybe<Scalars['String']['input']>
  /** Case-insensitive exact match. Filter will be skipped on `null` value */
  iExact?: InputMaybe<Scalars['String']['input']>
  /** Case-insensitive regular expression match. Filter will be skipped on `null` value */
  iRegex?: InputMaybe<Scalars['String']['input']>
  /** Case-insensitive starts-with. Filter will be skipped on `null` value */
  iStartsWith?: InputMaybe<Scalars['String']['input']>
  /** Exact match of items in a given list. Filter will be skipped on `null` value */
  inList?: InputMaybe<Array<Scalars['String']['input']>>
  /** Assignment test. Filter will be skipped on `null` value */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Case-sensitive regular expression match. Filter will be skipped on `null` value */
  regex?: InputMaybe<Scalars['String']['input']>
  /** Case-sensitive starts-with. Filter will be skipped on `null` value */
  startsWith?: InputMaybe<Scalars['String']['input']>
}

export type Subscription = {
  __typename?: 'Subscription'
  ChangeSet: ChangeSetType
  ChangeSets: Array<ChangeSetType>
  ChangeSetsCount: Scalars['Int']['output']
  ContentType: ContentTypeType
  ContentTypes: Array<ContentTypeType>
  ContentTypesCount: Scalars['Int']['output']
  DynamicConfiguration: DynamicConfigurationType
  DynamicConfigurations: Array<DynamicConfigurationType>
  DynamicConfigurationsCount: Scalars['Int']['output']
  FailedExceptionMail: FailedExceptionMailType
  FailedExceptionMails: Array<FailedExceptionMailType>
  FailedExceptionMailsCount: Scalars['Int']['output']
  Group: GroupType
  Groups: Array<GroupType>
  GroupsCount: Scalars['Int']['output']
  Log: LogType
  LogEntry: LogEntryType
  LogEntrys: Array<LogEntryType>
  LogEntrysCount: Scalars['Int']['output']
  Logs: Array<LogType>
  LogsCount: Scalars['Int']['output']
  MutationLog: MutationLogType
  MutationLogs: Array<MutationLogType>
  MutationLogsCount: Scalars['Int']['output']
  MutationThrottle: MutationThrottleType
  MutationThrottles: Array<MutationThrottleType>
  MutationThrottlesCount: Scalars['Int']['output']
  Permission: PermissionType
  Permissions: Array<PermissionType>
  PermissionsCount: Scalars['Int']['output']
  QueryContent: QueryContentType
  QueryContents: Array<QueryContentType>
  QueryContentsCount: Scalars['Int']['output']
  QueryLog: QueryLogType
  QueryLogs: Array<QueryLogType>
  QueryLogsCount: Scalars['Int']['output']
  Role: RoleType
  Roles: Array<RoleType>
  RolesCount: Scalars['Int']['output']
  Session: SessionType
  Sessions: Array<SessionType>
  SessionsCount: Scalars['Int']['output']
  SoftDeleteRecord: SoftDeleteRecordType
  SoftDeleteRecords: Array<SoftDeleteRecordType>
  SoftDeleteRecordsCount: Scalars['Int']['output']
  User: UserType
  Users: Array<UserType>
  UsersCount: Scalars['Int']['output']
  VerificationCode: VerificationCodeType
  VerificationCodes: Array<VerificationCodeType>
  VerificationCodesCount: Scalars['Int']['output']
  heartbeat?: Maybe<Scalars['Void']['output']>
  listenAlive?: Maybe<Scalars['Void']['output']>
  matchOpponent: Scalars['JSON']['output']
  me?: Maybe<UserType>
  sendData?: Maybe<Scalars['Void']['output']>
  time: Scalars['Float']['output']
}

export type SubscriptionChangeSetsArgs = {
  filters?: InputMaybe<ChangeSetFilter>
  order?: InputMaybe<ChangeSetOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionChangeSetsCountArgs = {
  filters?: InputMaybe<ChangeSetFilter>
}

export type SubscriptionContentTypesArgs = {
  filters?: InputMaybe<ContentTypeFilter>
  order?: InputMaybe<ContentTypeOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionContentTypesCountArgs = {
  filters?: InputMaybe<ContentTypeFilter>
}

export type SubscriptionDynamicConfigurationsArgs = {
  filters?: InputMaybe<DynamicConfigurationFilter>
  order?: InputMaybe<DynamicConfigurationOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionDynamicConfigurationsCountArgs = {
  filters?: InputMaybe<DynamicConfigurationFilter>
}

export type SubscriptionFailedExceptionMailsArgs = {
  filters?: InputMaybe<FailedExceptionMailFilter>
  order?: InputMaybe<FailedExceptionMailOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionFailedExceptionMailsCountArgs = {
  filters?: InputMaybe<FailedExceptionMailFilter>
}

export type SubscriptionGroupsArgs = {
  filters?: InputMaybe<GroupFilter>
  order?: InputMaybe<GroupOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionGroupsCountArgs = {
  filters?: InputMaybe<GroupFilter>
}

export type SubscriptionLogEntrysArgs = {
  filters?: InputMaybe<LogEntryFilter>
  order?: InputMaybe<LogEntryOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionLogEntrysCountArgs = {
  filters?: InputMaybe<LogEntryFilter>
}

export type SubscriptionLogsArgs = {
  filters?: InputMaybe<LogFilter>
  order?: InputMaybe<LogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionLogsCountArgs = {
  filters?: InputMaybe<LogFilter>
}

export type SubscriptionMutationLogsArgs = {
  filters?: InputMaybe<MutationLogFilter>
  order?: InputMaybe<MutationLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionMutationLogsCountArgs = {
  filters?: InputMaybe<MutationLogFilter>
}

export type SubscriptionMutationThrottlesArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
  order?: InputMaybe<MutationThrottleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionMutationThrottlesCountArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
}

export type SubscriptionPermissionsArgs = {
  filters?: InputMaybe<PermissionFilter>
  order?: InputMaybe<PermissionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionPermissionsCountArgs = {
  filters?: InputMaybe<PermissionFilter>
}

export type SubscriptionQueryContentsArgs = {
  filters?: InputMaybe<QueryContentFilter>
  order?: InputMaybe<QueryContentOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionQueryContentsCountArgs = {
  filters?: InputMaybe<QueryContentFilter>
}

export type SubscriptionQueryLogsArgs = {
  filters?: InputMaybe<QueryLogFilter>
  order?: InputMaybe<QueryLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionQueryLogsCountArgs = {
  filters?: InputMaybe<QueryLogFilter>
}

export type SubscriptionRolesArgs = {
  filters?: InputMaybe<RoleFilter>
  order?: InputMaybe<RoleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionRolesCountArgs = {
  filters?: InputMaybe<RoleFilter>
}

export type SubscriptionSessionsArgs = {
  filters?: InputMaybe<SessionFilter>
  order?: InputMaybe<SessionOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionSessionsCountArgs = {
  filters?: InputMaybe<SessionFilter>
}

export type SubscriptionSoftDeleteRecordsArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
  order?: InputMaybe<SoftDeleteRecordOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionSoftDeleteRecordsCountArgs = {
  filters?: InputMaybe<SoftDeleteRecordFilter>
}

export type SubscriptionUsersArgs = {
  filters?: InputMaybe<UserFilter>
  order?: InputMaybe<UserOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionUsersCountArgs = {
  filters?: InputMaybe<UserFilter>
}

export type SubscriptionVerificationCodesArgs = {
  filters?: InputMaybe<VerificationCodeFilter>
  order?: InputMaybe<VerificationCodeOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type SubscriptionVerificationCodesCountArgs = {
  filters?: InputMaybe<VerificationCodeFilter>
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

export type UserFilter = {
  AND?: InputMaybe<UserFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<UserFilter>
  OR?: InputMaybe<UserFilter>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 删除日期 */
  deletedAt?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 电子邮件地址 */
  email?: InputMaybe<StrFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 有效 */
  isActive?: InputMaybe<BoolBaseFilterLookup>
  /** 超级用户状态 */
  isSuperuser?: InputMaybe<BoolBaseFilterLookup>
  /** 上次登录 */
  lastLogin?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 日志 */
  log?: InputMaybe<LogFilter>
  /** 日志记录 */
  logentry?: InputMaybe<LogEntryFilter>
  /** 突变日志 */
  mutationlog?: InputMaybe<MutationLogFilter>
  /** 突变节流 */
  mutationthrottle?: InputMaybe<MutationThrottleFilter>
  /** 名称 */
  name?: InputMaybe<StrFilterLookup>
  /** 密码 */
  password?: InputMaybe<StrFilterLookup>
  /** 查询日志 */
  querylog?: InputMaybe<QueryLogFilter>
  /** 角色 */
  roles?: InputMaybe<RoleFilter>
  /** 修改时间 */
  updatedTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 账号 */
  username?: InputMaybe<StrFilterLookup>
}

export type UserInput = {
  /** 头像 */
  avatar?: InputMaybe<Scalars['Upload']['input']>
  /** 电子邮件地址 */
  email?: InputMaybe<Scalars['String']['input']>
  /** 有效 */
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  /** 超级用户状态 */
  isSuperuser?: InputMaybe<Scalars['Boolean']['input']>
  /** 上次登录 */
  lastLogin?: InputMaybe<Scalars['DateTime']['input']>
  /** 日志 */
  logSet?: InputMaybe<LogPartialInputManyToOneInput>
  /** 日志记录 */
  logentrySet?: InputMaybe<LogEntryPartialInputManyToOneInput>
  /** 突变日志 */
  mutationlogSet?: InputMaybe<MutationLogPartialInputManyToOneInput>
  /** 突变节流 */
  mutationthrottleSet?: InputMaybe<MutationThrottlePartialInputManyToOneInput>
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 密码 */
  password: Scalars['String']['input']
  /** 查询日志 */
  querylogSet?: InputMaybe<QueryLogPartialInputManyToOneInput>
  /** 角色 */
  roles?: InputMaybe<RolePartialInputManyToManyInput>
  /** 账号 */
  username: Scalars['String']['input']
}

/** 用户 */
export type UserNode = Node & {
  __typename?: 'UserNode'
  _Str__: Scalars['String']['output']
  /** 头像 */
  avatar?: Maybe<DjangoImageType>
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** 电子邮件地址 */
  email: Scalars['String']['output']
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 有效 */
  isActive: Scalars['Boolean']['output']
  /** 超级用户状态 */
  isSuperuser: Scalars['Boolean']['output']
  /** 上次登录 */
  lastLogin?: Maybe<Scalars['DateTime']['output']>
  /** 日志 */
  logSet: LogNodeConnection
  /** 日志记录 */
  logentrySet: LogEntryNodeConnection
  /** 突变日志 */
  mutationlogSet: MutationLogNodeConnection
  /** 突变节流 */
  mutationthrottleSet: MutationThrottleNodeConnection
  /** 名称 */
  name: Scalars['String']['output']
  /** 密码 */
  password: Scalars['String']['output']
  /** 查询日志 */
  querylogSet: QueryLogNodeConnection
  /** 角色 */
  roles: RoleNodeConnection
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 账号 */
  username: Scalars['String']['output']
}

/** 用户 */
export type UserNodeLogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogOrder>
}

/** 用户 */
export type UserNodeLogentrySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<LogEntryFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<LogEntryOrder>
}

/** 用户 */
export type UserNodeMutationlogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<MutationLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<MutationLogOrder>
}

/** 用户 */
export type UserNodeMutationthrottleSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<MutationThrottleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<MutationThrottleOrder>
}

/** 用户 */
export type UserNodeQuerylogSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<QueryLogFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<QueryLogOrder>
}

/** 用户 */
export type UserNodeRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<RoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<RoleOrder>
}

/** A connection to a list of items. */
export type UserNodeConnection = {
  __typename?: 'UserNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<UserNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type UserNodeEdge = {
  __typename?: 'UserNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: UserNode
}

export type UserOrder = {
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 删除日期 */
  deletedAt?: InputMaybe<Ordering>
  /** 电子邮件地址 */
  email?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 有效 */
  isActive?: InputMaybe<Ordering>
  /** 超级用户状态 */
  isSuperuser?: InputMaybe<Ordering>
  /** 上次登录 */
  lastLogin?: InputMaybe<Ordering>
  /** 日志 */
  log?: InputMaybe<LogOrder>
  /** 日志记录 */
  logentry?: InputMaybe<LogEntryOrder>
  /** 突变日志 */
  mutationlog?: InputMaybe<MutationLogOrder>
  /** 突变节流 */
  mutationthrottle?: InputMaybe<MutationThrottleOrder>
  /** 名称 */
  name?: InputMaybe<Ordering>
  /** 密码 */
  password?: InputMaybe<Ordering>
  /** 查询日志 */
  querylog?: InputMaybe<QueryLogOrder>
  /** 角色 */
  roles?: InputMaybe<RoleOrder>
  /** 修改时间 */
  updatedTime?: InputMaybe<Ordering>
  /** 账号 */
  username?: InputMaybe<Ordering>
}

export type UserPartialInput = {
  /** 头像 */
  avatar?: InputMaybe<Scalars['Upload']['input']>
  /** 电子邮件地址 */
  email?: InputMaybe<Scalars['String']['input']>
  /** 有效 */
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  /** 超级用户状态 */
  isSuperuser?: InputMaybe<Scalars['Boolean']['input']>
  /** 上次登录 */
  lastLogin?: InputMaybe<Scalars['DateTime']['input']>
  /** 日志 */
  logSet?: InputMaybe<LogPartialInputManyToOneInput>
  /** 日志记录 */
  logentrySet?: InputMaybe<LogEntryPartialInputManyToOneInput>
  /** 突变日志 */
  mutationlogSet?: InputMaybe<MutationLogPartialInputManyToOneInput>
  /** 突变节流 */
  mutationthrottleSet?: InputMaybe<MutationThrottlePartialInputManyToOneInput>
  /** 名称 */
  name?: InputMaybe<Scalars['String']['input']>
  /** 密码 */
  password?: InputMaybe<Scalars['String']['input']>
  /** 查询日志 */
  querylogSet?: InputMaybe<QueryLogPartialInputManyToOneInput>
  /** 角色 */
  roles?: InputMaybe<RolePartialInputManyToManyInput>
  /** 账号 */
  username?: InputMaybe<Scalars['String']['input']>
}

export type UserPartialInputManyToManyInput = {
  add?: InputMaybe<Array<Scalars['ID']['input']>>
  addObjects?: InputMaybe<Array<UserPartialInput>>
  remove?: InputMaybe<Array<Scalars['ID']['input']>>
  set?: InputMaybe<Array<Scalars['ID']['input']>>
  setObjects?: InputMaybe<Array<UserPartialInput>>
}

/** 用户 */
export type UserType = {
  __typename?: 'UserType'
  _Str__: Scalars['String']['output']
  /** 头像 */
  avatar?: Maybe<DjangoImageType>
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** 电子邮件地址 */
  email: Scalars['String']['output']
  /** ID */
  id: Scalars['ID']['output']
  /** 有效 */
  isActive: Scalars['Boolean']['output']
  /** 超级用户状态 */
  isSuperuser: Scalars['Boolean']['output']
  /** 上次登录 */
  lastLogin?: Maybe<Scalars['DateTime']['output']>
  /** 日志 */
  logSet: Array<LogType>
  /** 日志记录 */
  logentrySet: Array<LogEntryType>
  /** 突变日志 */
  mutationlogSet: Array<MutationLogType>
  /** 突变节流 */
  mutationthrottleSet: Array<MutationThrottleType>
  /** 名称 */
  name: Scalars['String']['output']
  /** 密码 */
  password: Scalars['String']['output']
  /** 查询日志 */
  querylogSet: Array<QueryLogType>
  /** 角色 */
  roles: Array<RoleType>
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 账号 */
  username: Scalars['String']['output']
}

/** 用户 */
export type UserTypeLogSetArgs = {
  filters?: InputMaybe<LogFilter>
  order?: InputMaybe<LogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 用户 */
export type UserTypeLogentrySetArgs = {
  filters?: InputMaybe<LogEntryFilter>
  order?: InputMaybe<LogEntryOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 用户 */
export type UserTypeMutationlogSetArgs = {
  filters?: InputMaybe<MutationLogFilter>
  order?: InputMaybe<MutationLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 用户 */
export type UserTypeMutationthrottleSetArgs = {
  filters?: InputMaybe<MutationThrottleFilter>
  order?: InputMaybe<MutationThrottleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 用户 */
export type UserTypeQuerylogSetArgs = {
  filters?: InputMaybe<QueryLogFilter>
  order?: InputMaybe<QueryLogOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

/** 用户 */
export type UserTypeRolesArgs = {
  filters?: InputMaybe<RoleFilter>
  order?: InputMaybe<RoleOrder>
  pagination?: InputMaybe<OffsetPaginationInput>
}

export type VerificationCodeFilter = {
  AND?: InputMaybe<VerificationCodeFilter>
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>
  NOT?: InputMaybe<VerificationCodeFilter>
  OR?: InputMaybe<VerificationCodeFilter>
  /** 验证码 */
  code?: InputMaybe<StrFilterLookup>
  /** 创建时间 */
  createdTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 删除日期 */
  deletedAt?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** ID */
  id?: InputMaybe<IdBaseFilterLookup>
  /** 修改时间 */
  updatedTime?: InputMaybe<DatetimeDatetimeFilterLookup>
  /** 用户名 */
  username?: InputMaybe<StrFilterLookup>
}

export type VerificationCodeInput = {
  /** 验证码 */
  code: Scalars['String']['input']
  /** 用户名 */
  username: Scalars['String']['input']
}

/** 验证码 */
export type VerificationCodeNode = Node & {
  __typename?: 'VerificationCodeNode'
  _Str__: Scalars['String']['output']
  /** 验证码 */
  code: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output']
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 用户名 */
  username: Scalars['String']['output']
}

/** A connection to a list of items. */
export type VerificationCodeNodeConnection = {
  __typename?: 'VerificationCodeNodeConnection'
  /** Contains the nodes in this connection */
  edges: Array<VerificationCodeNodeEdge>
  /** Pagination data for this connection */
  pageInfo: PageInfo
  /** Total quantity of existing nodes. */
  totalCount?: Maybe<Scalars['Int']['output']>
}

/** An edge in a connection. */
export type VerificationCodeNodeEdge = {
  __typename?: 'VerificationCodeNodeEdge'
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output']
  /** The item at the end of the edge */
  node: VerificationCodeNode
}

export type VerificationCodeOrder = {
  /** 验证码 */
  code?: InputMaybe<Ordering>
  /** 创建时间 */
  createdTime?: InputMaybe<Ordering>
  /** 删除日期 */
  deletedAt?: InputMaybe<Ordering>
  /** ID */
  id?: InputMaybe<Ordering>
  /** 修改时间 */
  updatedTime?: InputMaybe<Ordering>
  /** 用户名 */
  username?: InputMaybe<Ordering>
}

export type VerificationCodePartialInput = {
  /** 验证码 */
  code?: InputMaybe<Scalars['String']['input']>
  /** 用户名 */
  username?: InputMaybe<Scalars['String']['input']>
}

/** 验证码 */
export type VerificationCodeType = {
  __typename?: 'VerificationCodeType'
  _Str__: Scalars['String']['output']
  /** 验证码 */
  code: Scalars['String']['output']
  /** 创建时间 */
  createdTime: Scalars['DateTime']['output']
  /** 删除日期 */
  deletedAt?: Maybe<Scalars['DateTime']['output']>
  /** ID */
  id: Scalars['ID']['output']
  /** 修改时间 */
  updatedTime: Scalars['DateTime']['output']
  /** 用户名 */
  username: Scalars['String']['output']
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

export type HeartbeatSubscriptionVariables = Exact<{
  uid: Scalars['String']['input']
}>

export type HeartbeatSubscription = {
  __typename?: 'Subscription'
  heartbeat?: any | null
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
