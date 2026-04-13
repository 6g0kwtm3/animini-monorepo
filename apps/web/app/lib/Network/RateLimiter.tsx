type RateLimiterArgs = { limit: number; per: Temporal.Duration }

export class RateLimiter {
	private processing = false
	private queue: (() => Promise<void>)[] = []

	private timestamps: {
		timestamps: Temporal.Instant[]
		args: RateLimiterArgs
	}[]

	constructor(args: readonly RateLimiterArgs[]) {
		this.timestamps = args.map((args) => ({ args, timestamps: [] }))
	}

	execute<T>(fn: () => T): Promise<Awaited<T>> {
		return new Promise<Awaited<T>>((resolve, reject) => {
			void this.queue.push(async () => {
				try {
					resolve(await fn())
				} catch (error) {
					if (error instanceof Error) {
						reject(error)
					} else {
						reject(new Error(`RateLimiter execution failed`, { cause: error }))
					}
				}
			})
			void this.run().catch(() => {
				//
			})
		})
	}

	async run() {
		if (this.processing) return
		this.processing = true

		while (this.queue.length !== 0) {
			const now = Temporal.Now.instant()

			// Clean timestamps for each limit
			this.timestamps = this.timestamps.map(({ args, timestamps }) => {
				return {
					args,
					timestamps: timestamps.filter(
						(t) => t.add(args.per).epochMilliseconds > now.epochMilliseconds
					),
				}
			})

			// Check if any limit is exceeded and calculate max wait time
			let maxWait = 0
			for (const { timestamps, args } of this.timestamps) {
				if (timestamps.length >= args.limit) {
					const earliest = timestamps[0]
					if (earliest) {
						const nextAllowed = earliest.add(args.per)
						const waitMs = nextAllowed.epochMilliseconds - now.epochMilliseconds
						if (waitMs > maxWait) maxWait = waitMs
					}
				}
			}

			if (maxWait > 0) {
				await new Promise((r) => setTimeout(r, maxWait))
				continue
			}

			const fn = this.queue.shift()
			if (!fn) {
				throw new Error("RateLimiter queue is empty when trying to process")
			}

			// Record timestamp for all limits
			for (const { timestamps } of this.timestamps) {
				timestamps.push(now)
			}
			void fn()
		}

		this.processing = false
	}
}
