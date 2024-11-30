import mongoose from "mongoose";

export const generateSlug = (title: string) => {
	return encodeURIComponent(title.toLowerCase().trim().replace(/\s+/g, "-"));
};

export const generateCreatorUrl = (creatorId: string, creatorName: string) => {
	const slug = generateSlug(creatorName);
	return `/creator/${creatorId}/${slug}`;
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

export function getProfileInitials(name: string): string {
	if (!name) return "?";

	const names = name.trim().split(" ");
	if (names.length === 1) {
		return names[0].charAt(0).toUpperCase();
	}

	return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
}

export function formatDuration(minutes: number): string {
	const totalSeconds = Math.floor(minutes * 60);
	const minutesPart = Math.floor(totalSeconds / 60);
	const secondsPart = totalSeconds % 60;
	return `${String(minutesPart).padStart(2, "0")}:${String(
		secondsPart
	).padStart(2, "0")}`;
}

export function formatMongoDBDate(isoDate: Date): string {
	const date = new Date(isoDate);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		// hour: "2-digit",
		// minute: "2-digit",
		// second: "2-digit",
		// timeZoneName: "short",
	};
	return date.toLocaleDateString("en-US", options);
}
