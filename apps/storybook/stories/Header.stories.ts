import { fn } from "storybook/test"

import { Header } from "./Header"

export default {
	args: { onCreateAccount: fn(), onLogin: fn(), onLogout: fn() },
	component: Header,
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: "fullscreen",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	title: "Example/Header",
}

export const LoggedIn = { args: { user: { name: "Jane Doe" } } }

export const LoggedOut = {}
