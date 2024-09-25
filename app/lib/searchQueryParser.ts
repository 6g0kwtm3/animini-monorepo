export interface SearchParserOptions<T extends readonly string[]> {
	keywords?: T
}

export type SearchParserValues<T extends string> = Partial<Record<T, string[]>>
export type SearchParserResult<T extends string> = {
	text: string
	values: SearchParserValues<T>
}

export function parse<T extends readonly string[]>(
	string: string,
	options?: SearchParserOptions<T>
) {
	const values: SearchParserValues<T[number]> = {}
	const entries: [T[number], string][] = []

	const text = string.replaceAll(
		RegExp(`(${options?.keywords?.join("|")}):(\\S*)\\s*`, "g"),
		(_, key: T[number], value: string) => {
			values[key] ??= []
			values[key].push(...value.split(","))

			entries.push(
				...value.split(",").map((value): [T[number], string] => [key, value])
			)
			return ""
		}
	)

	return {
		text,
		values: values,
		entries,
	}
}

export class QueryString {
	constructor(query: string) {}
	get(key: string): string | undefined {
		throw new Error("Not Implemented!")
	}
	getAll(key: string): string | undefined {
		throw new Error("Not Implemented!")
	}
	entries(): [string | undefined, string][] {
		throw new Error("Not Implemented!")
	}
}

export function stringify(queryObject: SearchParserResult<string>): string {
	return Object.entries(queryObject.values)
		.map(([key, values]) => {
			return `${key}:${values?.join(",") ?? ""}`
		})
		.concat(queryObject.text)
		.join(" ")
}
