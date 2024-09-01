export const generateSlug = (title: string) => {
	return encodeURIComponent(title.toLowerCase().trim().replace(/\s+/g, "-"));
};
