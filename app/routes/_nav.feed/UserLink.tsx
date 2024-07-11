import { Link, useFetcher, useRouteLoaderData } from "@remix-run/react"

import { useEffect, type ReactNode } from "react"
import {
	ListItem,
	ListItemAvatar,
	ListItemContent,
	Skeleton,
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichTrigger,
} from "~/components"
import { Ariakit } from "~/lib/ariakit"
import { route_user } from "~/lib/route"
import type { clientLoader as rootLoader } from "~/root"
import type { clientLoader as userInfoLoader } from "../user.$userName.info/route"

import { M3 } from "~/lib/components"
import { m } from "~/lib/paraglide"
import type { clientAction as userFollowAction } from "../user.$userId.follow/route"

export function UserLink(props: {
	userName: string
	children: ReactNode
}): ReactNode {
	const fetcher = useFetcher<typeof userInfoLoader>({
		key: `${props.userName}-info`,
	})
	const follow = useFetcher<typeof userFollowAction>({
		key: `${props.userName}-follow`,
	})

	const store = Ariakit.useHovercardStore()

	// eslint-disable-next-line react-compiler/react-compiler
	const open = store.useState("open")

	useEffect(() => {
		if (open && fetcher.state === "idle" && !fetcher.data) {
			fetcher.load(`/user/${props.userName}/info`)
		}
	}, [open, fetcher, props.userName])

	const rootData = useRouteLoaderData<typeof rootLoader>("root")

	return (
		<TooltipRich placement="top" store={store}>
			<TooltipRichTrigger
				render={
					<Link to={route_user({ userName: props.userName })}>
						{props.children}
					</Link>
				}
			/>
			<TooltipRichContainer className="not-prose text-start">
				<div className="-mx-4 -my-2">
					<M3.List lines={"two"} className="">
						<ListItem className="hover:state-none">
							<ListItemAvatar>
								{fetcher.data === undefined ? (
									<Skeleton full />
								) : (
									fetcher.data.User?.avatar?.large && (
										<img
											src={fetcher.data.User.avatar.large}
											className="bg-[image:--bg] bg-cover bg-center object-cover object-center"
											style={{
												"--bg": `url(${fetcher.data.User.avatar.medium ?? ""})`,
											}}
											loading="lazy"
											alt=""
										/>
									)
								)}
							</ListItemAvatar>
							<ListItemContent>
								<M3.ListItemContentTitle>
									{props.userName}
								</M3.ListItemContentTitle>
								<M3.ListItemContentSubtitle>
									{fetcher.data === undefined ? (
										<Skeleton />
									) : fetcher.data.User?.isFollower ? (
										"Follower"
									) : (
										"Not follower"
									)}
								</M3.ListItemContentSubtitle>
							</ListItemContent>
						</ListItem>
					</M3.List>
				</div>

				<TooltipRichActions>
					{rootData?.Viewer?.name &&
						rootData.Viewer.name !== props.userName && (
							<follow.Form
								method="post"
								action={`/user/${fetcher.data?.User?.id}/follow`}
							>
								<input
									type="hidden"
									name="isFollowing"
									value={
										follow.formData?.get("isFollowing") ??
										follow.data?.ToggleFollow.isFollowing ??
										fetcher.data?.User?.isFollowing
											? ""
											: "true"
									}
									id=""
								/>

								<M3.Button
									type="submit"
									aria-disabled={!fetcher.data?.User?.id}
								>
									{follow.formData?.get("isFollowing") ??
									follow.data?.ToggleFollow.isFollowing ??
									fetcher.data?.User?.isFollowing
										? m.unfollow_button()
										: m.follow_button()}
								</M3.Button>
							</follow.Form>
						)}
				</TooltipRichActions>
				{/* <TooltipRichSubhead>{props.children}</TooltipRichSubhead>
				<TooltipRichSupportingText>{props.children}</TooltipRichSupportingText> */}
			</TooltipRichContainer>
		</TooltipRich>
	)
}
