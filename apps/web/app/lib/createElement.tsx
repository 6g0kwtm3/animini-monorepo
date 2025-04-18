import type {
	ComponentPropsWithRef,
	ElementType,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	Ref,
	RefCallback,
	RefObject,
} from "react"
import { cloneElement, isValidElement, useMemo } from "react"

/**
 * Render prop type.
 * @template P Props
 * @example
 * const children: RenderProp = (props) => <div {...props} />;
 */
export type RenderProp<P = HTMLAttributes<unknown> & { ref?: Ref<unknown> }> = (
	props: P
) => ReactNode

export interface Options {
	/**
	 * Allows the component to be rendered as a different HTML element or React
	 * component. The value can be a React element or a function that takes in the
	 * original component props and gives back a React element with the props
	 * merged.
	 *
	 * Check out the [Composition](https://ariakit.org/guide/composition) guide
	 * for more details.
	 */
	render?: RenderProp | ReactElement
}

/**
 * Sets both a function and object React ref.
 */
export function setRef<T>(
	ref: RefCallback<T> | RefObject<T> | null | undefined,
	value: T
) {
	if (typeof ref === "function") {
		ref(value)
	} else if (ref) {
		ref.current = value
	}
}

export function isValidElementWithRef<P extends { ref?: Ref<unknown> }>(
	element: unknown
): element is ReactElement<P> & { ref?: Ref<unknown> } {
	if (!element) return false
	if (!isValidElement<{ ref?: Ref<unknown> }>(element)) return false
	if ("ref" in element.props) return true
	if ("ref" in element) return true
	return false
}

export function getRefProperty(element: unknown) {
	if (!isValidElementWithRef(element)) return null
	const props = { ...element.props }
	return props.ref ?? element.ref
}

export function mergeRefs<T>(
	...refs: (Ref<T> | undefined)[]
): Ref<T> | undefined {
	if (!refs.some(Boolean)) return

	return (value: T) => {
		for (const ref of refs) {
			setRef(ref, value)
		}
	}
}

/**
 * HTML props based on the element type, excluding custom props.
 * @template T The element type.
 * @template P Custom props.
 * @example
 * type ButtonHTMLProps = HTMLProps<"button", { custom?: boolean }>;
 */
export type HTMLProps<T extends ElementType, P extends object = object> = Omit<
	ComponentPropsWithRef<T>,
	keyof P
>
	& Record<`data-${string}`, unknown>

/**
 * Props based on the element type, including custom props.
 * @template T The element type.
 * @template P Custom props.
 */
export type Props<T extends ElementType, P extends object = object> = P
	& HTMLProps<T, P>

/**
 * Merges two sets of props.
 */
export function mergeProps<T extends HTMLAttributes<unknown>>(
	base: T,
	overrides: T
) {
	const props = { ...base }

	for (const key in overrides) {
		if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue

		if (key === "className") {
			const prop = "className"
			props[prop] = base[prop]
				? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					`${base[prop]} ${overrides[prop]}`
				: overrides[prop]
			continue
		}

		if (key === "style") {
			const prop = "style"
			props[prop] = base[prop]
				? { ...base[prop], ...overrides[prop] }
				: overrides[prop]
			continue
		}

		const overrideValue = overrides[key]

		if (typeof overrideValue === "function" && key.startsWith("on")) {
			const baseValue = base[key]
			if (typeof baseValue === "function") {
				type EventKey = Extract<keyof HTMLAttributes<unknown>, `on${string}`>
				props[key as EventKey] = (...args) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					overrideValue(...args)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					baseValue(...args)
				}
				continue
			}
		}

		props[key] = overrideValue
	}

	return props
}

export function useCreateElement(
	Type: ElementType,
	props: Props<ElementType, Options>
): ReactNode {
	const { render, ...rest } = props

	const refProperty = getRefProperty(render)
	const mergedRef = useMemo(
		() => mergeRefs(props.ref as Ref<unknown> | undefined, refProperty),
		[props.ref, refProperty]
	)

	let element: ReactNode

	if (isValidElement<unknown>(render)) {
		const renderProps = { ...(render.props as typeof rest), ref: mergedRef }
		element = cloneElement(render, mergeProps(rest, renderProps))
	} else if (render) {
		element = render(rest)
	} else {
		element = <Type {...rest} />
	}

	return element
}
