export function mockBBoxRect() {
  return {
    x: 30,
    y: 20,
    height: 30,
    width: 20
  }
}

beforeEach(() => {
  //@ts-ignore
  window.SVGElement.prototype.getBBox = () => mockBBoxRect()
})
