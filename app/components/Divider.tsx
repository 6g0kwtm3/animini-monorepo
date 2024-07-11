import type { ComponentProps } from "react"
import { tv, type VariantProps } from "tailwind-variants"



const divider = tv({
	base: "w-full border border-outline-variant",
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
