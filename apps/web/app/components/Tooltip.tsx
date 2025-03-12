import * as Ariakit from "@ariakit/react"
import { AnimatePresence, motion } from "framer-motion"
import type {
	ComponentPropsWithoutRef,
	PropsWithChildren,
	ReactNode,
} from "react"
import { forwardRef } from "react"

export function TooltipRich(props: Ariakit.HovercardProviderProps): ReactNode {
	return <Ariakit.HovercardProvider placement="bottom" {...props} />
}
export function TooltipRichTrigger(
	props: PropsWithChildren<Ariakit.HovercardAnchorProps>
): ReactNode {
	return <Ariakit.HovercardAnchor render={<div />} {...props} />
}

import { tv } from "~/lib/tailwind-variants"

const tooltip = tv({
	slots: { container: "" },
	variants: {
		variant: {
			rich: { container: "bg-surface-container rounded-md px-4 pb-2 pt-3" },
		},
	},
})
export function TooltipRichContainer(props: Ariakit.HovercardProps): ReactNode {
	const { container } = tooltip({ variant: "rich" })
	return (
		<Ariakit.Hovercard
			gutter={8}
			portal={true}
			{...props}
			className={container({ className: props.className })}
		/>
	)
}
export function TooltipRichSubhead(
	props: Ariakit.HovercardHeadingProps
): ReactNode {
	return (
		<Ariakit.HovercardHeading
			{...props}
			className="text-title-sm text-on-surface-variant mb-2"
		/>
	)
}
export function TooltipRichSupportingText(
	props: ComponentPropsWithoutRef<"p">
): ReactNode {
	return (
		<Ariakit.HovercardDescription
			{...props}
			className="text-body-md text-on-surface-variant"
		/>
	)
}
export function TooltipRichActions(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="mt-3 flex flex-wrap gap-2" />
}
export function TooltipPlain(props: Ariakit.TooltipProviderProps): ReactNode {
	return <Ariakit.TooltipProvider hideTimeout={250} {...props} />
}
export const TooltipPlainTrigger = forwardRef<
	HTMLDivElement,
	PropsWithChildren<Ariakit.TooltipAnchorProps>
>(function TooltipPlainTrigger({ children, ...props }, ref): ReactNode {
	return (
		<Ariakit.TooltipAnchor ref={ref} {...props}>
			{children}
		</Ariakit.TooltipAnchor>
	)
})
export function TooltipPlainContainer(props: Ariakit.TooltipProps): ReactNode {
	const tooltip = Ariakit.useTooltipContext()
	if (!tooltip) {
		throw new Error("Tooltip must be wrapped in TooltipProvider")
	}

	const mounted = Ariakit.useStoreState(tooltip, "mounted")

	const y = Ariakit.useStoreState(tooltip, (state) => {
		const dir = state.currentPlacement.split("-")[0]
		return dir === "top" ? -8 : 8
	})

	return (
		<AnimatePresence>
			{mounted && (
				<Ariakit.Tooltip
					gutter={4}
					alwaysVisible
					{...props}
					className="bg-inverse-surface text-body-sm text-inverse-on-surface rounded-xs flex min-h-6 items-center px-2"
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
export function TouchTarget(): ReactNode {
	return (
		<span className="absolute left-1/2 top-1/2 h-[max(100%,3rem)] w-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2" />
	)
}
