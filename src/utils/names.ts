export const convertNameToSnakeCase = (name?: string) => {
	if (!name) return "";
	return name.toLowerCase().replace(/\s+/g, "_");
};
