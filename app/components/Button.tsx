import type { ComponentProps, ReactNode } from "react"
import { createContext, use } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton } from "~/lib/button"
import { TouchTarget } from "./Tooltip"

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
export function ButtonIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = use(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

export function Icon({
	children,
	variant,
	className,
	...props
}: VariantProps<typeof btnIcon> & Ariakit.ButtonProps): ReactNode {
	return (
		<Ariakit.Button {...props} className={btnIcon({ variant, className })}>
			{children}
			<TouchTarget />
		</Ariakit.Button>
	)
}
