import { useSearchParams } from "@remix-run/react"

import type { ReactNode } from "react"
export function SearchParam(props: { name: string }): ReactNode {
	const [searchParams] = useSearchParams()

	return (
		<input
			type="hidden"
			name={props.name}
			value={searchParams.get(props.name) ?? undefined}
		/>
	)
}
