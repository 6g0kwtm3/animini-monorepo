/** @type {import('@ladle/react').UserConfig} */
export default {
	stories: "app/**/*.stories.{js,jsx,ts,tsx,mdx}",
	appendToHead: `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap" rel="stylesheet">`,
	addons: {
		a11y: {
			enabled: true
		},

		width: {
			options: {
				sm: 600,
				md: 840,
				lg: 1200,
				xl: 1600
			},
			enabled: true, // the addon can be disabled
			defaultState: 0 // default width in pixels (0 = no viewport is set)
		}
	}
}
