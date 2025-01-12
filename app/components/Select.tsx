import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { createTextField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { Suspense, lazy } from "react"

const { input } = createTextField({})

const LazySelectFactory = lazy(async () => import("./LazySelectFactory"))

const LazySelect = lazy(async () => import("./LazySelect"))
export function SelectFactory({
	label,

	...props
}: (Omit<Ariakit.SelectProps, "ref"> & ComponentPropsWithoutRef<"select">) & {
	children: ReactNode
	label: ReactNode
	name: string
}): ReactNode {
	const form = Ariakit.useFormContext()
	if (!form) throw new Error("FormSelect must be used within a Form")
	// eslint-disable-next-line react-compiler/react-compiler
	const value = form.useValue(props.name)

	const fallback = (
		<TextFieldOutlined>
			<Ariakit.FormControl
				name={props.name}
				render={
					<select
						{...props}
						value={value}
						onChange={(e) => form.setValue(props.name, e.currentTarget.value)}
						className={input({ className: "appearance-none" })}
					/>
				}
			/>
			<TextFieldOutlined.Label name={props.name}>
				{label}
			</TextFieldOutlined.Label>
			<TextFieldOutlined.TrailingIcon className="pointer-events-none absolute right-0">
				expand_more
			</TextFieldOutlined.TrailingIcon>
		</TextFieldOutlined>
	)

	return (
		<Suspense fallback={fallback}>
			<LazySelectFactory {...props} label={label} />
		</Suspense>
	)
}

export function Select({
	...props
}: (Omit<Ariakit.SelectProps, "ref"> & ComponentPropsWithoutRef<"select">) & {
	children: ReactNode
	name: string
}): ReactNode {
	const fallback = (
		<select {...props} className={input({ className: "appearance-none" })} />
	)

	return (
		<Suspense fallback={fallback}>
			<LazySelect {...props} />
		</Suspense>
	)
}
