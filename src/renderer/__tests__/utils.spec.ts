import { createSVGEl, Transform } from '../utils'

describe('utils', () => {
  it('createSVGEl', () => {
    const svg = createSVGEl('svg')
    expect(svg).toBeInstanceOf(SVGElement)
  })

  it('Transform', () => {
    const mockEl = {
      transform: '',
      attr(key: string, val: string) {
        this.transform = val
      }
    }

    //@ts-ignore
    const a = new Transform(mockEl)
    a.move(1, 2)
    expect(mockEl.transform).toBe('translate(1px, 2px)')

    a.move(3, 4)
    expect(mockEl.transform).toBe('translate(3px, 4px)')

    a.scale(1)
    expect(mockEl.transform).toBe('scale(1) translate(3px, 4px)')

    a.scale(1, 2)
    expect(mockEl.transform).toBe('scale(1, 2) translate(3px, 4px)')

    a.scale(3)
    expect(mockEl.transform).toBe('scale(3) translate(3px, 4px)')

    a.rotate(16)
    expect(mockEl.transform).toBe('scale(3) translate(3px, 4px) rotate(16deg)')
  })
})
