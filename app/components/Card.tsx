import type { ComponentProps, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { card, cardBody, cardFooter, cardHeader } from "~/lib/card"

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

export function CardBody({
	...props
}: ComponentProps<"div"> & VariantProps<typeof cardBody>): ReactNode {
	return <div {...props} className={cardBody({ className: props.className })} />
}

export function CardHeader({
	...props
}: ComponentProps<"header"> & VariantProps<typeof cardBody>): ReactNode {
	return (
		<header {...props} className={cardHeader({ className: props.className })} />
	)
}

export function CardFooter({
	...props
}: ComponentProps<"footer"> & VariantProps<typeof cardBody>): ReactNode {
	return (
		<footer {...props} className={cardFooter({ className: props.className })} />
	)
}
