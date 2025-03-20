import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createTextFieldInput } from "~/lib/textField"
import { FieldContainer, FieldTextLabel } from "./TextField"

// const onClient = Promise.resolve(null)
import { forwardRef } from "react"
import { createMenu } from "~/lib/menu"

const { input } = createTextFieldInput({})

export function SelectFactory({
	label,
	...props
}: Ariakit.SelectProps & {
	children: ReactNode
	label: ReactNode
	name: string
}): ReactNode {
	return (
		<Ariakit.SelectProvider>
			<FieldContainer>
				<div className="group/suffix peer relative flex flex-1 items-center">
					<Select {...props} />
					<Ariakit.SelectLabel className="sr-only">{label}</Ariakit.SelectLabel>
					<FieldTextLabel htmlFor={props.name}>{label}</FieldTextLabel>
				</div>
			</FieldContainer>
		</Ariakit.SelectProvider>
	)
}

const { root } = createMenu()

export const Select = forwardRef<HTMLButtonElement, Ariakit.SelectProps>(
	function Select({ children, ...props }, ref) {
		return (
			<>
				<Ariakit.Select
					ref={ref}
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
)
