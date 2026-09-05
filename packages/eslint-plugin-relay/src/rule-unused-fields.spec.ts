import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { test } from "vitest"
import { rule } from "./rule-unused-fields"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: { ecmaVersion: 6, parser: typescriptParser },
})

test("allows aliased fragment spread whose alias is used via member access", async () => {
	await valid(`
		graphql\`fragment Foo on Page {
			...Component_fragment @alias(as: "component")
		}\`;
		console.log(data.component);
	`)
})

test("allows aliased fragment spread whose alias is destructured", async () => {
	await valid(`
		graphql\`fragment Foo on Page {
			...Component_fragment @alias(as: "component")
		}\`;
		const { component } = data;
	`)
})

test("allows aliased fragment spread whose alias is read via dotAccess", async () => {
	await valid(`
		graphql\`fragment Foo on Page {
			...Component_fragment @alias(as: "component")
		}\`;
		dotAccess(data, 'component');
	`)
})

test("allows aliased fragment spread whose alias is read via getByPath", async () => {
	await valid(`
		graphql\`fragment Foo on Page {
			...Component_fragment @alias(as: "component")
		}\`;
		getByPath(data, ['component']);
	`)
})

test("allows multiple aliased fragment spreads whose aliases are all used", async () => {
	await valid(`
		graphql\`fragment Foo on Page {
			...ComponentA_fragment @alias(as: "a")
			...ComponentB_fragment @alias(as: "b")
		}\`;
		console.log(data.a, data.b);
	`)
})

test("reports aliased fragment spread whose alias is not used", async () => {
	await invalid({
		code: `
			graphql\`fragment Foo on Page {
				...Component_fragment @alias(as: "component")
			}\`;
			doSomethingElse(data);
		`,
		errors: [
			{
				message:
					"This queries for the field `component` but this file does not seem to use it directly.",
			},
		],
	})
})

test("reports aliased fragment spread when raw name is used instead of alias", async () => {
	await invalid({
		code: `
			graphql\`fragment Foo on Page {
				...Component_fragment @alias(as: "component")
			}\`;
			console.log(data.Component_fragment);
		`,
		errors: [
			{
				message:
					"This queries for the field `component` but this file does not seem to use it directly.",
			},
		],
	})
})
