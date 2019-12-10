import { Rect } from '@/renderer/lib'

describe('Shape', () => {
  it('Rect', () => {
    const r = new Rect(100, 100)

    expect(r.width).toBe(100)
    expect(r.height).toBe(100)

    r.setSize(200, 200)
    expect(r.width).toBe(200)
    expect(r.height).toBe(200)
    expect(r.attr('width')).toBe(200)
    expect(r.attr('height')).toBe(200)

    expect(r.bbox.width).not.toBe(200)
    expect(r.bbox.height).not.toBe(200)
  })
})
