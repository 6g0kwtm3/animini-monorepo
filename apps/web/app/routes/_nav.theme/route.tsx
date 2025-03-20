import type { ReactNode } from "react"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { Ariakit } from "~/lib/ariakit"
import { getThemeFromHex } from "~/lib/theme"

export default function Page(): ReactNode {
	return (
		<LayoutBody>
			<LayoutPane>
				<div className="grid grid-cols-2 gap-8">
					<div
						style={getThemeFromHex("#6751a4")}
						className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
					>
						<Palette />
					</div>
					<div
						style={getThemeFromHex("#d6ae6b")}
						className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
					>
						<Palette />
					</div>
				</div>
			</LayoutPane>
		</LayoutBody>
	)
}

function ColorItem({
	color,
	children,
	text,
}: {
	color: string
	text?: string
	children?: ReactNode
}) {
	return (
		<li
			className="p-4"
			style={{
				backgroundColor: `var(--${color})`,
				color: text ? `var(--${text})` : `var(--on-${color})`,
			}}
		>
			{children ??
				color.substring(0, 1).toUpperCase() +
					color
						.replaceAll(/-[a-z]/g, (s) => s.substring(1).toUpperCase())
						.substring(1)}
		</li>
	)
}

function Palette() {
	return (
		<ul className="grid">
			{["primary", "secondary", "tertiary", "error"].map((color) => {
				return (
					<li key={color}>
						<Ariakit.Heading>
							{color.substring(0, 1).toUpperCase() + color.substring(1)}
						</Ariakit.Heading>
						<ul className="grid grid-cols-4">
							<ColorItem color={color} />
							<ColorItem color={`${color}-container`}>
								{color.substring(0, 1).toUpperCase() + color.substring(1)}{" "}
								Container
							</ColorItem>
						</ul>
					</li>
				)
			})}

			<li>
				<Ariakit.Heading>Neutral</Ariakit.Heading>
				<ul className="grid grid-cols-4">
					<ColorItem color="surface-container">Surface</ColorItem>
					<ColorItem color="surface-variant" />
					<ColorItem color="outline" />
				</ul>
			</li>

			<li>
				<Ariakit.Heading>Inverse</Ariakit.Heading>
				<ul className="grid grid-cols-4">
					<ColorItem color="inverse-surface" text="inverse-on-surface" />
					<ColorItem color="inverse-primary" />
				</ul>
			</li>
		</ul>
	)
}
