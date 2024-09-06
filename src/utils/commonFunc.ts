export const generateSlug = (title: string) => {
	return encodeURIComponent(title.toLowerCase().trim().replace(/\s+/g, "-"));
};

export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}

	// Ensure that the ellipsis ("...") does not exceed the maximum length
	const truncLength = maxLength - 3; // 3 characters for "..."

	return str.slice(0, truncLength) + "...";
}

export function formatNumberWithCommas(number: number): string {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
