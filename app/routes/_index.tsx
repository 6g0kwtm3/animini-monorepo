import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  ButtonElevated,
  ButtonFilled,
  ButtonOutlined,
  ButtonTonal,
  ButtonText as Text,
} from "~/components/Button"
import { UrqlForm } from "~/components/UrqlForm"
import { graphql } from "~/gql"

import { getClient, useLoadedQuery } from "~/lib/urql"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

const QUERY = graphql(/* GraphQL */ `
  query HomeQuery {
    Media(id: 1) {
      id
      title {
        userPreferred
      }
      isFavourite
    }
  }
`)

const MUTATION = graphql(/* GraphQL */ `
  mutation HomeMutation($animeId: Int) {
    ToggleFavourite(animeId: $animeId) {
      __typename
    }
  }
`)

export const action = (async (args) => {
  const formData = await args.request.formData()
  await getClient(args.request)
    .mutation(MUTATION, HomeMutationVariables(formData))
    .toPromise()
}) satisfies ActionFunction

export const loader = (({ request }) => {
  return getClient(request).query(QUERY, {}).toPromise()
}) satisfies LoaderFunction

function HomeMutationVariables(data: FormData) {
  return {
    animeId: Number(data.get("animeId")),
    isFavourite: "true" === data.get("isFavourite"),
  }
}

export default function Index() {
  const [{ data }] = useLoadedQuery(
    {
      query: QUERY,
    },
    useLoaderData<typeof loader>().data,
  )

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <pre>{JSON.stringify(data)}</pre>

      <UrqlForm mutation={MUTATION} variables={HomeMutationVariables}>
        <input type="hidden" value={data?.Media?.id} name="animeId" />
        <input
          type="hidden"
          name="isFavourite"
          value={String(data?.Media?.isFavourite)}
        />

        <div className="flex gap-2">
          <ButtonElevated type="submit">Toggle</ButtonElevated>
          <ButtonFilled type="submit">Toggle</ButtonFilled>
          <ButtonTonal type="submit">Toggle</ButtonTonal>
          <ButtonOutlined type="submit">Toggle</ButtonOutlined>
          <Text type="submit">Toggle</Text>
        </div>
      </UrqlForm>

      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
