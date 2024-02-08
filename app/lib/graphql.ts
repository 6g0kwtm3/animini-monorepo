import type {
	DocumentTypeDecoration,
	ResultOf
} from "@graphql-typed-document-node/core"
import type { FragmentType as FragmentType_ } from "~/gql"
export { graphql } from "~/gql"

export type FragmentType<F extends DocumentTypeDecoration<any, any>|undefined>  = FragmentType_<NonNullable<F>>

// return non-nullable if `fragmentType` is non-nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType: FragmentType_<NonNullable<F>>
): ResultOf<F>
// return nullable if `fragmentType` is nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType: FragmentType_<NonNullable<F>> | null | undefined
): ResultOf<F> | null | undefined

// return array of non-nullable if `fragmentType` is array of non-nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType: ReadonlyArray<FragmentType_<NonNullable<F>>>
): ReadonlyArray<ResultOf<F>>
// return array of nullable if `fragmentType` is array of nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType: ReadonlyArray<FragmentType_<NonNullable<F>>> | null | undefined
): ReadonlyArray<ResultOf<F>> | null | undefined
export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType:
		| ReadonlyArray<FragmentType_<NonNullable<F>> | null | undefined>
		| null
		| undefined
): ReadonlyArray<ResultOf<F> | null | undefined> | null | undefined

export function useFragment<F extends DocumentTypeDecoration<any, any>|undefined>(
	fragmentType:
		| FragmentType_<NonNullable<F>>
		| ReadonlyArray<FragmentType_<NonNullable<F>>>
		| ReadonlyArray<FragmentType_<NonNullable<F>> | null | undefined>
		| null
		| undefined
):
	| ResultOf<F>
	| ReadonlyArray<ResultOf<F>>
	| ReadonlyArray<ResultOf<F> | null | undefined>
	| null
	| undefined {
	return fragmentType as any
}
