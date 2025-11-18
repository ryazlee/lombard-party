// Generate a consistent color from a player name
export const stringToColor = (str: string): string => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash; // Convert to 32bit integer
	}

	// Predefined palette of distinct, visually pleasing colors
	const colors = [
		"#2563eb", // blue-600
		"#dc2626", // red-600
		"#059669", // green-600
		"#d97706", // amber-600
		"#7c3aed", // purple-600
		"#db2777", // pink-600
		"#0891b2", // cyan-600
		"#65a30d", // lime-600
		"#c026d3", // fuchsia-600
		"#ea580c", // orange-600
		"#0d9488", // teal-600
		"#4f46e5", // indigo-600
		"#be123c", // rose-700
		"#0284c7", // sky-600
		"#16a34a", // green-600
		"#ca8a04", // yellow-600
		"#9333ea", // violet-600
		"#e11d48", // rose-600
		"#0e7490", // cyan-700
		"#84cc16", // lime-500
		"#1d4ed8", // blue-700
		"#b91c1c", // red-700
		"#047857", // green-700
		"#b45309", // amber-700
		"#6d28d9", // purple-700
		"#be185d", // pink-700
		"#0e7490", // cyan-700
		"#4d7c0f", // lime-700
		"#a21caf", // fuchsia-700
		"#c2410c", // orange-700
		"#115e59", // teal-700
		"#4338ca", // indigo-700
		"#9f1239", // rose-800
		"#075985", // sky-700
		"#15803d", // green-700
		"#a16207", // yellow-700
		"#7e22ce", // violet-700
		"#be123c", // rose-700
		"#155e75", // cyan-800
		"#65a30d", // lime-600
		"#3b82f6", // blue-500
		"#ef4444", // red-500
		"#10b981", // green-500
		"#f59e0b", // amber-500
		"#8b5cf6", // purple-500
		"#ec4899", // pink-500
		"#06b6d4", // cyan-500
		"#84cc16", // lime-500
		"#d946ef", // fuchsia-500
		"#f97316", // orange-500
	];

	// Use hash to pick a color consistently for each name
	const index = Math.abs(hash) % colors.length;
	return colors[index];
};
