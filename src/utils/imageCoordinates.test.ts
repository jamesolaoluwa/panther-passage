import { welcomeScreenImage } from '../assets/registry'
import { normalizeRect, toPercentBox } from './imageCoordinates'

describe('image coordinates', () => {
  it('normalizes pixel bounds against the image size', () => {
    expect(normalizeRect({ x: 144, y: 256, width: 288, height: 512 }, 576, 1024)).toEqual({
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
    })
  })

  it('places the Get Started target over the drawn button, inside the image', () => {
    const { getStartedPixels: px, width, height } = welcomeScreenImage
    const box = toPercentBox(normalizeRect(px, width, height))
    expect(box.left).toBe(`${((122 / 576) * 100).toFixed(4)}%`)
    expect(box.centerY).toBe(`${(((858 + 31) / 1024) * 100).toFixed(4)}%`)
    expect(px.x + px.width).toBeLessThanOrEqual(width)
    expect(px.y + px.height).toBeLessThanOrEqual(height)
  })
})
