import { expect } from "@playwright/test"
import { HttpResponse } from "msw"

import {
	anilist,
	CANARY_ID,
	CANARY_NAME,
	SuccessHandler,
	test,
} from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { NotificationsPage } from "./pages/NotificationsPage"

import type { Page } from "@playwright/test"
import type {
	routeNavNotificationsQuery$rawResponse,
	routeNavNotificationsQuery$variables,
} from "~/gql/routeNavNotificationsQuery.graphql"
import type {
	routeNavNotificationsReadQuery$rawResponse,
	routeNavNotificationsReadQuery$variables,
} from "~/gql/routeNavNotificationsReadQuery.graphql"
import type {
	routeNavQuery$rawResponse,
	routeNavQuery$variables,
} from "~/gql/routeNavQuery.graphql"

const VIEWER = { id: CANARY_ID, name: CANARY_NAME }

type Notifications = NonNullable<
	NonNullable<routeNavNotificationsQuery$rawResponse["Page"]>["notifications"]
>
type Notification = NonNullable<Notifications[number]>

const AIRING: Notification = {
	__typename: "AiringNotification",
	id: "1",
	episode: 12,
	createdAt: null,
	media: {
		id: "123",
		title: { userPreferred: "Sousou no Frieren" },
		coverImage: null,
	},
}

const RELATED_MEDIA_ADDITION: Notification = {
	__typename: "RelatedMediaAdditionNotification",
	id: "2",
	createdAt: null,
	media: {
		id: "456",
		title: { userPreferred: "Frieren: Beyond Journey's End" },
		coverImage: null,
	},
}

const ACTIVITY_LIKE: Notification = {
	__typename: "ActivityLikeNotification",
	id: "3",
	activityId: 77,
	context: "liked your comment",
	createdAt: null,
	user: { id: "9", name: "Fern", avatar: null },
}

const inbox = (
	notifications: readonly Notification[],
	unreadNotificationCount: number
) =>
	anilist.query<
		routeNavNotificationsQuery$rawResponse,
		routeNavNotificationsQuery$variables
	>("routeNavNotificationsQuery", () =>
		HttpResponse.json({
			data: {
				Viewer: { id: "1", unreadNotificationCount },
				Page: { notifications },
			},
		})
	)

/**
 * AniList only clears the unread count when the query asks it to, so refuse the
 * request otherwise — a run that never marked anything read cannot pass.
 */
const markAllAsRead = (onReset: () => void) =>
	anilist.query<
		routeNavNotificationsReadQuery$rawResponse,
		routeNavNotificationsReadQuery$variables
	>("routeNavNotificationsReadQuery", ({ query }) => {
		if (!query.replace(/\s/g, "").includes("resetNotificationCount:true")) {
			return HttpResponse.json({
				errors: [{ message: "resetNotificationCount must be true" }],
			})
		}
		onReset()
		return HttpResponse.json({ data: { Page: { notifications: [] } } })
	})

const unreadInNav = (unreadNotificationCount: number) =>
	anilist.query<routeNavQuery$rawResponse, routeNavQuery$variables>(
		"routeNavQuery",
		() =>
			HttpResponse.json({
				data: { Viewer: { id: "1", unreadNotificationCount } },
			})
	)

async function openNotifications(page: Page): Promise<NotificationsPage> {
	await expect(page.getByTestId("hydrated")).toBeVisible()
	const feed = await FeedPage.new(page)
	await feed.nav.notifications.click()
	return NotificationsPage.new(page)
}

test("showing what I was notified about", async ({
	newPage,
	worker,
	login,
}) => {
	worker.use(
		inbox([AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE], 3),
		SuccessHandler
	)
	await login(VIEWER)
	await using page = await newPage()
	await openNotifications(page)

	const aired = page.getByRole("link", { name: "Episode 12 aired." })
	await expect(aired).toBeVisible()
	await expect(aired).toContainText("Sousou no Frieren")
	await expect(aired).toHaveAttribute("href", "/media/123")

	const added = page.getByRole("link", { name: "Recently added to the site." })
	await expect(added).toContainText("Frieren: Beyond Journey's End")
	await expect(added).toHaveAttribute("href", "/media/456")

	const liked = page.getByRole("link", { name: "liked your comment" })
	await expect(liked).toContainText("Fern")
	await expect(liked).toHaveAttribute("href", "/activity/77")
})

test("saying there is nothing when nothing is unread", async ({
	newPage,
	worker,
	login,
}) => {
	worker.use(inbox([], 0), SuccessHandler)
	await login(VIEWER)
	await using page = await newPage()
	const notificationsPage = await openNotifications(page)

	await expect(notificationsPage.empty).toBeVisible()
	await expect(notificationsPage.items).toHaveCount(0)
	await expect(notificationsPage.markAllAsRead).toHaveCount(0)
})

test("offering to mark all as read while something is unread", async ({
	newPage,
	worker,
	login,
}) => {
	worker.use(inbox([AIRING], 1), SuccessHandler)
	await login(VIEWER)
	await using page = await newPage()
	const notificationsPage = await openNotifications(page)

	await expect(notificationsPage.markAllAsRead).toBeVisible()
})

test("marking all as read clearing what was unread", async ({
	newPage,
	worker,
	login,
}) => {
	let read = false
	worker.use(
		inbox(read ? [] : [AIRING], read ? 0 : 1),
		markAllAsRead(() => {
			read = true
		}),
		SuccessHandler
	)
	await login(VIEWER)
	await using page = await newPage()
	const notificationsPage = await openNotifications(page)
	await expect(notificationsPage.markAllAsRead).toBeVisible()

	await notificationsPage.markAllAsRead.click()

	await expect(notificationsPage.markAllAsRead).toHaveCount(0)
	await expect(notificationsPage.empty).toBeVisible()
})

test("counting what is still unread in the nav", async ({
	newPage,
	worker,
	login,
}) => {
	worker.use(unreadInNav(3), SuccessHandler)
	await login(VIEWER)
	await using page = await newPage()
	await expect(page.getByTestId("hydrated")).toBeVisible()

	const feed = await FeedPage.new(page)
	await expect(feed.nav.notifications).toContainText("3")
})
