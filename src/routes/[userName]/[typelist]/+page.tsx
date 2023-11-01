import { Order } from "effect"
import { CardOutlined } from "~/components/Card"
import { PaneFlexible } from "~/components/Pane"
import { nonNull } from "~/lib/urql"
import { PageProps } from "./$types"

export default function Page({ TypelistQuery }: PageProps) {
  const allLists = TypelistQuery?.MediaListCollection?.lists
    ?.filter(nonNull)
    .sort(
      Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
    )

  const searchParams = new URLSearchParams()

  const selected = searchParams.get("selected")

  let lists = allLists

  if (selected) {
    lists = lists?.filter((list) => list.name === selected)
  }

  return (
    <PaneFlexible className="?max-h-screen flex flex-col overflow-hidden">
      <main className="grid grid-cols-12 md:gap-6">
        <div
          className={`col-span-full hidden last:block max-md:last:flex-1 md:col-span-4 md:block`}
        >
          <CardOutlined>
            <aside>
              <nav>
                <ul>
                  <li></li>
                </ul>
              </nav>
            </aside>
          </CardOutlined>
        </div>
        <div
          className={`col-span-full hidden last:block max-md:last:flex-1 md:col-span-8 md:block`}
        >
          <ul className="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center">
            {allLists?.map((list) => {
              return (
                <li className="min-w-max" key={list.name}>
                  <a href={`?selected=${list.name}`}>{list.name}</a>
                </li>
              )
            })}
          </ul>

          <ul>
            {lists?.map((list) => (
              <li key={list.name}>
                <list.MediaListGroup searchParams={searchParams} />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </PaneFlexible>
  )
}
