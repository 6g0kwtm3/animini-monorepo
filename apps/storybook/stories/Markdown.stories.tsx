import type { Meta, StoryObj } from "@storybook/react"
import { Markdown } from "markdown"

const meta = {
	title: "Example/Markdown",
	component: Markdown,
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: "fullscreen",
	},
} satisfies Meta<typeof Markdown>

export default meta

type Story = StoryObj<typeof meta>

const snapshot = `~~~img500(https://i.imgur.com/I4JYvuE.gif)~~~ # ~~~__<a>Fanart(s) of the Day__</a>~~~ ~~~Direct link is added in the <a>__Fanart(s)</a>__~~~ ~~~Img500(https://i.imgur.com/I4JYvuE.gif)~~~ ~~~[ img500(https://i.ibb.co/XftsFdrX/20250314-113745.jpg) ](https://twitter.com/watano__yuki/status/1878371667992363484?t=obf4jTxI3-3bAtK4_JoQ1g&s=19) [ img500(https://i.ibb.co/1GFgXfjb/rem-minase-inori-and-beta-re-zero-kara-hajimeru-isekai-seikatsu-and-1-more-drawn-by-mibry-phrysm-fb0.jpg) ](https://www.pixiv.net/artworks/127705403) [ img500(https://i.ibb.co/sdVRMp37/megumin-emilia-and-takahashi-rie-re-zero-kara-hajimeru-isekai-seikatsu-drawn-by-s-hdru2332-886235400.png) ](https://www.pixiv.net/artworks/117607300) [ img500(https://i.ibb.co/Kjd0TsjM/20250314-113816.jpg) ](https://twitter.com/nycnouu/status/1480789618324738049?t=lY_mTe-HUpDczESLooc1Mg&s=19) [ img500(https://i.ibb.co/83dPcrj/20250314-113823.jpg) ](https://twitter.com/d4wnselette/status/1855122534104015274?t=lDj0hU-S1YLW7fW-HVXTlw&s=19) [ img500(https://i.ibb.co/q3tnbZ29/ddogfpf-a0157bbf-e826-4338-9cb9-1e992b5012d1.png) ](https://www.deviantart.com/life-fiber-change/art/Mid-Tf-Chitty-Chitty-Yang-Yang-Ryuko-To-Yang-827137923) https://anilist.co/anime/21355/ReZERO-Starting-Life-in-Another-World/ https://anilist.co/anime/150672/Oshi-No-Ko/ https://anilist.co/anime/130298/The-Eminence-in-Shadow/ https://anilist.co/anime/21202/KONOSUBA-Gods-blessing-on-this-wonderful-world/ https://anilist.co/anime/154765/Genshin/ https://anilist.co/anime/10087/FateZero/ https://anilist.co/anime/16592/Danganronpa-The-Animation/ https://anilist.co/anime/1565/Pokmon-the-Series-Diamond-and-Pearl/ https://anilist.co/anime/146668/RWBY-Ice-Queendom/ https://anilist.co/anime/18679/Kill-la-Kill/~~~ img500(https://i.imgur.com/I4JYvuE.gif)`

export const Snapshot = {
	args: {
		children: snapshot,
		options: {
			replace: {},
		},
	},
} satisfies Story
