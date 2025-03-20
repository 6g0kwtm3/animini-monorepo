import * as Ariakit from "@ariakit/react"

import type { ComponentProps, JSX, ReactNode } from "react"
import { createContext, use } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const sheet = tv(
	{
		slots: {
			root: "bg-surface-container-low duration-2sm ease-emphasized fixed flex flex-col overflow-hidden transition-transform data-enter:transform-none",
			backdrop: "",
			container:
				"text-body-md text-on-surface overflow-auto overscroll-contain",
			headline: "",
		},
		variants: {
			variant: {
				bottom: {
					root: "start-0 top-[4.5rem] bottom-0 mx-auto mt-auto mb-0 h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] translate-x-0 translate-y-full rounded-t-xl rounded-b-none min-[640px]:start-14 min-[640px]:end-14 min-[640px]:top-14 min-[640px]:max-h-[calc(100%-3.5rem)] min-[640px]:w-[calc(100%-7rem)] rtl:translate-x-0",
				},
				side: {
					root: "end-0 top-0 bottom-0 my-0 ms-auto me-0 h-full max-h-full w-[25rem] max-w-[25rem] translate-x-full translate-y-0 rounded-s-xl rounded-e-none rtl:-translate-x-full",
				},
			},
			modal: {
				true: {
					backdrop:
						"bg-scrim/40 duration-sm ease-emphasized opacity-0 transition-opacity data-enter:opacity-100",
				},
				false: {},
			},
		},
		defaultVariants: {
			variant: "bottom",
			modal: true,
		},
	},
	{
		responsiveVariants: ["xl"],
	}
)

const Context = createContext(sheet())

export function Sheet({
	modal = true,
	variant,
	...props
}: VariantProps<typeof sheet> & Ariakit.DialogProps): JSX.Element {
	const styles = sheet({ modal: modal, variant })

	return (
		<Context value={styles}>
			<Ariakit.Dialog
				backdrop={<div className={styles.backdrop()} />}
				{...props}
				modal={modal}
				className={styles.root({ className: props.className })}
			/>
		</Context>
	)
}

export function SheetHandle(props: ComponentProps<"div">): ReactNode {
	return (
		<div
			className="bg-on-surface-variant/[.4] mx-auto my-[1.375rem] h-1 w-8 rounded-xs"
			{...props}
		/>
	)
}

export function SheetBody(props: ComponentProps<"div">): ReactNode {
	const styles = use(Context)
	return (
		<div
			{...props}
			className={styles.container({ className: props.className })}
		/>
	)
}
