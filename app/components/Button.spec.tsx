import { expect, test } from "@playwright/experimental-ct-react"
import { ReadonlyRecord } from "effect"
import type { ComponentPropsWithoutRef } from "react"
import { Button, ButtonIcon } from "./Button"

import MaterialSymbolsAdd from "~icons/material-symbols/add"

test.use({ viewport: { width: 500, height: 500 } })

const variants: Record<
	NonNullable<ComponentPropsWithoutRef<typeof Button>["variant"]>,
	string
> = {
	text: "Text button",
	outlined: "Outlined button",
	elevated: "Elevated button",
	filled: "Filled button",
	tonal: "Tonal button"
}

for (const [variant, text] of ReadonlyRecord.toEntries(variants)) {
	test.describe(text, () => {
		test("should match screenshot", async ({ mount }) => {
			const component = await mount(<Button variant={variant}>{text}</Button>)
			await expect(component).toHaveScreenshot()
		})

		test("when clicked should match screenshot", async ({ mount, page }) => {
			const component = await mount(<Button variant={variant}>{text}</Button>)
			await component.click()
			await expect(component).toHaveScreenshot()
		})

		test("when focused should match screenshot", async ({ mount, page }) => {
			const component = await mount(<Button variant={variant}>{text}</Button>)
			await component.focus()
			await expect(component).toHaveScreenshot()
		})
		test.describe("responsive design", () => {
			test.use({
				colorScheme: "dark"
			})
			test("with icon when dark mode should match screenshot", async ({
				mount
			}) => {
				const component = await mount(
					<Button variant={variant}>
						<ButtonIcon>
							<MaterialSymbolsAdd />
						</ButtonIcon>
						{text}
					</Button>
				)
				await expect(component).toHaveScreenshot()
			})
		})

		test("with icon should match screenshot", async ({ mount }) => {
			const component = await mount(
				<Button variant={variant}>
					<ButtonIcon>
						<MaterialSymbolsAdd />
					</ButtonIcon>
					{text}
				</Button>
			)
			await expect(component).toHaveScreenshot()
		})

		test("with icon when disabled should match screenshot", async ({
			mount
		}) => {
			const component = await mount(
				<Button variant={variant} disabled>
					<ButtonIcon>
						<MaterialSymbolsAdd />
					</ButtonIcon>
					{text}
				</Button>
			)
			await expect(component).toHaveScreenshot()
		})
	})
}
