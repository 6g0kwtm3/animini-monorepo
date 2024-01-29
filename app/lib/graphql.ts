import type {
	DocumentTypeDecoration as DocumentTypeDecoration_,
	ResultOf as ResultOf_
} from "@graphql-typed-document-node/core"
import { FragmentType as FragmentType_ } from "~/gql"
export { graphql } from "~/gql"

export type FragmentType<F extends (...args: any) => any> = FragmentType_<
	ReturnType<F>
>

type DocumentTypeDecoration<T, V> = () => DocumentTypeDecoration_<T, V>
type ResultOf<F extends (...args: any) => any> = ResultOf_<ReturnType<F>>

// return non-nullable if `fragmentType` is non-nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType: FragmentType<F>
): ResultOf<F>
// return nullable if `fragmentType` is nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType: FragmentType<F> | null | undefined
): ResultOf<F> | null | undefined

// return array of non-nullable if `fragmentType` is array of non-nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType: ReadonlyArray<FragmentType<F>>
): ReadonlyArray<ResultOf<F>>
// return array of nullable if `fragmentType` is array of nullable
export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType: ReadonlyArray<FragmentType<F>> | null | undefined
): ReadonlyArray<ResultOf<F>> | null | undefined
export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType:
		| ReadonlyArray<FragmentType<F> | null | undefined>
		| null
		| undefined
): ReadonlyArray<ResultOf<F> | null | undefined> | null | undefined

export function useFragment<F extends DocumentTypeDecoration<any, any>>(
	fragmentType:
		| FragmentType<F>
		| ReadonlyArray<FragmentType<F>>
		| ReadonlyArray<FragmentType<F> | null | undefined>
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
