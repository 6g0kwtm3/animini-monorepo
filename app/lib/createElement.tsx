import type { ComponentPropsWithRef, ElementType, ReactNode } from "react"
import { cloneElement, isValidElement } from "react"

export function createElement(
	Type: ElementType,
	props: ComponentPropsWithRef<ElementType>
): ReactNode {
	const { render, ...rest } = props
	if (isValidElement<any>(render)) {
		return cloneElement(render, {
			...rest,
			...render.props,
			className: [rest.className, render.props.className]
				.filter(Boolean)
				.join(" "),
		})
	}
	return <Type {...rest} />
}
