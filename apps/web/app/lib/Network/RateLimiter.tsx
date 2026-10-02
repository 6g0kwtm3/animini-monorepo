import { ArkErrors, type } from "arktype"

interface RateLimiterArgs {
	limit: number
	per: Temporal.Duration
}

type ClaimResult = { waitMs: number; what: "wait" } | { what: "grant" }

interface QueuedEntry {
	reject: (reason: Error) => void
	run: () => Promise<void>
}

const LedgerBucketSchema = type({
	limit: "number",
	perMs: "number",
	timestamps: "number[]",
})

type LedgerBucket = typeof LedgerBucketSchema.infer

const JsonToLedgerBucketSchema = type("string.json.parse").to(
	LedgerBucketSchema.array()
)

export class RateLimiter {
	private defaults: LedgerBucket[]
	private key: string

	private processing = false
	private queue: QueuedEntry[] = []

	constructor(key: string, args: readonly RateLimiterArgs[]) {
		this.defaults = args.map(({ limit, per }) => ({
			limit,
			perMs: per.total({ unit: "millisecond" }),
			timestamps: [],
		}))
		this.key = key
	}

	execute<T>(
		fn: () => T,
		options: { readonly signal?: AbortSignal | null }
	): Promise<Awaited<T>> {
		options.signal?.throwIfAborted()
		return new Promise<Awaited<T>>((resolve, reject) => {
			const controller = new AbortController()
			const signal = options.signal
			signal?.addEventListener(
				"abort",
				() => {
					const newLocal = this.queue.indexOf(entry)
					console.assert(newLocal != -1)

					const [removed] = this.queue.splice(newLocal, 1)

					console.assert(removed === entry)

					reject(
						Error.isError(signal?.reason)
							? signal?.reason
							: new Error("Aborted", { cause: options.signal?.reason })
					)
				},
				{ signal: controller.signal }
			)

			const entry: QueuedEntry = {
				reject,
				run: async () => {
					controller.abort()
					try {
						resolve(await fn())
					} catch (error) {
						reject(
							Error.isError(error)
								? error
								: new Error(`RateLimiter execution failed`, { cause: error })
						)
					}
				},
			}

			void this.queue.push(entry)
			void this.run().catch(() => {
				//
			})
		})
	}

	async run() {
		if (this.processing) return
		this.processing = true

		try {
			while (this.queue.length !== 0) {
				let claim: ClaimResult
				try {
					claim = await this.claimToken()
				} catch (error) {
					const reason = Error.isError(error)
						? error
						: new Error(`RateLimiter claim failed`, { cause: error })
					for (const entry of this.queue) {
						entry.reject(reason)
					}
					this.queue.length = 0
					return
				}

				if (claim.what === "wait") {
					await new Promise<void>((resolve) =>
						setTimeout(resolve, claim.waitMs)
					)
					continue
				}

				const entry = this.queue.shift()
				if (!entry) {
					throw new Error("RateLimiter queue is empty when trying to process")
				}
				void entry.run()
			}
		} finally {
			this.processing = false
		}
	}

	private async claimToken(): Promise<ClaimResult> {
		return await navigator.locks.request(this.key, () => {
			const now = Temporal.Now.instant().epochMilliseconds
			const buckets = this.readLedger()

			let changed = false
			for (const bucket of buckets) {
				const kept = bucket.timestamps.filter(
					(stamp) => stamp + bucket.perMs > now
				)
				if (kept.length !== bucket.timestamps.length) changed = true
				bucket.timestamps = kept
			}

			let maxWait = 0
			for (const bucket of buckets) {
				if (bucket.timestamps.length >= bucket.limit && bucket.limit > 0) {
					const earliest = bucket.timestamps[0]
					if (earliest !== undefined) {
						maxWait = Math.max(maxWait, earliest + bucket.perMs - now)
					}
				}
			}

			if (maxWait > 0) {
				if (changed) this.writeLedger(buckets)
				return { what: "wait", waitMs: maxWait }
			}

			for (const bucket of buckets) {
				void bucket.timestamps.push(now)
			}
			this.writeLedger(buckets)
			return { what: "grant" }
		})
	}

	private readLedger(): LedgerBucket[] {
		const ledger = JsonToLedgerBucketSchema(localStorage.getItem(this.key))

		if (ledger instanceof ArkErrors) {
			return this.defaults.map((bucket) => ({ ...bucket, timestamps: [] }))
		}

		return this.defaults.map((bucket, index) => {
			const timestamps = ledger[index]?.timestamps ?? []
			return { ...bucket, timestamps: [...timestamps] }
		})
	}

	private writeLedger(buckets: readonly LedgerBucket[]): void {
		try {
			localStorage.setItem(this.key, JSON.stringify(buckets))
		} catch {
			return
		}
	}
}
