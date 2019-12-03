export class Vec2 {
  x: number
  y: number

  static distance(v1: Vec2, v2: Vec2): number {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
  }

  constructor()
  constructor(vec2: Vec2)
  constructor(x: number, y: number)
  constructor(vec2OrX?: Vec2 | number, y?: number) {
    if (vec2OrX === undefined) {
      this.x = 0
      this.y = 0
    } else if (vec2OrX instanceof Vec2) {
      this.x = vec2OrX.x
      this.y = vec2OrX.y
    } else {
      this.x = vec2OrX
      this.y = y || 0
    }
  }

  plus(vec2: Vec2): void
  plus(x: number, y: number): void
  plus(vec2OrX: Vec2 | number, y?: number): void {
    if (vec2OrX instanceof Vec2) {
      this.x += vec2OrX.x
      this.y += vec2OrX.y
    } else {
      this.x += vec2OrX
      this.y += y || 0
    }
  }

  minus(vec2: Vec2): void
  minus(x: number, y: number): void
  minus(vec2OrX: Vec2 | number, y?: number): void {
    if (vec2OrX instanceof Vec2) {
      this.x -= vec2OrX.x
      this.y -= vec2OrX.y
    } else {
      this.x -= vec2OrX
      this.y -= y || 0
    }
  }

  distance(vec2: Vec2): number
  distance(x: number, y: number): number
  distance(vec2OrX: Vec2 | number, y?: number): number {
    const dot: Vec2 = vec2OrX instanceof Vec2 ? vec2OrX : new Vec2(vec2OrX, y || 0)

    return Vec2.distance(this, dot)
  }

  clone(): Vec2 {
    return new Vec2(this)
  }
}
