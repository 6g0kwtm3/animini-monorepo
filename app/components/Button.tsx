import type { ComponentPropsWithRef, FC, ReactNode } from "react"
import { createContext, forwardRef, use } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton } from "~/lib/button"
import { TouchTarget } from "./Tooltip"

export type Icon = FC<ComponentPropsWithRef<"div">>

interface ButtonProps
	extends Ariakit.ButtonProps,
		VariantProps<typeof createButton> {
	invoketarget?: string
	invokeaction?: string
}

export function Button({ variant, ...props }: ButtonProps): ReactNode {
	const styles = createButton({ variant })

	return (
		<ButtonContext.Provider value={styles}>
			<Ariakit.Button
				{...props}
				className={styles.root({
					className: props.className,
				})}
			/>
		</ButtonContext.Provider>
	)
}

const ButtonContext = createContext(createButton())
export function ButtonIcon(props: ComponentPropsWithRef<"div">): ReactNode {
	const { icon } = use(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

export const Icon = forwardRef<
	HTMLButtonElement,
	VariantProps<typeof btnIcon> & Ariakit.ButtonProps
>(function ButtonIcon({ children, variant, className, ...props }, ref) {
	return (
		<Ariakit.Button
			ref={ref}
			{...props}
			className={btnIcon({ variant, className })}
		>
			{children}
			<TouchTarget />
		</Ariakit.Button>
	)
})
