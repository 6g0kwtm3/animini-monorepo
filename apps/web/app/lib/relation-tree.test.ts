import { describe, expect, it } from "vitest"

import {
	addRelationChild,
	collectRelationDescendants,
	createRelationTree,
	findRelationRoot,
	flattenRelationTree,
} from "./relation-tree"

void describe("relation tree", () => {
	it("lists a nested chain in depth-first order", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 2)
		addRelationChild(tree, 2, 3)
		addRelationChild(tree, 2, 4)

		expect(flattenRelationTree(tree, [1])).toEqual([
			{ id: 1, ancestors: [] },
			{ id: 2, ancestors: [1] },
			{ id: 3, ancestors: [1, 2] },
			{ id: 4, ancestors: [1, 2] },
		])
	})

	it("roots a media at the media containing it", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 2)

		expect(findRelationRoot(tree, 2)).toBe(1)
		expect(flattenRelationTree(tree, [findRelationRoot(tree, 2)])).toEqual([
			{ id: 1, ancestors: [] },
			{ id: 2, ancestors: [1] },
		])
	})

	it("keeps the first container of a media", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 2)
		addRelationChild(tree, 3, 2)

		expect(findRelationRoot(tree, 2)).toBe(1)
	})

	it("collects the descendants of every media", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 2)
		addRelationChild(tree, 2, 3)

		const descendants = collectRelationDescendants(tree)
		expect(descendants.get(1)).toEqual([2, 3])
		expect(descendants.get(2)).toEqual([3])
		expect(descendants.get(3)).toEqual([])
	})

	it("lists a media contained by several media only once", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 3)
		addRelationChild(tree, 2, 3)

		expect(flattenRelationTree(tree, [1, 2]).map((row) => row.id)).toEqual([
			1, 3, 2,
		])
	})

	it("terminates on relations forming a cycle", () => {
		const tree = createRelationTree()
		addRelationChild(tree, 1, 2)
		addRelationChild(tree, 2, 1)

		expect(flattenRelationTree(tree, [1]).map((row) => row.id)).toEqual([1, 2])
		expect(collectRelationDescendants(tree).get(1)).toEqual([2])
	})
})
