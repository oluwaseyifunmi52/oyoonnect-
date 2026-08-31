const PALETTES: Array<[string, string]> = [
  ['#0f766e', '#134e4a'],
  ['#0ea5e9', '#075985'],
  ['#8b5cf6', '#5b21b6'],
  ['#f59e0b', '#92400e'],
  ['#ef4444', '#991b1b'],
  ['#10b981', '#065f46'],
  ['#f97316', '#9a3412'],
  ['#06b6d4', '#155e75'],
]

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(label: string): string {
  return (
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

export function placeholderImage(
  seed: string,
  label: string,
  width = 800,
  height = 600,
): string {
  const palette = PALETTES[hashString(seed) % PALETTES.length] ?? PALETTES[0]
  const [from, to] = palette
  const mark = initials(label)
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0%" stop-color="${from}"/>`,
    `<stop offset="100%" stop-color="${to}"/>`,
    `</linearGradient></defs>`,
    `<rect width="${width}" height="${height}" fill="url(#g)"/>`,
    `<circle cx="${Math.round(width * 0.88)}" cy="${Math.round(height * 0.12)}" r="${Math.round(width * 0.3)}" fill="rgba(255,255,255,0.08)"/>`,
    `<circle cx="${Math.round(width * 0.08)}" cy="${Math.round(height * 0.92)}" r="${Math.round(width * 0.24)}" fill="rgba(255,255,255,0.06)"/>`,
    `<text x="50%" y="52%" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.round(width * 0.16)}" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle" dominant-baseline="middle">${mark}</text>`,
    `</svg>`,
  ].join('')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}