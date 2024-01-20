/* RelayEnv.res */

/* This is just a custom exception to indicate that something went wrong. */
exception Graphql_error(string)

type node
type schema

type args = {
  document: node,
  variableValues: Js.Json.t,
  schema:schema
}

@module("./urql") external schema: schema = "schema"
@module("graphql") external execute: args => Js.Promise.t<Js.Json.t> = "execute"
@module("graphql") external parse: string => node = "parse"

/**

 * A standard fetch that sends our operation and variables to the

 * GraphQL server, and then decodes and returns the response.

 */
let fetchQuery: RescriptRelay.Network.fetchFunctionPromise = async (
  operation,
  variables,
  _cacheConfig,
  _uploadables,
) => {
  await execute({schema, document: parse(operation.text),variableValues: variables})
}

let network = RescriptRelay.Network.makePromiseBased(~fetchFunction=fetchQuery)

let environment = RescriptRelay.Environment.make(
  ~network,
  ~store=RescriptRelay.Store.make(
    ~source=RescriptRelay.RecordSource.make(),
    ~gcReleaseBufferSize=10 /* This sets the query cache size to 10 */
  ),
)
