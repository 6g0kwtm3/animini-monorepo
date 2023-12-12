
import * as Ariakit from "@ariakit/react"
import { Predicate } from "effect"

import { menu } from "~/lib/menu"
import { textField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"
import type{ ComponentPropsWithoutRef,ReactNode } from "react"

const { input } = textField({})
const { root, item } = menu()


export default function SelectLazy({
	children,
	options,
	defaultValue,

	...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> & {
	options: string[]
	children?: ReactNode
}) {
  return  <Ariakit.SelectProvider
					{...(Predicate.isString(defaultValue) || Array.isArray(defaultValue)
						? { defaultValue }
						: {})}
				>
					<TextFieldOutlined>
						<Ariakit.SelectLabel className="sr-only">
							{children}
						</Ariakit.SelectLabel>
						<Ariakit.Select
							{...props}	className={input({ className: "cursor-default" })}
						
						/>
						<TextFieldOutlined.Label>{children}</TextFieldOutlined.Label>
						<Ariakit.SelectPopover
							sameWidth
							className={root({
								className:
									"z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
							})}
						>
							{options.map((value) => (
								<Ariakit.SelectItem
									className={item({
										className: "data-[active-item]:state-focus",
									})}
									value={value}
									key={value}
								/>
							))}
						</Ariakit.SelectPopover>
					</TextFieldOutlined>
				</Ariakit.SelectProvider>
}