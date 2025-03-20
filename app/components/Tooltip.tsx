import * as Ariakit from "@ariakit/react"
import type { ComponentProps, PropsWithChildren, ReactNode } from "react"
import { tv } from "~/lib/tailwind-variants"

export function TooltipRich(props: Ariakit.HovercardProviderProps): ReactNode {
	return <Ariakit.HovercardProvider placement="bottom" {...props} />
}
export function TooltipRichTrigger(
	props: PropsWithChildren<Ariakit.HovercardAnchorProps>
): ReactNode {
	return <Ariakit.HovercardAnchor render={<div />} {...props} />
}

const tooltip = tv({
	slots: { container: "" },
	variants: {
		variant: {
			rich: { container: "bg-surface-container rounded-md px-4 pt-3 pb-2" },
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
			className="text-title-sm text-on-surface-variant mb-2"
		/>
	)
}
export function TooltipRichSupportingText(
	props: ComponentProps<"p">
): ReactNode {
	return (
		<Ariakit.HovercardDescription
			{...props}
			className="text-body-md text-on-surface-variant"
		/>
	)
}
export function TooltipRichActions(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="mt-3 flex flex-wrap gap-2" />
}
export function TooltipPlain(props: Ariakit.TooltipProviderProps): ReactNode {
	return <Ariakit.TooltipProvider hideTimeout={250} {...props} />
}
export function TooltipPlainTrigger(
	props: Ariakit.TooltipAnchorProps
): ReactNode {
	return <Ariakit.TooltipAnchor {...props} />
}

export function TooltipPlainContainer(props: Ariakit.TooltipProps): ReactNode {
	const tooltip = Ariakit.useTooltipContext()
	if (!tooltip) {
		throw new Error("Tooltip must be wrapped in TooltipProvider")
	}

	const y = Ariakit.useStoreState(tooltip, (state) => {
		const dir = state.currentPlacement.split("-")[0]!
		return dir === "top" ? -8 : 8
	})

	return (
		<Ariakit.Tooltip
			gutter={4}
			{...props}
			style={{ "--y": `${y}px` }}
			className="bg-inverse-surface text-body-sm text-inverse-on-surface duration-4sm ease-emphasized-accelerate z-50 flex min-h-6 translate-y-(--y) items-center rounded-xs px-2 opacity-0 data-open:translate-y-0 data-open:opacity-100 motion-safe:transition-all starting:data-open:translate-y-(--y) starting:data-open:opacity-0"
		/>
	)
}
export function TouchTarget(): ReactNode {
	return (
		<span className="absolute top-1/2 left-1/2 h-[max(100%,3rem)] w-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2" />
	)
}
