<script lang="ts">
	import { graphql, useFragment, type FragmentType } from "~/gql"
	import { PAGE_media_mediaId } from "~/lib/ROUTES"
	import { btnIcon } from "~/lib/button"
	import { behind, formatWatch, toWatch } from "~/lib/entry"

	const ListItem_entry = graphql(`
		fragment ListItem_entry on MediaList {
			...ToWatch_entry
			...Behind_entry
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

	const { ...props } = $props<{ entry: FragmentType<typeof ListItem_entry> }>()

	const entry = $derived(useFragment(ListItem_entry, props.entry))

	const { content, root } = btnIcon()
</script>

<div
	class="group flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface surface state-on-surface hover:state-hover"
>
	<div class="h-14 w-14 shrink-0">
		<img
			src={entry.media?.coverImage?.extraLarge || ""}
			class="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
			style={{
				"--bg": `url(${entry.media?.coverImage?.medium})`,
			}}
			loading="lazy"
			alt=""
		/>
		<div class="i hidden p-1 i-12 group-hover:block">more_horiz</div>
	</div>
	<a href={PAGE_media_mediaId({ mediaId: entry.media?.id! })}>
		<span class="line-clamp-1 text-body-lg text-balance">
			{entry.media?.title?.userPreferred}
		</span>
		<div class="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
			<div>
				<span class="i i-inline">grade</span>{entry.score}
			</div>
			&middot;
			<div>
				<span class="i i-inline">timer</span>{formatWatch(toWatch(entry))} to watch
			</div>
			&middot;
			<div>
				<span class="i i-inline">next_plan</span>{behind(entry)} behind
			</div>
		</div>
	</a>
	<div class="ms-auto shrink-0 text-label-sm text-on-surface-variant">
		<span class="group-hover:hidden">
			{entry.progress}/{entry.media?.episodes}
		</span>
		<form method="post" class="hidden group-hover:inline">
			<input type="hidden" name="mediaId" value={entry.media?.id} />
			<input type="hidden" name="progress" value={(entry.progress ?? 0) + 1} />
			<button type="submit" class={root({ class: "-m-3" })}>
				<div class={content()}>add</div>
			</button>
		</form>
	</div>
</div>
