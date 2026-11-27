/**
 * Normalized view of the relations between the media of a list.
 *
 * AniList only exposes the relations of the media that are part of the
 * collection, so a deeper level is only known when the media in between is
 * tracked as well. A tracked media tells us which media it contains
 * (`CONTAINS`) and which media it is a compilation of (`COMPILATION`), and
 * both are linked here to describe the media as a tree.
 */
export interface RelationTree {
	/** Ids of the media contained by a media, in the order AniList lists them. */
	children: Map<number, number[]>
	/** Id of the media containing a media. */
	parents: Map<number, number>
}

export function createRelationTree(): RelationTree {
	return { children: new Map(), parents: new Map() }
}

/**
 * Records that `parentId` contains `childId`.
 *
 * The first container wins, so that the relation a media states about itself
 * takes precedence over the relation another media states about it.
 */
export function addRelationChild(
	tree: RelationTree,
	parentId: number,
	childId: number
): void {
	const children = tree.children.get(parentId)
	if (children == null) {
		void tree.children.set(parentId, [childId])
	} else if (!children.includes(childId)) {
		void children.push(childId)
	}

	if (!tree.parents.has(childId)) {
		void tree.parents.set(childId, parentId)
	}
}

/** Walks up the tree to the outermost media known to contain `id`. */
export function findRelationRoot(tree: RelationTree, id: number): number {
	let root = id
	const visited = new Set<number>([root])
	for (;;) {
		const parent = tree.parents.get(root)
		if (parent == null || visited.has(parent)) {
			return root
		}
		void visited.add(parent)
		root = parent
	}
}

/** Descendants of every media of the tree, in depth-first order. */
export function collectRelationDescendants(
	tree: RelationTree
): Map<number, number[]> {
	const descendants = new Map<number, number[]>()
	const visiting = new Set<number>()

	const visit = (id: number): number[] => {
		const known = descendants.get(id)
		if (known != null) {
			return known
		}
		if (visiting.has(id)) {
			return []
		}
		void visiting.add(id)
		const collected: number[] = []
		for (const child of tree.children.get(id) ?? []) {
			if (visiting.has(child)) {
				continue
			}
			void collected.push(child)
			for (const descendant of visit(child)) {
				void collected.push(descendant)
			}
		}
		void visiting.delete(id)
		void descendants.set(id, collected)
		return collected
	}

	for (const id of tree.children.keys()) {
		void visit(id)
	}

	return descendants
}

export interface RelationRow {
	id: number
	/** Ids of the media containing it, from the outermost to the closest one. */
	ancestors: number[]
}

/**
 * Flattens the tree into rows: every root followed by its descendants.
 *
 * A media is only listed once, even when it is contained by more than one
 * media or when the relations contain a cycle.
 */
export function flattenRelationTree(
	tree: RelationTree,
	rootIds: number[]
): RelationRow[] {
	const rows: RelationRow[] = []
	const listed = new Set<number>()

	const visit = (id: number, ancestors: number[]) => {
		if (listed.has(id)) {
			return
		}
		void listed.add(id)
		void rows.push({ id, ancestors })
		for (const child of tree.children.get(id) ?? []) {
			visit(child, [...ancestors, id])
		}
	}

	for (const root of rootIds) {
		visit(root, [])
	}

	return rows
}
