import json from "@eslint/json"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { expect, test } from "vitest"

import { rule } from "./rule-package-name-scope"

const { valid, invalid } = createRuleTester({
	rule,
	configs: [
		{ files: ["**/package.json"], language: "json/json", plugins: { json } },
	],
	defaultFilenames: { js: "package.json" },
})

test("allows a scoped package name", async () => {
	await valid(`{
		"name": "@animedes/web-flags",
		"version": "0.0.0"
	}`)
})

test("ignores a manifest without a name", async () => {
	await valid(`{
		"version": "0.0.0"
	}`)
})

test("ignores a non-string name", async () => {
	await valid(`{
		"name": 42,
		"version": "0.0.0"
	}`)
})

test("ignores a manifest whose top level value is not an object", async () => {
	await valid(`[
		{
			"name": "web-flags"
		}
	]`)
})

test("reports an unscoped name and prefixes it", async () => {
	const { result } = await invalid({
		code: `{
	"name": "web-flags",
	"version": "0.0.0"
}`,
		errors: [{ messageId: "missingScope", data: { name: "web-flags" } }],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"{
			"name": "@animedes/web-flags",
			"version": "0.0.0"
		}"
	`)
})

test("keeps the rest of the manifest when fixing", async () => {
	const { result } = await invalid({
		code: `{
	"$schema": "https://json.schemastore.org/package",
	"version": "0.0.0",
	"private": true,
	"name": "web-flags"
}`,
		errors: [{ messageId: "missingScope", data: { name: "web-flags" } }],
	})
	expect(result.output).toMatchInlineSnapshot(`
		"{
			"$schema": "https://json.schemastore.org/package",
			"version": "0.0.0",
			"private": true,
			"name": "@animedes/web-flags"
		}"
	`)
})

test("reports a foreign scope without rewriting it", async () => {
	const { result } = await invalid({
		code: `{
	"name": "@anitrove/web-flags"
}`,
		errors: [
			{ messageId: "foreignScope", data: { name: "@anitrove/web-flags" } },
		],
		output: null,
	})
	expect(result.output).toMatchInlineSnapshot(`
		"{
			"name": "@anitrove/web-flags"
		}"
	`)
})

test("ignores a name that is not the manifest's own field", async () => {
	await valid(`{
		"config": {
			"name": "web-flags"
		}
	}`)
})

test("reports the scope itself as an unusable name", async () => {
	await invalid({
		code: `{
		"name": "@animedes"
	}`,
		errors: [
			{
				messageId: "foreignScope",
				data: { name: "@animedes" },
			},
		],
		output: null,
	})
})
