import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import { describe } from "node:test"
import { expect, test } from "vitest"
import { rule } from "./rule-must-colocate-fragment-spreads"

describe("rule-must-colocate-fragment-spreads", () => {
	const { valid, invalid } = createRuleTester({
		rule,
		languageOptions: { ecmaVersion: 6, parser: typescriptParser },
	})

	test("allows fragment spread when component is imported", () => {
		valid(
			`
      import { Component } from '../shared/component.js';
      graphql\`fragment foo on Page {
        ...component_fragment
      }\`;
      `
		)
	})

	test("allows fragment spread when component is required", () => {
		valid(
			`
      const Component = require('../shared/component.js');
      graphql\`fragment foo on Page {
        ...component_fragment
      }\`;
      `
		)
	})

	test("allows fragment spread when component is dynamically imported", () => {
		valid(
			`
      const Component = import('../shared/component.js');
      graphql\`fragment foo on Page {
        ...component_fragment
      }\`;
      `
		)
	})

	test("allows fragment spread with nested component path", () => {
		valid(
			`
      import { Component } from './nested/componentModule.js';
      graphql\`fragment foo on Page {
        ...componentModule_fragment
      }\`;
      `
		)
	})

	test("allows fragment spread with component module naming convention", () => {
		valid(
			`
      import { Component } from './component-module.js';
      graphql\`fragment foo on Page {
        ...componentModuleFragment
      }\`;
      `
		)
	})

	test("allows fragment spread in query", () => {
		valid(
			`
      import { Component } from './component-module.js';
      graphql\`query Root {
        ...componentModuleFragment
      }\`;
      `
		)
	})

	test("allows local fragment spreads within same file", () => {
		valid(
			`
      graphql\`fragment foo1 on Page {
        name
      }\`;
      graphql\`fragment foo2 on Page {
        ...foo1
      }\`;
      `
		)
	})

	test("allows fragment spreads in mutations", () => {
		valid(
			`
      graphql\`mutation {
        page_unlike(data: $input) {
          ...component_fragment
          ...componentFragment
          ...component
        }
      }\`
      `
		)
	})

	test("allows fragment spread with relay mask directive", () => {
		valid(
			`
      graphql\`fragment foo on Page { ...Fragment @relay(mask: false) }\`;
      `
		)
	})

	test("allows fragment spread with relay module directive", () => {
		valid(
			`
      graphql\`fragment foo on Page { ...Fragment @module(name: "ComponentName.react") }\`;
      `
		)
	})

	test("allows dynamic imports with template literal paths", () => {
		valid(
			"\
      const getOperation = (reference) => {\
        return import(`./src/__generated__/${reference}`);\
      };\
      "
		)
	})

	test("allows dynamic imports with variable paths", () => {
		valid(
			"\
      const getOperation = (reference) => {\
        return import(reference);\
      };\
      "
		)
	})

	test("allows fragment spread with eslint disable comment", () => {
		valid(
			`
      graphql\`fragment foo on Page {
        # eslint-disable-next-line eslint-plugin-relay/must-colocate-fragment-spreads
        ...unused1
      }\`;
      `
		)
	})

	test("reports error for unused fragment spread in fragment", async () => {
		const { result } = await invalid({
			code: `
        graphql\`fragment foo on Page { ...unused1 }\`;
        `,
			errors: ["must-colocate-fragment-spreads"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports errors for multiple unused fragment spreads", async () => {
		const { result } = await invalid({
			code: `
        graphql\`fragment Test on Page { ...unused1, ...unused2 }\`;
        `,
			errors: [
				"must-colocate-fragment-spreads",
				"must-colocate-fragment-spreads",
			],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for unused fragment spread in query", async () => {
		const { result } = await invalid({
			code: `
        graphql\`query Root { ...unused1 }\`;
        `,
			errors: ["must-colocate-fragment-spreads"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for unused fragment spread even with used fragments", async () => {
		const { result } = await invalid({
			code: `
        import { Component } from './used1.js';
        graphql\`fragment foo on Page { ...used1 ...unused1 }\`;
        `,
			errors: ["must-colocate-fragment-spreads"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for unused fragment spread with relay mask directive", async () => {
		const { result } = await invalid({
			code: `
        graphql\`fragment foo on Page { ...unused1 @relay(mask: true) }\`;
        `,
			errors: ["must-colocate-fragment-spreads"],
		})
		expect(result.output).toMatchSnapshot()
	})

	test("reports error for unused component fragment", async () => {
		const { result } = await invalid({
			code: `
        import type { MyType } from '../shared/component.js';
        graphql\`fragment foo on Page {
          ...component_fragment
        }\`;
        `,
			errors: ["must-colocate-fragment-spreads"],
		})
		expect(result.output).toMatchSnapshot()
	})
})
