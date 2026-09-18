import * as typescriptParser from "@typescript-eslint/parser"
import { createRuleTester } from "eslint-vitest-rule-tester"
import path from "node:path"
import { test } from "vitest"
import { rule } from "./rule-no-unsound-array-covariance"

const { valid, invalid } = createRuleTester({
	rule,
	languageOptions: {
		ecmaVersion: 6,
		parser: typescriptParser,
		parserOptions: {
			ecmaFeatures: { jsx: true },
			projectService: { allowDefaultProject: ["*.ts*"] },
			tsconfigRootDir: path.join(import.meta.dirname, "..", ".."),
		},
	},
})

// --- Assignment expression ------------------------------------------------

test("reports unsound widening via assignment", async () => {
	await invalid({
		code: `
			interface Animal { name: string }
			interface Dog extends Animal { bark(): void }
			const dogs: Dog[] = [] as Dog[];
			let animals: Animal[] = [] as Animal[];
			animals = dogs;
		`,
		errors: [{ messageId: "unsound", data: { from: "Dog", to: "Animal" } }],
	})
})

test("is silent when assigning to the same element type", async () => {
	await valid(`
		interface Dog { bark(): void }
		const dogs: Dog[] = [] as Dog[];
		const other: Dog[] = [] as Dog[];
		other = dogs;
	`)
})

test("is silent when source is not assignable to target", async () => {
	await valid(`
		interface Animal { name: string }
		interface Plant { photosynthesize(): void }
		const animals: Animal[] = [] as Animal[];
		const plants: Plant[] = [] as Plant[];
		animals = plants;
	`)
})

// --- Variable declarator --------------------------------------------------

test("reports unsound widening via variable declarator", async () => {
	await invalid({
		code: `
			interface Animal { name: string }
			interface Dog extends Animal { bark(): void }
			const dogs: Dog[] = [] as Dog[];
			const animals: Animal[] = dogs;
		`,
		errors: [{ messageId: "unsound", data: { from: "Dog", to: "Animal" } }],
	})
})

test("is silent for variable declarator with same element type", async () => {
	await valid(`
		interface Dog { bark(): void }
		const dogs: Dog[] = [] as Dog[];
		const other: Dog[] = dogs;
	`)
})

// --- Call expression (function argument) ----------------------------------

test("reports unsound widening via function argument", async () => {
	await invalid({
		code: `
			interface Animal { name: string }
			interface Dog extends Animal { bark(): void }
			const dogs: Dog[] = [] as Dog[];
			function feed(a: Animal[]) {}
			feed(dogs);
		`,
		errors: [{ messageId: "unsound", data: { from: "Dog", to: "Animal" } }],
	})
})

test("is silent when function parameter element type matches", async () => {
	await valid(`
		interface Dog { bark(): void }
		const dogs: Dog[] = [] as Dog[];
		function feed(a: Dog[]) {}
		feed(dogs);
	`)
})

// --- Return statement -----------------------------------------------------

test("reports unsound widening via return statement", async () => {
	await invalid({
		code: `
			interface Animal { name: string }
			interface Dog extends Animal { bark(): void }
			const dogs: Dog[] = [] as Dog[];
			function getAnimals(): Animal[] {
				return dogs;
			}
		`,
		errors: [{ messageId: "unsound", data: { from: "Dog", to: "Animal" } }],
	})
})

test("uses the nearest enclosing function as the return-type target", async () => {
	// The `return dogs;` lives inside an inner arrow whose declared return
	// type is `Animal[]`. If the rule walked past the nearest function to
	// the surrounding `outer` (return type `Dog[]`), the comparison would
	// be `Dog[]` → `Dog[]` and the rule would silently stay silent.
	await invalid({
		code: `
			interface Animal { name: string }
			interface Dog extends Animal { bark(): void }
			const dogs: Dog[] = [] as Dog[];
			function outer(): Dog[] {
				const inner = (): Animal[] => {
					return dogs;
				};
				return inner();
			}
		`,
		errors: [{ messageId: "unsound", data: { from: "Dog", to: "Animal" } }],
	})
})

// --- ReadonlyArray is safe (variance is sound) ----------------------------

test("is silent when source is a ReadonlyArray (safe variance)", async () => {
	await valid(`
		interface Animal { name: string }
		interface Dog extends Animal { bark(): void }
		const dogs: ReadonlyArray<Dog> = [] as ReadonlyArray<Dog>;
		let animals: Animal[] = [] as Animal[];
		animals = dogs;
	`)
})

test("is silent when target is a ReadonlyArray (safe variance)", async () => {
	await valid(`
		interface Animal { name: string }
		interface Dog extends Animal { bark(): void }
		const dogs: Dog[] = [] as Dog[];
		let animals: ReadonlyArray<Animal> = [] as ReadonlyArray<Animal>;
		animals = dogs;
	`)
})
