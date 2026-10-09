import { media, utilities } from "@anitrove/design"
import { create } from "@anitrove/unstyled"

export const styles = create({
	item: {
		...utilities.theme({
			[media.hover]: { base: "light", [media.dark]: "dark" },
			[media.focusWithin]: { base: "light", [media.dark]: "dark" },
		}),
		...utilities.contrast({
			[media.hover]: { base: "standard", [media.dark]: "high" },
			[media.focusWithin]: { base: "standard", [media.dark]: "high" },
		}),
	},
	avatar: { position: "relative" },
	subtitle: { display: "flex", flexWrap: "wrap", gap: ".25rem" },
})
