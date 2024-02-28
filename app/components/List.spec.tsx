import { expect, test } from "@playwright/experimental-ct-react"

import { ReadonlyRecord } from "effect"
import type { ComponentPropsWithoutRef } from "react"
import MaterialSymbolsPersonOutline from "~icons/material-symbols/person-outline"
import { Checkbox } from "./Checkbox"
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemIcon,
	ListItemImg,
	ListItemTrailingSupportingText
} from "./List"

test.use({ viewport: { width: 500, height: 500 } })

const avatar = (
	<ListItemAvatar>
		<div className="flex items-center justify-center bg-primary-container text-on-primary-container">
			A
		</div>
	</ListItemAvatar>
)

const variants = {
	two: { subtitle: "Supporting text", text: "Two lines list" },
	one: { subtitle: null, text: "One line list" },
	three: {
		subtitle: "Supporting text that is long enough to fill up multiple lines",
		text: "Three line list"
	}
} satisfies Record<
	Extract<ComponentPropsWithoutRef<typeof List>["lines"], string>,
	any
>

test.describe(variants.two.text, () => {
	test.use({ viewport: { width: 350, height: 500 } })
	test.describe("responsive design", () => {
		test("subtitle should truncate", async ({ mount }) => {
			const component = await mount(
				<List lines="two">
					<ListItem>
						<ListItemContent>
							<ListItemContentTitle>Headline</ListItemContentTitle>
							<ListItemContentSubtitle>
								{variants.three.subtitle}
							</ListItemContentSubtitle>
						</ListItemContent>
					</ListItem>
				</List>
			)
			await expect(component).toHaveScreenshot()
		})
	})
})

for (const [lines, { text, subtitle }] of ReadonlyRecord.toEntries(variants))
	test.describe(text, () => {
		const leadings = {
			"With avatar": avatar,
			"With image or thumbnail": (
				<ListItemImg>
					<img src="" alt="" />
				</ListItemImg>
			),
			// "With video": <ListItemVideo />,
			"With icon": (
				<ListItemIcon>
					<MaterialSymbolsPersonOutline />
				</ListItemIcon>
			),
			"Text-only": null
		}

		for (const [text, leading] of ReadonlyRecord.toEntries(leadings))
			test.describe(text, () => {
				const trailings = {
					"and trailing checkbox": <Checkbox />,
					"": null
				}

				for (const [text, trailing] of ReadonlyRecord.toEntries(trailings))
					test.describe(text, () => {
						test("should match screenshot", async ({ mount }) => {
							const component = await mount(
								<List lines={lines}>
									<ListItem>
										{leading}
										<ListItemContent>
											<ListItemContentTitle>Headline</ListItemContentTitle>
											<ListItemContentSubtitle>
												{subtitle}
											</ListItemContentSubtitle>
										</ListItemContent>
										{trailing && (
											<ListItemTrailingSupportingText>
												{trailing}
											</ListItemTrailingSupportingText>
										)}
									</ListItem>
								</List>
							)
							await expect(component).toHaveScreenshot()
						})
					})
			})

		test.describe("responsive design", () => {
			test.use({
				colorScheme: "dark"
			})

			test("should match screenshot", async ({ mount }) => {
				const component = await mount(
					<List lines={lines}>
						<ListItem>
							{avatar}
							<ListItemContent>
								<ListItemContentTitle>Headline</ListItemContentTitle>
								<ListItemContentSubtitle>{subtitle}</ListItemContentSubtitle>
							</ListItemContent>
							<ListItemTrailingSupportingText>
								100+
							</ListItemTrailingSupportingText>
						</ListItem>
					</List>
				)
				await expect(component).toHaveScreenshot()
			})
		})
	})
