import colors from "~/../colors.json"
import { LayoutBody, LayoutPane } from "~/components/Layout"

export default function Page() {
	return (
		<LayoutBody>
			<LayoutPane>
				<div className="grid grid-cols-2 gap-8">
					<div className="theme-[AccentColor]">
						<Palette />
					</div>
					<div className="theme-[#6751a4] ">
						<Palette />
					</div>
					<div className="theme-[#d6ae6b]">
						<Palette />
					</div>
					<div className="theme-content-[#d6ae6b]">
						<Palette />
					</div>
				</div>
			</LayoutPane>
		</LayoutBody>
	)
}

const K_1 = 0.173
const K_2 = 0.004
const K_3 = (1.0 + K_1) / (1.0 + K_2)

function toeInv(x: number): number {
	return (x ** 2 + K_1 * x) / (K_3 * (x + K_2))
}

function ColorItem() {
	return (
		<li
			className="p-4"
			style={{
				backgroundColor: `var(--${color})`,
				color: `var(--on-${color})`
			}}
		>
			{color.substring(0, 1).toUpperCase() + color.substring(1)}
		</li>
	)
}

function Palette() {
	return (
		<ul className="grid">
			{["primary", "secondary", "tertiary", "error"].map((color) => {
				return (
					<li key={color}>
						<h1>{color.substring(0, 1).toUpperCase() + color.substring(1)}</h1>
						<ul className="grid grid-cols-4">
							<li
								className="p-4"
								style={{
									backgroundColor: `var(--${color})`,
									color: `var(--on-${color})`
								}}
							>
								{color.substring(0, 1).toUpperCase() + color.substring(1)}
							</li>
							<li
								className="p-4"
								style={{
									backgroundColor: `var(--${color}-container)`,
									color: `var(--on-${color}-container)`
								}}
							>
								{color.substring(0, 1).toUpperCase() + color.substring(1)}{" "}
								Container
							</li>
						</ul>
					</li>
				)
			})}

			<li>
				<h1>Neutral</h1>
				<ul className="grid grid-cols-4">
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--background)`,
							color: `var(--on-background)`
						}}
					>
						Background
					</li>
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--surface-container)`,
							color: `var(--on-surface-container)`
						}}
					>
						Surface
					</li>
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--surface-variant)`,
							color: `var(--on-surface-variant)`
						}}
					>
						Surface Variant
					</li>
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--outline)`,
							color: `var(--on-outline)`
						}}
					>
						Outline
					</li>
				</ul>
			</li>

			<li>
				<h1>Inverse</h1>
				<ul className="grid grid-cols-4">
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--inverse-surface)`,
							color: `var(--inverse-on-surface)`
						}}
					>
						Inverse Surface
					</li>
					<li
						className="p-4"
						style={{
							backgroundColor: `var(--inverse-primary)`
						}}
					>
						Inverse Primary
					</li>
				</ul>
			</li>
		</ul>
	)
}
