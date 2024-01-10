import type * as Ariakit from "@ariakit/react"
import { lazy, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { textField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { ClientOnly } from "remix-utils/client-only"

const { input } = textField({})

const SelectLazy = lazy(() => import("./SelectLazy"))

export function Select({
	children,
	options,
	store,
	...props
}: (ComponentPropsWithoutRef<typeof Ariakit.Select> &
	ComponentPropsWithoutRef<"select">) & {
	options: string[]
	children?: ReactNode
	store?: ComponentPropsWithoutRef<typeof Ariakit.Select>["store"]
}) {
	return (
		<ClientOnly
			fallback={
				<TextFieldOutlined>
					<select
						defaultValue={store?.getState().value ?? undefined}
						{...props}
						className={input({ className: "appearance-none" })}
					>
						{options.map((value) => {
							return (
								<option
									key={value}
									value={value}
									className="bg-surface-container text-label-lg text-on-surface surface elevation-2"
								>
									{value}
								</option>
							)
						})}
					</select>
					<TextFieldOutlined.Label>{children}</TextFieldOutlined.Label>
					<TextFieldOutlined.TrailingIcon className="pointer-events-none absolute right-0">
						expand_more
					</TextFieldOutlined.TrailingIcon>
				</TextFieldOutlined>
			}
		>
			{() => (
				<SelectLazy
					options={options}
					store={store}
					children={children}
					{...props}
				/>
			)}
		</ClientOnly>
	)
}
