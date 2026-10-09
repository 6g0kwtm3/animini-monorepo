import { Fab } from "@animedes/components/Button"
import { A } from "@anitrove/a"
import { motion } from "motion/react"
import ReactRelay from "react-relay"
import { useParams } from "react-router"
import { useFragment } from "~/lib/Network"
import { m } from "~/lib/paraglide"
import { route_login, route_media_edit } from "~/lib/route"
import MaterialSymbolsEditOutline from "~icons/material-symbols/edit-outline"

import type { Edit_query$key } from "~/gql/Edit_query.graphql"
const { graphql } = ReactRelay

const Edit_query = graphql`
	fragment Edit_query on Query @throwOnFieldError {
		Viewer: userFromToken
	}
`

export function Edit(props: { query: Edit_query$key }) {
	const { mediaId } = useParams()

	const root = useFragment(Edit_query, props.query)

	return (
		<motion.div layoutId="edit" className="fixed end-4 bottom-24 sm:bottom-4">
			<div className="relative">
				<Fab
					label={{
						kind: "ariakit-tooltip",
						value: root.Viewer != null ? m.edit() : m.login_to_edit(),
					}}
					render={
						<A
							href={
								root.Viewer != null
									? route_media_edit({ id: Number(mediaId) })
									: route_login({
											redirect: route_media_edit({ id: Number(mediaId) }),
										})
							}
							preventScrollReset={true}
						></A>
					}
				>
					<MaterialSymbolsEditOutline />
				</Fab>
			</div>
		</motion.div>
	)
}
