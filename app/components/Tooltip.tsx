import * as Ariakit from "@ariakit/react"
import { AnimatePresence, motion } from "framer-motion"
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type PropsWithChildren
} from "react"

export function TooltipRich(
	props: ComponentPropsWithoutRef<typeof Ariakit.HovercardProvider>
) {
	return <Ariakit.HovercardProvider placement="bottom" {...props} />
}
export function TooltipRichTrigger({
	children,
	...props
}: PropsWithChildren<
	ComponentPropsWithoutRef<typeof Ariakit.HovercardAnchor>
>) {
	return (
		<Ariakit.HovercardAnchor render={<div />} {...props}>
			{children}
		</Ariakit.HovercardAnchor>
	)
}

export function TooltipRichContainer(
	props: ComponentPropsWithoutRef<typeof Ariakit.Hovercard>
) {
	return (
		<Ariakit.Hovercard
			gutter={8}
			{...props}
			className="rounded-md bg-surface-container px-4 pb-2 pt-3"
		/>
	)
}

export function TooltipRichSubhead(
	props: ComponentPropsWithoutRef<typeof Ariakit.HovercardHeading>
) {
	return (
		<Ariakit.HovercardHeading
			{...props}
			className="mb-2 text-title-sm text-on-surface-variant"
		/>
	)
}

export function TooltipRichSupportingText(
	props: ComponentPropsWithoutRef<"p">
) {
	return (
		<Ariakit.HovercardDescription
			{...props}
			className="text-body-md text-on-surface-variant"
		/>
	)
}

export function TooltipRichActions(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className="mt-3 flex flex-wrap gap-2" />
}

export function TooltipPlain(
	props: ComponentPropsWithoutRef<typeof Ariakit.TooltipProvider>
) {
	return <Ariakit.TooltipProvider hideTimeout={250} {...props} />
}
export const TooltipPlainTrigger = forwardRef<
	HTMLDivElement,
	PropsWithChildren<ComponentPropsWithoutRef<typeof Ariakit.TooltipAnchor>>
>(function TooltipPlainTrigger({ children, ...props }, ref) {
	return (
		<Ariakit.TooltipAnchor ref={ref} {...props}>
			{children}
		</Ariakit.TooltipAnchor>
	)
})

export function TooltipPlainContainer(
	props: ComponentPropsWithoutRef<typeof Ariakit.Tooltip>
) {
	const tooltip = Ariakit.useTooltipContext()
	if (!tooltip) {
		throw new Error("Tooltip must be wrapped in TooltipProvider")
	}
	const mounted = tooltip.useState("mounted")

	const y = tooltip.useState((state) => {
		const dir = state.currentPlacement.split("-")[0]!
		return dir === "top" ? -8 : 8
	})

	return (
		<AnimatePresence>
			{mounted && (
				<Ariakit.Tooltip
					gutter={4}
					alwaysVisible
					{...props}
					className="flex min-h-6 items-center rounded-xs bg-inverse-surface px-2 text-body-sm text-inverse-on-surface"
					render={
						<motion.div
							initial={{ opacity: 0, y }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y }}
						/>
					}
				/>
			)}
		</AnimatePresence>
	)
}

export function TouchTarget() {
	return (
		<span className="absolute left-1/2 top-1/2 h-[max(100%,3rem)] w-[max(100%,3rem)]  -translate-x-1/2 -translate-y-1/2" />
	)
}
