import colors from "~/../colors.json"
import { LayoutPane } from "~/components/Layout"

export default function Page() {
	return (
		<>
			<LayoutPane>
				<div className="theme-[#d6ae6b]">
					<Palette></Palette>
				</div>
			</LayoutPane>
			<LayoutPane>
				<div className="theme-content-[#d6ae6b]">
					<Palette></Palette>
				</div>
			</LayoutPane>
			<LayoutPane>
				<Palette></Palette>
			</LayoutPane>
		</>
	)
}

const K_1 = 0.173
const K_2 = 0.004
const K_3 = (1.0 + K_1) / (1.0 + K_2)

function toeInv(x: number): number {
	return (x ** 2 + K_1 * x) / (K_3 * (x + K_2))
}

function Palette() {
	return (
		<ul className="grid grid-cols-4">
			{Object.entries(colors.dark).map(([color, value]) => {
				const [token = "", tone] = value.replaceAll(/(\d+)$/g, "_$1").split("_")

				return (
					<li
						key={color}
						className="p-4"
						style={{
							backgroundColor: `oklch(from var(--${token}) ${toeInv(Number(tone) / 100)} c h)`,
							color: `oklch(from var(--${token}) ${0.6 + toeInv(Number(tone) / 100)} c h)`
						}}
					>
						{color}
					</li>
				)
			})}
		</ul>
	)
}
