import { Form, Link } from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"

import { } from "~/components/Dialog"

// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"

import { BaseButton } from "~/components/Button"

import { type ComponentPropsWithoutRef, type PropsWithChildren } from "react"
import type { VariantProps } from "tailwind-variants"

import type { FragmentType } from "~/gql"
import { graphql, useFragment } from "~/gql"
import { btnIcon } from "~/lib/button"

function ButtonIcon({
	children,
	variant,
	className,
	...properties
}: PropsWithChildren<
	VariantProps<typeof btnIcon> &
		Omit<ComponentPropsWithoutRef<typeof BaseButton>, "children">
>) {
	const styles = btnIcon()

	return (
		<BaseButton {...properties} className={styles.root({ variant, className })}>
			<div className={styles.content()}>{children}</div>
		</BaseButton>
	)
}

export default function ListItemData(data: FragmentType<typeof ListItem_data>) {
	return function ListItem(props: {}) {
		const entry = useFragment(ListItem_data, data)
	 
		const watch = entry?.toWatch

		return (
			<div className="group flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface surface state-on-surface hover:state-hover">
				<>
					<div className="h-14 w-14 shrink-0">
						{" "}
						<img
							src={entry.media?.coverImage?.extraLarge || ""}
							className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
							style={{
								"--bg": `url(${entry.media?.coverImage?.medium})`,
							}}
							loading="lazy"
							alt=""
						/>
						<div className="i hidden p-1 i-12 group-hover:block">
							more_horiz
						</div>
					</div>
					<Link to={`/${entry.media?.id}`}>
						<span className="line-clamp-1 text-body-lg text-balance">
							{entry.media?.title?.userPreferred}
						</span>
						<div className="gap-2 text-body-md text-on-surface-variant">
							<div>Score: {entry.score}</div>
							<div>To watch: {watch?.string}</div>
							<div>Behind: {entry.behind}</div>
						</div>
					</Link>
					<div className="ms-auto shrink-0 text-label-sm text-on-surface-variant">
						<span className="group-hover:hidden">
							{entry.progress}/{entry.media?.episodes}
						</span>
						<Form method="post" className="hidden group-hover:inline">
							<input type="hidden" name="mediaId" value={entry.media?.id} />
							<input
								type="hidden"
								name="progress"
								value={(entry.progress ?? 0) + 1}
							/>
							<ButtonIcon type="submit" className="-m-3">
								add
							</ButtonIcon>
						</Form>
					</div>
				</>
			</div>
		)
	}
}

const ListItem_data = graphql(`
	fragment ListItem on MediaList @component {
		toWatch
		behind
		score
		progress
		media {
			id
			title {
				userPreferred
			}
			coverImage {
				extraLarge
				medium
			}
			episodes
		}
	}
`)
