/** Golden-angle hues so nearby names stay distinct. */
export function playerColors(names: string[]): Map<string, string> {
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b))
  const map = new Map<string, string>()

  unique.forEach((name, index) => {
    const hue = Math.round((index * 137.508) % 360)
    const sat = 56 + (index % 4) * 6
    const light = 40 + (index % 5) * 3
    map.set(name, `hsl(${hue} ${sat}% ${light}%)`)
  })

  return map
}

export function playerColor(name: string, colors: Map<string, string>): string {
  return colors.get(name) ?? 'hsl(220 10% 46%)'
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
