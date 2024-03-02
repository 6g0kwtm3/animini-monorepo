import { useSearchParams } from "@remix-run/react"

export function SearchParam(props: { name: string }) {
	const [searchParams] = useSearchParams()

	return (
		<input
			type="hidden"
			name={props.name}
			value={searchParams.get(props.name) ?? undefined}
		/>
	)
}
