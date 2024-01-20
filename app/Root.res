module RootQuery = %relay(`
 query RootQuery {
   Viewer {
     id
     name
   }
 }
`)

@module("@remix-run/react")
external useLoaderData: unit => RootQuery_graphql.queryRef = "useLoaderData"

let loader = () => RootQuery_graphql.load(~environment=RelayEnv.environment, ~variables=())

@react.component
let make = () => {
  let queryRef = useLoaderData()
  let data = RootQuery.usePreloaded(~queryRef)

  <RescriptRelay.Context.Provider environment={RelayEnv.environment}>
    {switch (data["Viewer"]) {|Some(viewer)=>React.string(viewer.name)|None=>React.null}}
  </RescriptRelay.Context.Provider>
}
