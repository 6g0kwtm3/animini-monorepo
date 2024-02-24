import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef } from "react"
import { createContext } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

const sheet = tv({
	slots: {
		root: "fixed bottom-0 left-0 top-[4.5rem] mx-auto my-0 mt-auto flex h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] translate-y-[100vh] transform-gpu overflow-hidden rounded-t-xl bg-surface-container-low transition-transform ease-out elevation-1 data-[enter]:translate-y-0 min-[640px]:left-14 min-[640px]:right-14 min-[640px]:top-14 min-[640px]:w-[calc(100%-7rem)]",
		backdrop:
			"bg-scrim/40 opacity-0 transition-[opacity] data-[enter]:opacity-100",
		container:
			"flex w-full flex-col overflow-auto overscroll-contain text-body-md text-on-surface"
	},
	variants: {
		variant: {
			bottom: {},
			side: {}
		},
		modal: {
			true: {},
			false: {}
		}
	},
	defaultVariants: {
		variant: "bottom",
		modal: true
	}
})

const AppBarContext = createContext(sheet())

export function Sheet({
	modal,
	variant,
	children,
	...props
}: VariantProps<typeof sheet> &
	ComponentPropsWithoutRef<typeof Ariakit.Dialog>) {
	const styles = sheet({ modal, variant })

	return (
		<AppBarContext.Provider value={styles}>
			<Ariakit.Dialog
				backdrop={<div className={styles.backdrop()} />}
				{...props}
				className={styles.root({ className: props.className })}
			>
				<section className={styles.container()}>{children}</section>
			</Ariakit.Dialog>
		</AppBarContext.Provider>
	)
}
