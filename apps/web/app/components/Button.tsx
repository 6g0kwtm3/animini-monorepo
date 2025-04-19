import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, forwardRef, useContext } from "react"

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button({ variant, ...props }, ref) {
		const styles = createButton({ variant })

		return (
			<ButtonContext.Provider value={styles}>
				<Ariakit.Button
					ref={ref}
					{...props}
					className={styles.root({ className: props.className })}
				/>
			</ButtonContext.Provider>
		)
	}
)

const ButtonContext = createContext(createButton())
export function ButtonIcon(props: ComponentPropsWithoutRef<"div">): ReactNode {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

interface IconProps extends Ariakit.ButtonProps, VariantProps<typeof btnIcon> {}

export function Icon({ children, variant, className, ...props }: IconProps) {
	return (
		<Ariakit.Button {...props} className={btnIcon({ variant, className })}>
			{children}
			<TouchTarget />
		</Ariakit.Button>
	)
}
