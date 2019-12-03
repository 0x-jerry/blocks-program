import { Vec2 } from '../Vec2'

describe('Vec2', () => {
  it('constructor', () => {
    const v = new Vec2(1, 1)
    expect(v.x).toBe(1)
    expect(v.y).toBe(1)

    const v2 = new Vec2(v)
    expect(v2.x).toBe(1)
    expect(v2.y).toBe(1)

    expect(v).not.toBe(v2)

    const v3 = new Vec2(0, 0)
    expect(v3.x).toBe(0)
    expect(v3.y).toBe(0)
  })

  it('plus', () => {
    const v = new Vec2(1, 1)
    const v2 = new Vec2(2, 2)

    v2.plus(v)
    expect(v2.x).toBe(3)
    expect(v2.y).toBe(3)

    v2.plus(1, 1)
    expect(v2.x).toBe(4)
    expect(v2.y).toBe(4)
  })

  it('minus', () => {
    const v2 = new Vec2(4, 4)
    const v = new Vec2(1, 1)

    v2.minus(v)
    expect(v2.x).toBe(3)
    expect(v2.y).toBe(3)

    v2.minus(1, 1)
    expect(v2.x).toBe(2)
    expect(v2.y).toBe(2)
  })

  it('distance', () => {
    const v = new Vec2(0, 0)
    const v2 = new Vec2(3, 4)

    expect(v2.distance(v)).toBe(5)

    expect(v2.distance(v.x, v.y)).toBe(5)

    expect(Vec2.distance(v, v2)).toBe(5)
  })

  it('clone', () => {
    const v = new Vec2()

    const v1 = v.clone()

    expect(v).not.toBe(v1)
    expect(v).toEqual(v1)
  })
})
