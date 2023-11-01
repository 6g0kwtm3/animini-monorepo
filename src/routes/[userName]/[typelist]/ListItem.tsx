import { GraphQL } from "$houdini"
import { MoreHorizontal, Plus } from "lucide-react"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { VariantProps } from "tailwind-variants"
import { btnIcon, BaseButton } from "~/components/Button"

interface Props {
  entry: GraphQL<`{
... on MediaList @componentField(field: "ListItem", prop: "entry") {
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
  ToWatch
}
}`>
}

export default function ListItem({ entry }: Props) {
  return (
    <div className="group flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface surface state-on-surface hover:state-hover">
      <>
        <div className="h-14 w-14 shrink-0">
          <img
            src={entry.media?.coverImage?.extraLarge || ""}
            className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
            style={{
              "--bg": `url(${entry.media?.coverImage?.medium})`,
            }}
            loading="lazy"
            alt=""
          />
          <div className="hidden p-1 group-hover:block">
            <MoreHorizontal size={48}></MoreHorizontal>
          </div>
        </div>
        <a to={`/${entry.media?.id}`} className="">
          <span className="line-clamp-1 text-body-lg text-balance">
            {entry.media?.title?.userPreferred}
          </span>
          <div className="gap-2 text-body-md text-on-surface-variant">
            <div>Score: {entry.score}</div>
            <div className="">
              To watch: <entry.ToWatch />
            </div>
          </div>
        </a>
        <div className="ms-auto w-6 shrink-0 text-label-sm text-on-surface-variant">
          <span className="group-hover:hidden">
            {entry.progress}/{entry.media?.episodes}
          </span>
          <form method="post" className="hidden group-hover:inline">
            <input type="hidden" name="mediaId" value={entry.media?.id} />
            <input
              type="hidden"
              name="progress"
              value={(entry.progress ?? 0) + 1}
            />
            <ButtonIcon type="submit" className="-m-3">
              <Plus className=""></Plus>
            </ButtonIcon>
          </form>
        </div>
      </>
    </div>
  )
}


export function ButtonIcon({
  children,
  variant,
  className,
  ...props
}: PropsWithChildren<
  VariantProps<typeof btnIcon> &
    Omit<ComponentPropsWithoutRef<typeof BaseButton>, "children">
>) {
  const styles = btnIcon()

  return (
    <BaseButton {...props} className={styles.root({ variant, className })}>
      <div className={styles.content()}>{children}</div>
    </BaseButton>
  )
}