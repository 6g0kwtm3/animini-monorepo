import type { ComponentProps, ReactNode } from "react"
import { tv } from "~/lib/tailwind-variants"

export function Carousel(props: ComponentProps<"div">): ReactNode {
	const styles = createCarousel()

	return (
		<div
			{...props}
			className={styles.root({
				className: props.className,
			})}
			ref={(scroller) => {
				const controller = new AbortController()
				scroller?.addEventListener(
					"scrollsnapchanging",
					(e) => {
						scroller.dataset.active = e.snapTargetBlock?.id
					},
					{ signal: controller.signal }
				)
				return () => controller.abort()
			}}
		/>
	)
}

const mask =
	"[mask-image:linear-gradient(to_right,rgba(0,0,0,0.2)0%,rgb(0,0,0)20%,rgb(0,0,0)80%,rgba(0,0,0,0.2)100%)] px-4 py-2"

interface SnapEvent extends Event {
	snapTargetBlock?: HTMLElement
	snapTargetInline?: HTMLElement
}

declare global {
	interface GlobalEventHandlersEventMap {
		scrollsnapchanging: SnapEvent
	}
}

const createCarousel = tv({
	slots: {
		root: "my-2 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth",
		item: "pointer-events-auto shrink-0 snap-center snap-always",
	},
})

export function CarouselItem(props: ComponentProps<"div">): ReactNode {
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
