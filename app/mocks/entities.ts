import { faker as en } from "@faker-js/faker/locale/en"
import { faker as ja } from "@faker-js/faker/locale/ja"

function store() {}

export function mockUser(initialValue: {} = {}) {
	return {
		name: "John Doe",
		unreadNotificationCount: 2,
		...initialValue,
	}
}

export function mockStaff(initialValue: {} = {}) {
	return {
		name: ja.person.fullName(),
		...initialValue,
	}
}

export function mockMedia(initialValue: {} = {}) {
	return {
		id: en.number.int({ max: 2 ** 16 - 1 }),
		title: {
			userPreferred: en.lorem.words(3),
		},
		endDate: {
			year: 2024,
			month: 3,
			day: 22,
		},
		startDate: {
			year: 2023,
			month: 9,
			day: 29,
		},
		status: "FINISHED",
		description: en.lorem.sentences(6),
		coverImage: {
			extraLarge:
				"https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-gHSraOSa0nBG.jpg",
			large:
				"https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-gHSraOSa0nBG.jpg",
			medium:
				"https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154587-gHSraOSa0nBG.jpg",
			color: "#aee493",
		},
		...initialValue,
	}
}

export function mockMediaListCollection(args: any, initialValue: {} = {}) {
	return {
		lists: () => [
			mockMediaListGroup(args),
			mockMediaListGroup(args),
			mockMediaListGroup(args),
			mockMediaListGroup(args),
		],
	}
}

export function mockMediaListGroup(args: any) {
	return {
		entries: () =>
			mockList(
				0,
				mockMediaList(args),
				mockMediaList(args),
				mockMediaList(args),
				mockMediaList(args)
			),

		name: en.lorem.words(2),
	}
}

export function mockMediaList(args: any, initialValue: {} = {}) {
	return {
		media:
			args.type === "ANIME"
				? mockSeasonalMedia({ type: args.type })
				: mockMedia(),
		...initialValue,
	}
}

export function mockSeasonalMedia(initialValue: {} = {}) {
	return {
		...mockMedia(),
		season: "FALL",
		seasonYear: 2023,
		seasonInt: 234,
		episodes: 28,
		format: "TV",
		type: "ANIME",
		...initialValue,
	}
}

export function mockList<T>(start: number, ...nodes: T[]) {
	return nodes.map((node, i) =>
		node
			? {
					...node,
					id: start + i,
				}
			: node
	)
}

export function mockTextActivity(initialValue: {} = {}) {
	return {
		__typename: "TextActivity",
		createdAt: Math.round(Date.now() / 1000),
		text: `<center>June 21st, 2024<h1><b>Happy Birthday, [Finana Ryugu](https://www.nijisanji.jp/members/finana-ryugu) & Yoimiya Naganohara!!!</b></h1>\n<a href=\"https://www.nijisanji.jp/members/finana-ryugu\"><img src=\"https://media1.tenor.com/m/JCL3br3Gi2AAAAAC/finana-finana-ryugu.gif\" width=\"35%\"></a> <img src=\"https://media1.tenor.com/m/1zySj1-Rz8wAAAAd/yoimiya.gif\" width=\"38.25%\">\n<br /><hr width=\"75%\">\n<blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/iblbrrm.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (X)](https://twitter.com/B48atdtd/status/1546004631100493824)\n</blockquote> <blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/ivUbUeo.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (X)](https://twitter.com/SyHan__/status/1507091282644312065)\n</blockquote> <blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/L0fqoM6.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (X)](https://twitter.com/Kuinmelen/status/1671884020333056002)\n</blockquote>\n<blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/9PqM4d0.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (X)](https://twitter.com/i_ce_pinon_pino/status/1803911403780346268)\n</blockquote> <blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/WkGlipP.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (Pixiv)](https://www.pixiv.net/artworks/108739514)\n</blockquote> <blockquote><a href=\"https://anilist.co/forum/thread/73494/comment/2656739\"\n><img src=\"https://i.imgur.com/ZpnsAWQ.png\" width=\"150px\"></a>\n\nBy @Fuwn\n[Artwork Source (Pixiv)](https://www.pixiv.net/artworks/91867162)\n</blockquote>\n\n\nCheck the event thread out here and subscribe for future events!  [anilist.co/forum/thread/73494/](https://anilist.co/forum/thread/73494/)\nBadge Wall exclusive badges available on [@Fuwn's Badge Wall](https://due.moe/user/fuwn/badges)!</center><br /><hr width=\"65%\">\n<center><img src=\"https://i.imgur.com/TP0NRED.png\" height=\"17px\"> Birthday events hosted by @Fuwn! <img src=\"https://i.imgur.com/TP0NRED.png\" height=\"17px\">\n\nTrack all your badges using [due.moe's Badge Wall](https://anilist.co/activity/716680114)!\nView **all** birthdays from today at [due.moe/birthdays](https://due.moe/birthdays?month=6&day=21)!\n\n~!Yoimiya's artwork is from a piece of promotional work for Genshin Impact!~</center>`,
		...initialValue,
	}
}

export function mockAiringNotification(initialValue: {} = {}) {
	return {
		__typename: "AiringNotification",
		createdAt: Math.round(Date.now() / 1000),
		...initialValue,
	}
}

export function mockRelatedMediaAdditionNotification(initialValue: {} = {}) {
	return {
		__typename: "RelatedMediaAdditionNotification",
		createdAt: Math.round(Date.now() / 1000),
		...initialValue,
	}
}

export function mockActivityLikeNotification(initialValue: {} = {}) {
	return {
		__typename: "ActivityLikeNotification",
		createdAt: Math.round(Date.now() / 1000),
		...initialValue,
	}
}
