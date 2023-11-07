import { Form } from "@remix-run/react"
import type { PropsWithChildren } from "react"
import type { AnyVariables, TypedDocumentNode } from "urql"
import { useMutation } from "urql"

export function UrqlForm<V extends AnyVariables>(
  props: PropsWithChildren<{
    mutation: TypedDocumentNode<unknown, V>
    variables: (formData: FormData) => V
  }>,
) {
  const [, execute] = useMutation<unknown, V>(props.mutation)

  return (
    <Form
      method="post"
      onSubmit={(event) => {
        event.preventDefault()
        execute(props.variables(new FormData(event.currentTarget)))
      }}
    >
      {props.children}
    </Form>
  )
}
