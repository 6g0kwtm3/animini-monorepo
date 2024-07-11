import type { ComponentProps, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { card } from "~/lib/card"

export function Card({
	variant,
	...props
}: ComponentProps<"section"> & VariantProps<typeof card>): ReactNode {
	return (
		<Ariakit.HeadingLevel>
			<article
				{...props}
				className={card({ variant: variant, className: props.className })}
			/>
		</Ariakit.HeadingLevel>
	)
}
