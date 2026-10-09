export function hex(hash: bigint | number): string {
	return hash.toString(16) //.padStart(16, "0")
}

export function hash32(str: string): number {
	let h = 1779033703 ^ str.length

	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
		h = (h << 13) | (h >>> 19)
	}

	return (h ^ (h >>> 16)) >>> 0
}
