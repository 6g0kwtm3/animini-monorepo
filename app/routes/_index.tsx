import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { PropsWithChildren } from "react";
import {
  AnyVariables,
  TypedDocumentNode,
  UseQueryArgs,
  useMutation,
  useQuery,
} from "urql";
import { Elevated, Filled, Outlined, Text, Tonal } from "~/components/Button";
import { graphql } from "~/gql";
import { client } from "~/lib/client.server";
import { useLoadedQuery } from "~/lib/urql";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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
`);

const MUTATION = graphql(/* GraphQL */ `
  mutation HomeMutation($animeId: Int) {
    ToggleFavourite(animeId: $animeId) {
      __typename
    }
  }
`);

export const action = (async (args) => {
  const formData = await args.request.formData();
  await client.request(MUTATION, HomeMutationVariables(formData));
}) satisfies ActionFunction;

export const loader = (() => {
  return client.request(QUERY);
}) satisfies LoaderFunction;



function HomeMutationVariables(data: FormData) {
  return {
    animeId: Number(data.get("animeId")),
    isFavourite: "true" === data.get("isFavourite"),
  };
}

function UrqlForm<V extends AnyVariables>(
  props: PropsWithChildren<{
    mutation: TypedDocumentNode<unknown, V>;
    variables: (formData: FormData) => V;
  }>
) {
  const [, execute] = useMutation<unknown, V>(props.mutation);

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        execute(props.variables(new FormData(e.currentTarget)));
      }}
    >
      {props.children}
    </Form>
  );
}

export default function Index() {
  const [{ data }] = useLoadedQuery({
    query: QUERY,
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <pre>{JSON.stringify(data)}</pre>

      <UrqlForm mutation={MUTATION} variables={HomeMutationVariables}>
        <input type="hidden" value={data.Media?.id} name="animeId" />
        <input
          type="hidden"
          name="isFavourite"
          value={String(data.Media?.isFavourite)}
        />

        <div className="flex gap-2">
          <Elevated type="submit">Toggle</Elevated>
          <Filled type="submit">Toggle</Filled>
          <Tonal type="submit">Toggle</Tonal>
          <Outlined type="submit">Toggle</Outlined>
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
  );
}
