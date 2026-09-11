/** Stable HSL from the name itself, so a person keeps the same color across years and filters. */
export function playerColor(name: string, colors?: Map<string, string>): string {
  return colors?.get(name) ?? colorFromName(name)
}

export function playerColors(names: string[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const name of names) {
    if (!map.has(name)) map.set(name, colorFromName(name))
  }
  return map
}

export function withAlpha(hsl: string, alpha: number): string {
  if (hsl.startsWith('hsl(') && hsl.endsWith(')')) {
    return `hsl(${hsl.slice(4, -1)} / ${alpha})`
  }

  const value = hsl.replace('#', '')
  if (value.length < 6) return hsl
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function colorFromName(name: string): string {
  const hash = hashName(name)
  // Golden-angle step so nearby hashes don't land in neighboring hues.
  const hue = (hash * 137.508) % 360
  // Independent bits + wider readable bands (avoid muddy gray and neon).
  const sat = 50 + ((hash >>> 11) % 26)
  const light = 38 + ((hash >>> 21) % 15)
  return `hsl(${hue} ${sat}% ${light}%)`
}

function hashName(name: string): number {
  let hash = 2166136261
  for (let i = 0; i < name.length; i++) {
    hash ^= name.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
