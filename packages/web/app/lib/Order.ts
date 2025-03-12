export interface Order<T> {
	(a: T, b: T): number
}

export function number(a: number, b: number) {
	return a - b
}
export function string(a: string, b: string) {
	return a.localeCompare(b)
}
export function mapInput<A, B>(order: Order<A>, map: (a: B) => A): Order<B> {
	return (a, b) => order(map(a), map(b))
}
export function combineAll<T>(orders: Order<T>[]) {
	return (a: T, b: T) => {
		for (const order of orders) {
			const result = order(a, b)
			if (result !== 0) {
				return result
			}
		}
		return 0
	}
}

export function reverse<T>(order: Order<T>) {
	return (a: T, b: T) => -order(a, b)
}
