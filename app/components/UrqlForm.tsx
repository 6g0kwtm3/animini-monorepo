import { Form } from "@remix-run/react";
import type { PropsWithChildren } from "react";
import type { AnyVariables, TypedDocumentNode } from "urql";
import { useMutation } from "urql";

export function UrqlForm<V extends AnyVariables>(
  props: PropsWithChildren<{
    mutation: TypedDocumentNode<unknown, V>
    variables: (formData: FormData) => V
  }>
) {
  const [, execute] = useMutation<unknown, V>(props.mutation)

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        e.preventDefault()
        execute(props.variables(new FormData(e.currentTarget)))
      }}
    >
      {props.children}
    </Form>
  )
}
