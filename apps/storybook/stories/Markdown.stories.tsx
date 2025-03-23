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

import XftsFdrX from "./assets/Markdown/20250314-113745.jpg?url"
import Kjd0TsjM from "./assets/Markdown/20250314-113816.jpg?url"
import _83dPcrj from "./assets/Markdown/20250314-113823.jpg?url"
import ddogfpf from "./assets/Markdown/ddogfpf-a0157bbf-e826-4338-9cb9-1e992b5012d1.png?url"
import I4JYvuE from "./assets/Markdown/I4JYvuE.jpg?url"
import megumin from "./assets/Markdown/megumin-emilia-and-takahashi-rie-re-zero-kara-hajimeru-isekai-seikatsu-drawn-by-s-hdru2332-886235400.png?url"
import ren from "./assets/Markdown/rem-minase-inori-and-beta-re-zero-kara-hajimeru-isekai-seikatsu-and-1-more-drawn-by-mibry-phrysm-fb0.jpg?url"

const snapshot = `~~~img500(${I4JYvuE})~~~ # ~~~__<a>Fanart(s) of the Day__</a>~~~ ~~~Direct link is added in the <a>__Fanart(s)</a>__~~~ ~~~Img500(${I4JYvuE})~~~ ~~~[ img500(${XftsFdrX}) ](https://twitter.com/watano__yuki/status/1878371667992363484?t=obf4jTxI3-3bAtK4_JoQ1g&s=19) [ img500(${ren}) ](https://www.pixiv.net/artworks/127705403) [ img500(${megumin}) ](https://www.pixiv.net/artworks/117607300) [ img500(${Kjd0TsjM}) ](https://twitter.com/nycnouu/status/1480789618324738049?t=lY_mTe-HUpDczESLooc1Mg&s=19) [ img500(${_83dPcrj}) ](https://twitter.com/d4wnselette/status/1855122534104015274?t=lDj0hU-S1YLW7fW-HVXTlw&s=19) [ img500(${ddogfpf}) ](https://www.deviantart.com/life-fiber-change/art/Mid-Tf-Chitty-Chitty-Yang-Yang-Ryuko-To-Yang-827137923) https://anilist.co/anime/21355/ReZERO-Starting-Life-in-Another-World/ https://anilist.co/anime/150672/Oshi-No-Ko/ https://anilist.co/anime/130298/The-Eminence-in-Shadow/ https://anilist.co/anime/21202/KONOSUBA-Gods-blessing-on-this-wonderful-world/ https://anilist.co/anime/154765/Genshin/ https://anilist.co/anime/10087/FateZero/ https://anilist.co/anime/16592/Danganronpa-The-Animation/ https://anilist.co/anime/1565/Pokmon-the-Series-Diamond-and-Pearl/ https://anilist.co/anime/146668/RWBY-Ice-Queendom/ https://anilist.co/anime/18679/Kill-la-Kill/~~~ img500(${I4JYvuE})`

export const Snapshot = {
	args: {
		children: snapshot,
		options: {
			replace: {},
		},
	},
} satisfies Story
