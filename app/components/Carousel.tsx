import type { ComponentPropsWithRef, ReactNode } from "react"
import { tv } from "~/lib/tailwind-variants"

export function Carousel(props: ComponentPropsWithRef<"div">): ReactNode {
	const styles = createCarousel()

	return (
		<div
			{...props}
			className={styles.root({
				className: props.className,
			})}
		/>
	)
}

 
const createCarousel = tv({
	slots: {
		root: "flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 py-2 [mask-image:linear-gradient(to_right,rgba(0,0,0,0.2)0%,rgb(0,0,0)20%,rgb(0,0,0)80%,rgba(0,0,0,0.2)100%)]",
		item: "pointer-events-auto shrink-0 snap-center",
	},
})

export function CarouselItem(props: ComponentPropsWithRef<"div">): ReactNode {
	return (
		<div
			{...props}
			className={createCarousel().item({
				className: props.className,
			})}
			draggable="false"
		/>
	)
}
