import '../jest.setup'
import { Area, Rect } from '@/renderer/lib'

describe('Area', () => {
  let area: Area

  beforeEach(() => {
    area = new Area(600, 400)
  })

  it('scrollTo', () => {
    area.scrollTo(0.1, 0.2)

    expect(area.scrolls.horizontal.currentPercentage).toBe(0.1)
    expect(area.scrolls.vertical.currentPercentage).toBe(0.2)
    expect(area.content.currentPercentage).toEqual({ x: 0.1, y: 0.2 })
  })

  it('setSize', (done) => {
    area.setSize(400, 300)

    setTimeout(() => {
      expect(area.size.width).toBe(400)
      expect(area.size.height).toBe(300)

      expect(area.background.width).toBe(400)
      expect(area.background.height).toBe(300)

      expect(area.content.width).toBe(400)
      expect(area.content.height).toBe(300)
      done()
    }, 200)
  })

  it('appendContent', () => {
    const a = new Rect(10, 10)
    a.move(10, 10)

    area.appendContent(a)
    expect(area.content.children.length).toBe(1)
  })

  it('removeContent', () => {
    const a = new Rect(10, 10)
    area.appendContent(a)
    expect(area.content.children.length).toBe(1)

    area.removeContent(a)
    expect(area.content.children.length).toBe(0)
  })
})
