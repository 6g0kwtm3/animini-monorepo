import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createTextField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { createMenu } from "~/lib/menu"

const { input } = createTextField({})
interface SelectFactoryProps extends Ariakit.ComboboxSelectProps {
	children: ReactNode
	label: ReactNode
	name: string
}

export function SelectFactory({
	label,
	...props
}: SelectFactoryProps): ReactNode {
	return (
		<Ariakit.ComboboxProvider>
			<TextFieldOutlined>
				<Select {...props} />
				<Ariakit.ComboboxSelectLabel className="sr-only">
					{label}
				</Ariakit.ComboboxSelectLabel>
				<TextFieldOutlined.Label htmlFor={props.name}>
					{label}
				</TextFieldOutlined.Label>
			</TextFieldOutlined>
		</Ariakit.ComboboxProvider>
	)
}

const { root } = createMenu()

export function Select({ children, ...props }: Ariakit.ComboboxSelectProps) {
	return (
		<>
			<Ariakit.ComboboxSelect
				{...props}
				className={input({ className: "cursor-default" })}
			/>
			<Ariakit.ComboboxPopover
				sameWidth
				className={root({
					className:
						"z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
				})}
			>
				{children}
			</Ariakit.ComboboxPopover>
		</>
	)
}
