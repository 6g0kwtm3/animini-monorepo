import type { Meta, StoryObj } from "@storybook/react"
import { Markdown, Options } from "markdown"

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

import { use, type ComponentProps } from "react"
import XftsFdrX from "./assets/Markdown/20250314-113745.jpg?url"
import Kjd0TsjM from "./assets/Markdown/20250314-113816.jpg?url"
import _83dPcrj from "./assets/Markdown/20250314-113823.jpg?url"
import ddogfpf from "./assets/Markdown/ddogfpf-a0157bbf-e826-4338-9cb9-1e992b5012d1.png?url"
import I4JYvuE from "./assets/Markdown/I4JYvuE.jpg?url"
import megumin from "./assets/Markdown/megumin-emilia-and-takahashi-rie-re-zero-kara-hajimeru-isekai-seikatsu-drawn-by-s-hdru2332-886235400.png?url"
import ren from "./assets/Markdown/rem-minase-inori-and-beta-re-zero-kara-hajimeru-isekai-seikatsu-and-1-more-drawn-by-mibry-phrysm-fb0.jpg?url"

const snapshot = `~~~img500(${I4JYvuE})~~~ # ~~~__<a>Fanart(s) of the Day__</a>~~~ ~~~Direct link is added in the <a>__Fanart(s)</a>__~~~ ~~~Img500(${I4JYvuE})~~~ ~~~[ img500(${XftsFdrX}) ](https://twitter.com/watano__yuki/status/1878371667992363484?t=obf4jTxI3-3bAtK4_JoQ1g&s=19) [ img500(${ren}) ](https://www.pixiv.net/artworks/127705403) [ img500(${megumin}) ](https://www.pixiv.net/artworks/117607300) [ img500(${Kjd0TsjM}) ](https://twitter.com/nycnouu/status/1480789618324738049?t=lY_mTe-HUpDczESLooc1Mg&s=19) [ img500(${_83dPcrj}) ](https://twitter.com/d4wnselette/status/1855122534104015274?t=lDj0hU-S1YLW7fW-HVXTlw&s=19) [ img500(${ddogfpf}) ](https://www.deviantart.com/life-fiber-change/art/Mid-Tf-Chitty-Chitty-Yang-Yang-Ryuko-To-Yang-827137923) https://anilist.co/anime/21355/ReZERO-Starting-Life-in-Another-World/ https://anilist.co/anime/150672/Oshi-No-Ko/ https://anilist.co/anime/130298/The-Eminence-in-Shadow/ https://anilist.co/anime/21202/KONOSUBA-Gods-blessing-on-this-wonderful-world/ https://anilist.co/anime/154765/Genshin/ https://anilist.co/anime/10087/FateZero/ https://anilist.co/anime/16592/Danganronpa-The-Animation/ https://anilist.co/anime/1565/Pokmon-the-Series-Diamond-and-Pearl/ https://anilist.co/anime/146668/RWBY-Ice-Queendom/ https://anilist.co/anime/18679/Kill-la-Kill/~~~ img500(${I4JYvuE})`

const snapshot2 = `~~~ <a>♡</a> Thanks for the nom @Hameru <a>♡</a> ~~~ img5220(https://64.media.tumblr.com/239e6c321abd74a2ec82ebba16f5f3e4/1b1fba3fd0ed9fd6-85/s2048x3072/c64752be42acebe6b50ef8f0923479fe46d43a1a.png)

~~~~~~

#  ~~~<a>✦</a> ____FAVORITE SHIPS____ <a>✦</a>~~~

~~~ ~!It's supposed to be a top 10 but do it however you want img25(https://media.tenor.com/vOjhKXwKiYYAAAAj/pepe-thumbs-up.gif)!~ ~~~

##   ~~~____Fern and Stark____~~~

~~~[img220(https://i.pinimg.com/736x/0f/58/33/0f583304906ae97b5ee3d3d11f33c583.jpg) ](https://www.pixiv.net/en/artworks/116662723)img220(https://i.pinimg.com/736x/64/2b/ee/642bee20726e8bb4b6de71c19d8384b8.jpg) img220(https://i.pinimg.com/736x/b8/b9/96/b8b9967002eec76259ffe79ebd850900.jpg) img220(https://i.pinimg.com/736x/28/b5/e6/28b5e69ed57c39045d708704bfbff430.jpg) img440(https://i.pinimg.com/736x/a7/d1/86/a7d186b51a0796df08519d106e2cb257.jpg)
~~~
~~~https://anilist.co/anime/154587/Frieren-Beyond-Journeys-End/~~~

img2120(https://64.media.tumblr.com/aa39ffab5cb24ce5acfd3cdc335c41e8/23681ec8e8b5b5ba-29/s1280x1920/6d856b4dca19b4da801dc456792a89c25e667b3c.png)

##   ____Kumiko and Reina____
img380(https://64.media.tumblr.com/89ace3f25b27a123e748361880e377ea/8e8002d61210a3eb-d3/s540x810/13843181f5de51093ec07b27002a8578d3a7d07c.gifv)
img380(https://i.redd.it/coltppc8l9sc1.gif) 
~!Ayano you will never be forgiven img320(https://i.pinimg.com/736x/69/72/71/697271be055a47a16ca8152470fad2b8.jpg) !~ https://anilist.co/anime/20912/Sound-Euphonium/

img2120(https://64.media.tumblr.com/aa39ffab5cb24ce5acfd3cdc335c41e8/23681ec8e8b5b5ba-29/s1280x1920/6d856b4dca19b4da801dc456792a89c25e667b3c.png)

##  ____ Akko and Diana____

[img380(https://i.pinimg.com/736x/88/b1/6c/88b16ca76f139392cf07196b09fbbc8a.jpg) ](https://www.pixiv.net/en/artworks/64804008)

https://anilist.co/anime/21858/Little-Witch-Academia-TV/

img2120(https://64.media.tumblr.com/aa39ffab5cb24ce5acfd3cdc335c41e8/23681ec8e8b5b5ba-29/s1280x1920/6d856b4dca19b4da801dc456792a89c25e667b3c.png)

<a>♡</a> Nominees <a>♡</a>

 @ULYSSE95 @yalexi @Adeleine007 @Kikuoka @Fate7th @Elfiee @Bitzel @MelodySong @BlackWaterLily @julkakulkaa @pelas22`

const cache = new Map<string, Promise<string>>()

function Image({ src, ...props }: ComponentProps<"img">) {
	if (!src) return null

	let srcPromise = cache.get(src)
	if (srcPromise === undefined) {
		srcPromise = new Promise((resolve, reject) => {
			const img = new globalThis.Image()
			img.onload = () => {
				resolve(src)
			}
			img.onerror = () => {
				reject(new Error("Failed to load image " + src))
			}
			img.src = src
		})
		cache.set(src, srcPromise)
	}

	return <img {...props} src={use(srcPromise)} />
}

const options: Options = {
	replace: {
		img(props) {
			return <Image {...props}></Image>
		},
	},
}

export const Snapshot = {
	args: { children: snapshot, options },
} satisfies Story

export const Snapshot2 = {
	args: { children: snapshot2, options },
	decorators: [
		(Story) => (
			<div id="899905726">
				<Story></Story>
			</div>
		),
	],
} satisfies Story
