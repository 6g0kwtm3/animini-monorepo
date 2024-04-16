import {
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
	type ActionFunction
} from "@remix-run/cloudflare"
import { Form, useActionData, useNavigation } from "@remix-run/react"

export const action = (async ({ request, context }) => {
	console.log("action")
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler({ maxPartSize: 3 * 1000 * 1000 * 1000 })
	)

	const file = formData.get("file")
	console.log(file)
	if (file instanceof File) {
		await context.cloudflare.env.MY_KV.put("file", await file.arrayBuffer(), {
			expirationTtl: 3600
		})

		return { message: "uploaded" }
	}

	return { message: "not uploaded" }
}) satisfies ActionFunction

export default function Page() {
	const data = useActionData<typeof action>()
	const navigation = useNavigation()

	return (
		<Form method="post" encType="multipart/form-data">
			{navigation.state}
			{data?.message}
			<input type="file" name="file" />
			<button type="submit">Click me</button>
		</Form>
	)
}
