import type { ElementType, ReactElement, ReactNode } from "react"
import {
	cloneElement,
	createElement as createElement_,
	isValidElement,
} from "react"

export function createElement<
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
	P extends {
		render?: ReactElement
		className?: string
	},
>(Type: ElementType, props: P): ReactNode {
	const { render, ...rest } = props
	if (
		isValidElement<{
			className?: string
		}>(render)
	) {
		return cloneElement(render, {
			...rest,
			...render.props,
			className: [rest.className, render.props.className]
				.filter(Boolean)
				.join(" "),
		})
	}
	return createElement_(Type, rest) //<Type {...rest} />
}
