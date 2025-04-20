import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createTextField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { createMenu } from "~/lib/menu"

const { input } = createTextField({})
interface SelectFactoryProps extends Ariakit.SelectProps {
	children: ReactNode
	label: ReactNode
	name: string
}

export function SelectFactory({
	label,
	...props
}: SelectFactoryProps): ReactNode {
	return (
		<Ariakit.SelectProvider>
			<TextFieldOutlined>
				<Select {...props} />
				<Ariakit.SelectLabel className="sr-only">{label}</Ariakit.SelectLabel>
				<TextFieldOutlined.Label htmlFor={props.name}>
					{label}
				</TextFieldOutlined.Label>
			</TextFieldOutlined>
		</Ariakit.SelectProvider>
	)
}

const { root } = createMenu()

export function Select({ children, ...props }: Ariakit.SelectProps) {
	return (
		<>
			<Ariakit.Select
				{...props}
				className={input({ className: "cursor-default" })}
			/>
			<Ariakit.SelectPopover
				sameWidth
				className={root({
					className:
						"z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
				})}
			>
				{children}
			</Ariakit.SelectPopover>
		</>
	)
}
