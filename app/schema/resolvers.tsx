import { stitchSchemas } from "@graphql-tools/stitch"

	import type { ExecutionResult } from "graphql"
	import { GraphQLError, execute } from "graphql"
	
	import { buildHTTPExecutor } from "@graphql-tools/executor-http"
	
	import { mergeResolvers } from "@graphql-tools/merge"
	
	import { makeExecutableSchema } from "@graphql-tools/schema"
	
	import type { TypedDocumentNode as DocumentTypeDecoration } from "@graphql-typed-document-node/core"
	import type { SerializeFrom } from "@remix-run/node"
	
	import { parse, stringify } from "devalue"
	import { useMemo } from "react"
	import mainfile from "../../schema.graphql?raw"
	import typeDefs from "./.schema.graphql?raw"

	import { default as ListItem } from "../lib/schema/ListItem"
import { default as MediaGroup } from "../lib/schema/MediaGroup"
import { default as behind } from "../lib/schema/behind"
import { default as toWatch } from "../lib/schema/toWatch"

	class Box{constructor(public data:any,public name:any){}}


	const ListItemResolvers = {
  MediaList: {ListItem: {
    selectionSet: `{
toWatch
behind
score
progress
media {
id
title {
  userPreferred
}
coverImage {
  extraLarge
  medium
}
episodes
}
}`,
    resolve: (data: any) => new Box(data, "ListItem")}
  }
}
const MediaGroupResolvers = {
  MediaListGroup: {MediaGroup: {
    selectionSet: `{
name
entries {
id
toWatch
ListItem
media {
  id
  status
}
}
}`,
    resolve: (data: any) => new Box(data, "MediaGroup")}
  }
}
const behindResolvers = {
  MediaList: {behind: {
    selectionSet: `{
progress
media {
episodes
nextAiringEpisode {
  episode
}
}
}`,
    resolve: (data: any) => new Box(data, "behind")}
  }
}
const toWatchResolvers = {
  MediaList: {toWatch: {
    selectionSet: `{
behind
media {
duration
}
}`,
    resolve: (data: any) => new Box(data, "toWatch")}
  }
}


 

		
		const mainschema = {
			schema: makeExecutableSchema({
				typeDefs: mainfile,
			}),
			batch: true,
			executor: buildHTTPExecutor({
				endpoint: "https://graphql.anilist.co",
			}),
		}
		

		export const resolvers = mergeResolvers([ListItemResolvers,MediaGroupResolvers,behindResolvers,toWatchResolvers
		])
	
		const components: any = {ListItem:ListItem,MediaGroup:MediaGroup,behind:behind,toWatch:toWatch}

		abstract class Ref<T> {
			protected opaque!: T
		}
		
		type PreserveRef<T> = {
			[K in keyof T]: T[K] extends Ref<any> ? T[K] : SerializeFrom<T[K]>
		}
		
		declare module "@remix-run/react" {
			export function useLoaderData<T>(): T extends (...args: any[]) => infer Output
				? PreserveRef<Awaited<Output>>
				: PreserveRef<Awaited<T>>
		}

		function ref<T>(value: T) {
			return stringify(value, {
				Box: (value) => value instanceof Box && { data: {...value.data}, name:value.name },
				GraphqlError: (value) => value instanceof GraphQLError && { ...value },
			}) as unknown as Ref<T>
		}
		
		function unref<T>(value: Ref<T>) {
			return parse(value as unknown as string, {
				Box: ({ data, name }) => {
					return components[name](data)
				},
				GraphqlError: (data) => new GraphQLError(data.message, data),
			}) as unknown as T
		}
		
		import {getClient} from "~/lib/urql"

		export async function loadQuery<T, V extends { readonly [variable: string]: unknown; }>(
			request: Request,
			document: DocumentTypeDecoration<T>,
			variableValues: V
		): Promise<Ref<ExecutionResult<T>>> {
			const {data, error} = (await getClient(request).query(document, variableValues)) as ExecutionResult<T>

			if(error)console.error(error)
		
			return ref({data})
		}
		
		export function useQuery<T>(ref: Ref<ExecutionResult<T>>): ExecutionResult<T> {
			return useMemo(() => unref(ref), [ref])
		}