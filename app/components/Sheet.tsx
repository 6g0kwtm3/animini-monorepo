import * as Ariakit from "@ariakit/react"
import {
	AnimatePresence,
	animate,
	motion,
	useMotionValue,
	useTransform,
} from "framer-motion"
import type { ComponentPropsWithRef, JSX, ReactNode } from "react"
import { createContext, useContext } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

const sheet = tv({
	slots: {
		root: "fixed bottom-0 left-0 top-[4.5rem] mx-auto my-0 mt-auto flex h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] flex-col overflow-hidden rounded-t-xl bg-surface-container-low min-[640px]:left-14 min-[640px]:right-14 min-[640px]:top-14 min-[640px]:max-h-[calc(100%-3.5rem)] min-[640px]:w-[calc(100%-7rem)]",
		backdrop: "bg-scrim/[--opacity]",
		container:
			"flex w-full flex-col overflow-auto overscroll-contain text-body-md text-on-surface",
	},
	variants: {
		variant: {
			bottom: {},
			side: {},
		},
		modal: {
			true: {},
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
	modal,
	variant,
	...props
}: VariantProps<typeof sheet> & Ariakit.DialogProps): JSX.Element {
	const styles = sheet({ modal, variant })

	const y = useMotionValue(0)
	const h = window.innerHeight
	let opacity = useTransform(y, [0, h], [0.4, 0])

	return (
		<Context.Provider value={styles}>
			<AnimatePresence>
				{props.open && (
					<Ariakit.Dialog
						backdrop={
							<motion.div
								style={{ "--opacity": opacity }}
								className={styles.backdrop()}
							/>
						}
						{...props}
						open
						alwaysVisible
						className={styles.root({ className: props.className })}
						render={
							<motion.div
								drag="y"
								style={{ y }}
								animate={{ y: 0 }}
								exit={{ y: window.innerHeight }}
								dragConstraints={{ top: 0 }}
								dragElastic={{ top: 0 }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1],
								}}
								onDragEnd={(e, { offset, velocity }) => {
									if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
										props.onClose?.(e)
									} else {
										void animate(y, 0, {
											type: "inertia",
											bounceStiffness: 300,
											bounceDamping: 40,
											timeConstant: 300,
											min: 0,
											max: 0,
										})
									}
								}}
							/>
						}
					/>
				)}
			</AnimatePresence>
		</Context.Provider>
	)
}

export function SheetHandle(props: ComponentPropsWithRef<"div">): ReactNode {
	return (
		<div
			className="mx-auto my-[1.375rem] h-1 w-8 rounded-xs bg-on-surface-variant/[.4]"
			{...props}
		/>
	)
}

export function SheetBody(props: ComponentPropsWithRef<"div">): ReactNode {
	const styles = useContext(Context)
	return (
		<div
			{...props}
			className={styles.container({ className: props.className })}
		/>
	)
}
