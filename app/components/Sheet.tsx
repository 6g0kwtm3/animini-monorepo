import * as Ariakit from "@ariakit/react"
import {
	AnimatePresence,
	animate,
	motion,
	useMotionValue,
	useReducedMotion
} from "framer-motion"
import type { ComponentPropsWithoutRef } from "react"
import { createContext, useContext } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

const sheet = tv({
	slots: {
		root: "fixed bottom-0 left-0 top-[4.5rem] mx-auto my-0 mt-auto flex h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] translate-y-[100vh] transform-gpu flex-col overflow-hidden rounded-t-xl bg-surface-container-low transition-transform ease-out data-[enter]:translate-y-0 min-[640px]:left-14 min-[640px]:right-14 min-[640px]:top-14 min-[640px]:w-[calc(100%-7rem)]",
		backdrop:
			"bg-scrim/40 [@starting-style{&}]:opacity-0 transition-[opacity] opacity-100",
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

const Context = createContext(sheet())

export function Sheet({
	modal,
	variant,
	children,
	...props
}: VariantProps<typeof sheet> &
	ComponentPropsWithoutRef<typeof Ariakit.Dialog>) {
	const styles = sheet({ modal, variant })

	const y = useMotionValue(0)
	const reduced = useReducedMotion()

	return (
		<Context.Provider value={styles}>
			<AnimatePresence>
				{props.open && (
					<Ariakit.Dialog
						backdrop={<div className={styles.backdrop()} />}
						{...props}
						portal={false}
						open
						className={styles.root({ className: props.className })}
						render={
							<motion.section
								drag="y"
								dragElastic={0}
								dragMomentum={false}
								dragPropagation={false}
								dragConstraints={{ top: 0 }}
								style={{ y }}
								exit={{
									y: 9999
								}}
								animate={{ y: 0 }}
								initial={{
									y: 9999
								}}
								onDragEnd={(event, info) => {
									if (info.velocity.y > 500) {
										return props.onClose?.(event)
									}
									animate(y, 0, {
										type: "tween",
										...(reduced
											? {
													ease: "linear",
													duration: 0.01
												}
											: {
													ease: "easeOut",
													duration: 0.2
												})
									})
								}}
							/>
						}
					>
						{children}
					</Ariakit.Dialog>
				)}
			</AnimatePresence>
		</Context.Provider>
	)
}

export function SheetHandle() {
	return (
		<div className="mx-auto my-[1.375rem] h-1 w-8 rounded-xs bg-on-surface-variant/[.4]" />
	)
}

export function SheetBody(props) {
	const styles = useContext(Context)
	return (
		<div
			{...props}
			className={styles.container({ className: props.className })}
		/>
	)
}
