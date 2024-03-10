import * as Ariakit from "@ariakit/react"

import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import LazySelect from "./LazySelect"
import { TextFieldOutlined } from "./TextField"

export default function LazySelectFactory({
	label,

	...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> & {
	children: ReactNode
	label: ReactNode
	name: string
}):JSX.Element {
	return (
		<Ariakit.SelectProvider>
			<TextFieldOutlined>
				<LazySelect {...props} />
				<Ariakit.SelectLabel className="sr-only">{label}</Ariakit.SelectLabel>
				<TextFieldOutlined.Label name={props.name}>
					{label}
				</TextFieldOutlined.Label>
			</TextFieldOutlined>
		</Ariakit.SelectProvider>
	)
}
