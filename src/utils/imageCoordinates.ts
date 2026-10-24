export type NormalizedRect = {
  x: number
  y: number
  width: number
  height: number
}

export type PercentBox = {
  left: string
  width: string
  centerY: string
  height: string
}

export function normalizeRect(
  rect: { x: number; y: number; width: number; height: number },
  imageWidth: number,
  imageHeight: number,
): NormalizedRect {
  return {
    x: rect.x / imageWidth,
    y: rect.y / imageHeight,
    width: rect.width / imageWidth,
    height: rect.height / imageHeight,
  }
}

const pct = (n: number) => `${(n * 100).toFixed(4)}%`

export function toPercentBox(bounds: NormalizedRect): PercentBox {
  return {
    left: pct(bounds.x),
    width: pct(bounds.width),
    centerY: pct(bounds.y + bounds.height / 2),
    height: pct(bounds.height),
  }
}
