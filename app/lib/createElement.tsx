import type { ComponentPropsWithoutRef, ElementType } from "react"
import { cloneElement, isValidElement } from "react"

export function createElement(
	Type: ElementType,
	props: ComponentPropsWithoutRef<ElementType>
) {
	const { render, ...rest } = props
	if (isValidElement<any>(render)) {
		return cloneElement(render, {
			...rest,
			...render.props
		})
	}
	return <Type {...rest} />
}
