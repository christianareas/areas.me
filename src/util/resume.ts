// Format a phone number.
export function formatPhoneNumber(
	phoneCountryCode: number,
	phoneNumber: number,
) {
	if (phoneCountryCode === 1) {
		const areaCode = phoneNumber.toString().slice(0, 3)
		const exchangeCode = phoneNumber.toString().slice(3, 6)
		const lineNumber = phoneNumber.toString().slice(6)

		return `(${areaCode}) ${exchangeCode}-${lineNumber}`
	}

	return phoneNumber
}

// Format a URL.
export function formatUrl(url: string) {
	try {
		const parsedUrl = new URL(url)
		const hostname = parsedUrl.hostname.replace(/^www\./, "")
		let pathname = parsedUrl.pathname
		if (pathname.endsWith("/")) {
			pathname = pathname.slice(0, -1)
		}

		return hostname + pathname
	} catch (error) {
		console.error(error)
		return url
	}
}

// Format a date.
const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	year: "numeric",
	timeZone: "UTC",
})

export function formatDate(date?: string | null) {
	if (!date) {
		return ""
	}

	const parsedDate = new Date(date)
	if (Number.isNaN(parsedDate.getTime())) {
		return date
	}

	return monthYearFormatter.format(parsedDate).replace(/ /g, "\u00A0")
}
