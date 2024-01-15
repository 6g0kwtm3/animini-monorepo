import type * as Ariakit from "@ariakit/react"
import {
	lazy,
	type ComponentPropsWithoutRef,
	type ReactNode
} from "react"
import { textField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { Suspense } from "react"
import { ClientOnly } from "remix-utils/client-only"

const { input } = textField({})

 
const LazySelectFactory = lazy(() => import("./LazySelectFactory"))

 
const LazySelect = lazy(() => import("./LazySelect"))

export function SelectFactory({
	label,

	...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> &
	ComponentPropsWithoutRef<"select"> & {
		children: ReactNode
		label: ReactNode
		name: string
	}) {
	const fallback = (
		<TextFieldOutlined>
			<select
				{...props}
				className={input({ className: "appearance-none" })}
			></select>
			<TextFieldOutlined.Label name={props.name}>
				{label}
			</TextFieldOutlined.Label>
			<TextFieldOutlined.TrailingIcon className="pointer-events-none absolute right-0">
				expand_more
			</TextFieldOutlined.TrailingIcon>
		</TextFieldOutlined>
	)

	return (
		<ClientOnly fallback={fallback}>
			{() => (
				<Suspense fallback={fallback}>
					<LazySelectFactory {...props} label={label}></LazySelectFactory>
				</Suspense>
			)}
		</ClientOnly>
	)
}

export function Select({
	...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> &
	ComponentPropsWithoutRef<"select"> & {
		children: ReactNode
		name: string
	}) {
	const fallback = (
		<select
			{...props}
			className={input({ className: "appearance-none" })}
		></select>
	)

	return (
		<ClientOnly fallback={fallback}>
			{() => (
				<Suspense fallback={fallback}>
					<LazySelect {...props}></LazySelect>
				</Suspense>
			)}
		</ClientOnly>
	)
}
