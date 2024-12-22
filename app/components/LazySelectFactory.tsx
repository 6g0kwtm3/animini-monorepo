import * as Ariakit from "@ariakit/react"

import type { ReactNode } from "react"

import LazySelect from "./LazySelect"
import { TextFieldOutlined } from "./TextField"

export default function LazySelectFactory({
	label,

	...props
}: Omit<Ariakit.SelectProps, "ref"> & {
	children: ReactNode
	label: ReactNode
	name: string
}): ReactNode {
	return (
		<Ariakit.SelectProvider>
			<TextFieldOutlined>
				<LazySelect {...props} />
				<Ariakit.SelectLabel className="sr-only">{label}</Ariakit.SelectLabel>
				<TextFieldOutlined.Label htmlFor={props.name}>
					{label}
				</TextFieldOutlined.Label>
			</TextFieldOutlined>
		</Ariakit.SelectProvider>
	)
}
