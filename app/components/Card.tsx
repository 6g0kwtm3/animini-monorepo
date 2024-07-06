import type { ComponentPropsWithRef, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { card } from "~/lib/card"

export function Card({
	variant,
	...props
}: ComponentPropsWithRef<"section"> & VariantProps<typeof card>): ReactNode {
	return (
		<Ariakit.HeadingLevel>
			<article
				{...props}
				className={card({ variant: variant, className: props.className })}
			/>
		</Ariakit.HeadingLevel>
	)
}
