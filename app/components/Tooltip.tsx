import * as Ariakit from "@ariakit/react"
import { AnimatePresence, motion } from "framer-motion"
import type { ComponentPropsWithRef, PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"

import { createTV } from "tailwind-variants"

export function TooltipRich(props: Ariakit.HovercardProviderProps): ReactNode {
	return <Ariakit.HovercardProvider placement="bottom" {...props} />
}
export function TooltipRichTrigger(
	props: PropsWithChildren<Ariakit.HovercardAnchorProps>
): ReactNode {
	return <Ariakit.HovercardAnchor render={<div />} {...props} />
}

const tv = createTV({ twMerge: false })

const tooltip = tv({
	slots: { container: "" },
	variants: {
		variant: {
			rich: { container: "rounded-md bg-surface-container px-4 pb-2 pt-3" },
		},
	},
})
export function TooltipRichContainer(props: Ariakit.HovercardProps): ReactNode {
	const { container } = tooltip({ variant: "rich" })
	return (
		<Ariakit.Hovercard
			gutter={8}
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
			className="mb-2 text-title-sm text-on-surface-variant"
		/>
	)
}
export function TooltipRichSupportingText(
	props: ComponentPropsWithRef<"p">
): ReactNode {
	return (
		<Ariakit.HovercardDescription
			{...props}
			className="text-body-md text-on-surface-variant"
		/>
	)
}
export function TooltipRichActions(
	props: ComponentPropsWithRef<"div">
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
	// eslint-disable-next-line react-compiler/react-compiler
	const mounted = tooltip.useState("mounted")

	// eslint-disable-next-line react-compiler/react-compiler
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
export function TouchTarget(): ReactNode {
	return (
		<span className="absolute left-1/2 top-1/2 h-[max(100%,3rem)] w-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2" />
	)
}
