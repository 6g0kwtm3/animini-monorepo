import { getLocale } from "~/paraglide/runtime"
import { useState } from "react"

export function RelativeTimeSince(props: { date: Temporal.Instant }) {
	const [dateNow] = useState(() => Temporal.Now.instant())

	return format(props.date.since(dateNow))
}

function format(duration: Temporal.Duration) {
	const seconds = duration.total({ unit: "second" })
	const rtf = new Intl.RelativeTimeFormat(getLocale(), {})

	if (Math.abs(seconds) < 60) {
		return rtf.format(Math.trunc(seconds), "seconds")
	}

	if (Math.abs(seconds) < 60 * 60) {
		return rtf.format(Math.trunc(seconds / 60), "minutes")
	}

	if (Math.abs(seconds) < 60 * 60 * 24) {
		return rtf.format(Math.trunc(seconds / (60 * 60)), "hours")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 7) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24)), "days")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 365) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 7)), "weeks")
	}

	return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 365)), "years")
}
