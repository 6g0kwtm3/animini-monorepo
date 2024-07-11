import * as Ariakit from "@ariakit/react"

import { useMotionValue, useTransform } from "framer-motion"
import type { ComponentProps, JSX, ReactNode } from "react"
import { createContext, use } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const sheet = tv({
	slots: {
		root: "fixed bottom-0 left-0 top-[4.5rem] mx-auto my-0 mt-auto flex h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] flex-col overflow-hidden rounded-t-xl bg-surface-container-low min-[640px]:left-14 min-[640px]:right-14 min-[640px]:top-14 min-[640px]:max-h-[calc(100%-3.5rem)] min-[640px]:w-[calc(100%-7rem)]",
		backdrop: "",
		container:
			"flex w-full flex-col overflow-auto overscroll-contain text-body-md text-on-surface",
		headline: "",
	},
	variants: {
		variant: {
			bottom: {},
			side: {},
		},
		modal: {
			true: { backdrop: "bg-scrim/40" },
			false: {},
		},
	},
	defaultVariants: {
		variant: "bottom",
		modal: true,
	},
})

const Context = createContext(sheet())

export function Sheet({
	modal = true,
	variant,
	...props
}: VariantProps<typeof sheet> & Ariakit.DialogProps): JSX.Element {
	const styles = sheet({ modal: modal, variant })

	const y = useMotionValue(0)
	const h = window.innerHeight
	let opacity = useTransform(y, [0, h], [0.4, 0])

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
