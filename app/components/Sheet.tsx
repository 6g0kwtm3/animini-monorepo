import * as Ariakit from "@ariakit/react"

import type { ComponentProps, JSX, ReactNode } from "react"
import { createContext, use } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const sheet = tv(
	{
		slots: {
			root: "fixed flex flex-col overflow-hidden bg-surface-container-low transition-transform duration-2sm ease-emphasized data-[enter]:transform-none",
			backdrop: "",
			container:
				"overflow-auto overscroll-contain text-body-md text-on-surface",
			headline: "",
		},
		variants: {
			variant: {
				bottom: {
					root: "bottom-0 start-0 top-[4.5rem] mx-auto mb-0 mt-auto h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] translate-x-0 translate-y-full rounded-b-none rounded-t-xl min-[640px]:end-14 min-[640px]:start-14 min-[640px]:top-14 min-[640px]:max-h-[calc(100%-3.5rem)] min-[640px]:w-[calc(100%-7rem)] rtl:translate-x-0",
				},
				side: {
					root: "bottom-0 end-0 top-0 my-0 me-0 ms-auto h-full max-h-full w-[25rem] max-w-[25rem] translate-x-full translate-y-0 rounded-e-none rounded-s-xl rtl:-translate-x-full",
				},
			},
			modal: {
				true: {
					backdrop:
						"bg-scrim/40 opacity-0 transition-opacity duration-sm ease-emphasized data-[enter]:opacity-100",
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
			className="mx-auto my-[1.375rem] h-1 w-8 rounded-xs bg-on-surface-variant/[.4]"
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
