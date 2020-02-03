import CSS from 'csstype'
import { EventEmitter } from '@/shared'

export function createSVGEl<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
  const ns = 'http://www.w3.org/2000/svg'

  return document.createElementNS(ns, tag)
}

/**
 * inline css
 */
export function css(el: HTMLElement | SVGElement, css: CSS.Properties | string) {
  if (typeof css === 'string') {
    el.setAttribute('style', css)
  } else {
    const styles = Object.entries(css)
    styles.forEach(([key, value]) => {
      // @ts-ignore
      el.style[key] = value
    })
  }
}

// init global events --- start
type IGlobalDomEvent = {
  pointerup(e: MouseEvent): void
  pointermove(e: MouseEvent): void
}

export const globalDomEvent = new EventEmitter<IGlobalDomEvent>()

window.addEventListener('pointerup', (e) => globalDomEvent.emit('pointerup', e))
window.addEventListener('pointermove', (e) => globalDomEvent.emit('pointermove', e))

// init global events --- end
