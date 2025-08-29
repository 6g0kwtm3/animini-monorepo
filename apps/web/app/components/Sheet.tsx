import * as Ariakit from "@ariakit/react"
import {
	AnimatePresence,
	animate,
	motion,
	useMotionValue,
	useTransform,
} from "motion/react"
import type { ComponentProps, JSX, ReactNode } from "react"
import { createContext, useContext } from "react"
import type { VariantProps } from "tailwind-variants"

import { tv } from "~/lib/tailwind-variants"

const sheet = tv({
	defaultVariants: { modal: true, variant: "bottom" },
	slots: {
		backdrop: "bg-scrim/(--opacity)",
		container:
			"text-body-md text-on-surface flex w-full flex-col overflow-auto overscroll-contain",
		root: "bg-surface-container-low fixed bottom-0 left-0 top-[4.5rem] mx-auto my-0 mt-auto flex h-fit max-h-[calc(100%-4.5rem)] w-full max-w-[40rem] flex-col overflow-hidden rounded-t-xl min-[640px]:left-14 min-[640px]:right-14 min-[640px]:top-14 min-[640px]:max-h-[calc(100%-3.5rem)] min-[640px]:w-[calc(100%-7rem)]",
	},
	variants: {
		modal: { false: {}, true: {} },
		variant: { bottom: {}, side: {} },
	},
})

const Context = createContext(sheet())

interface SheetProps extends Ariakit.DialogProps, VariantProps<typeof sheet> {}

export function Sheet({ modal, variant, ...props }: SheetProps): JSX.Element {
	const styles = sheet({ modal, variant })

	const y = useMotionValue(0)
	const h = window.innerHeight
	const opacity = useTransform(y, [0, h], [0.4, 0])

	return (
		<Context.Provider value={styles}>
			<AnimatePresence>
				{props.open && (
					<Ariakit.Dialog
						backdrop={
							<motion.div
								className={styles.backdrop()}
								style={{ "--opacity": opacity }}
							/>
						}
						{...props}
						alwaysVisible
						className={styles.root({ className: props.className })}
						open
						render={
							<motion.div
								animate={{ y: 0 }}
								drag="y"
								dragConstraints={{ top: 0 }}
								dragElastic={{ top: 0 }}
								exit={{ y: window.innerHeight }}
								onDragEnd={(e, { offset, velocity }) => {
									if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
										props.onClose?.(e)
									} else {
										void animate(y, 0, {
											bounceDamping: 40,
											bounceStiffness: 300,
											max: 0,
											min: 0,
											timeConstant: 300,
											type: "inertia",
										})
									}
								}}
								style={{ y }}
								transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
							/>
						}
					/>
				)}
			</AnimatePresence>
		</Context.Provider>
	)
}

export function SheetBody(props: ComponentProps<"div">): ReactNode {
	const styles = useContext(Context)
	return (
		<div
			{...props}
			className={styles.container({ className: props.className })}
		/>
	)
}

function SheetHandle(props: ComponentProps<"div">): ReactNode {
	return (
		<div
			className="bg-on-surface-variant/[.4] rounded-xs mx-auto my-[1.375rem] h-1 w-8"
			{...props}
		/>
	)
}
