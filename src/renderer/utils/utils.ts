export function createSVGEl<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
  const ns = 'http://www.w3.org/2000/svg'

  return document.createElementNS(ns, tag)
}
