import type { ComponentProps } from "react"
import { type VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const divider = tv({
	base: "w-full border-x-0 border-b border-t-0 border-outline-variant",
	variants: {
		inset: {
			middle: "me-4 ms-4",
			start: "me-0 ms-4",
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
