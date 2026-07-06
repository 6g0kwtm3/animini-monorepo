import { defineConfig } from "vite-plus"

export default defineConfig({
	run: {
		tasks: {
			bench: {
				command: "vp run bench --affected",
				cache: false,
				// untrackedEnv: ["CODSPEED_*"],
			},
			bundlewatch: {
				command: "vp run bundlewatch --affected",
				dependsOn: ["build"],
			},
			test: { command: "vp test --changed origin/master", cache: true },
			stryker: {
				command: "stryker run --incremental",
				cache: true,
				untrackedEnv: ["STRYKER_DASHBOARD_API_KEY"],
			},
			knip: {
				command: "knip --cache",
				cache: true,
				dependsOn: [
					"@animedes/web#relay",
					"@animedes/web#router",
					"@animedes/web#paraglide",
				],
			},
			"check:fix": {
				command: "vp check --fix",
				cache: false,
				dependsOn: [
					"@animedes/web#relay",
					"@animedes/web#router",
					"@animedes/web#paraglide",
				],
			},
		},
	},
	fmt: {
		semi: false,
		sortTailwindcss: { functions: ["tv"] },
		useTabs: true,
		// sortImports: true,
		trailingComma: "es5",
		objectWrap: "collapse",
		printWidth: 80,
		sortPackageJson: false,
		ignorePatterns: [
			"**/gql",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
			"worker-configuration.d.ts",
			"eslint-typegen.d.ts",
			"**/.react-router",
			"**/.tsup",
			"**/dist",
			"eslint-suppressions.json",
			"skills",
			"skills-lock.json",
		],
		jsdoc: true,
	},
	lint: {
		categories: { correctness: "warn" },
		ignorePatterns: ["playwright", "packages", "apps", ".stryker-tmp"],
		overrides: [
			{
				files: ["package.json", "**/package.json"],
				rules: {
					"pnpm/json-enforce-catalog": "error",
					"pnpm/json-valid-catalog": "error",
					"pnpm/json-prefer-workspace-settings": "error",
				},
				jsPlugins: ["eslint-plugin-pnpm"],
			},
			{
				files: ["pnpm-workspace.yaml"],
				rules: {
					"pnpm/yaml-no-unused-catalog-item": "error",
					"pnpm/yaml-no-duplicate-catalog-item": "error",
					"pnpm/yaml-valid-packages": "error",
				},
				jsPlugins: ["eslint-plugin-pnpm"],
			},
		],

		options: {
			typeAware: true,
			typeCheck: true,
			denyWarnings: true,
			respectEslintDisableDirectives: false,
			reportUnusedDisableDirectives: "warn",
		},
		plugins: [
			"react",
			"unicorn",
			"typescript",
			"oxc",
			"import",
			"jsx-a11y",
			"react-perf",
			"jsdoc",
			"vitest",
		],
		env: { node: true, browser: true },
		rules: {
			"vitest/no-alias-methods": "warn",
			"vitest/expect-expect": [
				"warn",
				{
					assertFunctionNames: [
						"expect",
						"expectTypeOf",
						"assert",
						"assertType",
						"valid",
						"invalid",
					],
				},
			],
			"react/react-compiler": "error",
			"eslint/no-unused-expressions": "warn",
			"eslint/eqeqeq": ["warn", "always", { null: "never" }],
			"eslint/prefer-template": "warn",
			"oxc/no-barrel-file": "warn",
			"import/no-cycle": "warn",
			"react/jsx-no-useless-fragment": "warn",
			"react/rules-of-hooks": "warn",
			"react/jsx-key": "warn",
			"typescript/no-non-null-assertion": "warn",
			"no-non-null-asserted-nullish-coalescing": "warn",
			"typescript/no-unnecessary-condition": [
				"warn",
				{ checkTypePredicates: true },
			],
			"typescript/no-unnecessary-type-constraint": "warn",
			"typescript/switch-exhaustiveness-check": "warn",
			"typescript/consistent-type-definitions": ["warn", "interface"],
			"eslint/require-await": "warn",
			"unicorn/no-document-cookie": "off",
			"unicorn/consistent-existence-index-check": "warn",
			"unicorn/explicit-length-check": ["warn", { "non-zero": "not-equal" }],
			"jest/expect-expect": [
				"warn",
				{
					assertFunctionNames: [
						"expect",
						"expectTypeOf",
						"assert",
						"assertType",
						"valid",
					],
				},
			],
			"jsx-a11y/no-autofocus": "off",
			"jsx-a11y/anchor-is-valid": [
				"warn",
				{
					components: ["Link", "NavLink", "HashNavLink", "NavigationItem", "A"],
					specialLink: ["to", "href"],
				},
			],

			"typescript/triple-slash-reference": "allow",
			"eslint/no-unused-vars": "allow",
			"jsx-a11y/anchor-has-content": "allow",
			"jsx-a11y/control-has-associated-label": "allow",
			"import/namespace": "allow",
			"eslint/no-shadow-restricted-names": "allow",
		},
		settings: {
			jsdoc: {
				tagNamePreference: {
					rootFragment: "rootFragment",
					RelayResolver: "relayField",
				},
			},
			react: {
				version: "19",
				linkComponents: [
					{ name: "Link", attribute: "to" },
					{ name: "NavLink", attribute: "to" },
					{ name: "HashNavLink", attribute: "to" },
					{ name: "NavigationItem", attribute: "to" },
					{ name: "A", attribute: "href" },
				],
				formComponents: ["Form"],
				buttonComponents: ["Button", "BaseButton", "Icon"],
			},
			"jsx-a11y": {
				controlComponents: ["Link", "NavLink", "HashNavLink", "A"],
			},
		},
	},
})
