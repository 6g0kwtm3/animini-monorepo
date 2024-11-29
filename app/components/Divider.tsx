import type { ComponentProps } from "react"
import { type VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const divider = tv({
	base: "border-outline-variant w-full border-x-0 border-t-0 border-b",
	variants: {
		inset: {
			middle: "ms-4 me-4",
			start: "ms-4 me-0",
		},
	},
})

export function Divider({
	inset,
	...props
}: ComponentProps<"hr"> & VariantProps<typeof divider>): React.ReactElement {
	return (
		<hr
			className={divider({
				className: props.className,
				inset,
			})}
		/>
	)
}
