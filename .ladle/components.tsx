import type { GlobalProvider } from "@ladle/react"
import { Card } from "../app/components/Card"
import "../app/tailwind.css"

export const Provider: GlobalProvider = ({
	children,
	globalState,
	storyMeta,
	config
}) => {
	return (
		<>
			<Card
				variant="elevated"
				className={`theme-light font-['Noto_Sans',sans-serif] palette-[#6751a4] [[data-theme='dark']_&]:theme-dark force:p-8 ${
					globalState.control?.background?.value
						? " palette-content-[--theme]"
						: ""
				}`}
				style={{
					"--theme": globalState.control?.background?.value || undefined
				}}
			>
				{children}
			</Card>
		</>
	)
}

// ;<div className="h-full w-full text-on-surface bg-surface theme-[#6751a4]">
// 	{children}
// </div>
export const argTypes = {
	background: {
		control: { type: "background" },
		options: ["#6751a4", "blue", "lime", "pink"],
		defaultValue: "#6751a4"
	}
}
